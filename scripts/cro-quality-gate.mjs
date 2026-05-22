#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FALLBACK_DOMAINS = [
  'setki21.ru',
  'setkimoskitki.ru',
  'www.setki21.ru',
  'www.setkimoskitki.ru',
  'xn--116-qddpl1cj.xn--p1ai',
  'www.xn--116-qddpl1cj.xn--p1ai',
  'xn--e1agaahbbnszfhh.xn--p1ai',
  'www.xn--e1agaahbbnszfhh.xn--p1ai',
];

const RUN_ID = new Date().toISOString();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPORTS_DIR = path.resolve(__dirname, '..', 'docs', 'reports', 'cro-quality-gates');
const SAVE_REPORT = !process.argv.includes('--no-save');
const DEALERS_API_URL = process.env.CRO_GATE_DEALERS_API_URL || 'https://setki21.ru/api/v1/admin/dealers';
const DEALERS_API_TOKEN = process.env.CRO_GATE_BEARER_TOKEN || '';

function normalizeDomain(raw) {
  const value = String(raw || '').trim().toLowerCase();
  if (!value) return null;
  const withProto = value.includes('://') ? value : `https://${value}`;
  try {
    const host = new URL(withProto).hostname.toLowerCase().replace(/^www\./, '');
    return host || null;
  } catch {
    return null;
  }
}

function expandDomainVariants(domain) {
  const root = normalizeDomain(domain);
  if (!root) return [];
  return [root, `www.${root}`];
}

async function loadDomains() {
  try {
    const headers = {
      Accept: 'application/json',
    };
    if (DEALERS_API_TOKEN) {
      headers.Authorization = `Bearer ${DEALERS_API_TOKEN}`;
    }

    const response = await fetch(DEALERS_API_URL, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const dealers = await response.json();
    if (!Array.isArray(dealers)) {
      throw new Error('Dealers API did not return an array');
    }

    const domains = new Set();
    for (const dealer of dealers) {
      for (const candidate of expandDomainVariants(dealer?.domain)) {
        domains.add(candidate);
      }
    }

    if (!domains.size) {
      throw new Error('No dealer domains returned by API');
    }

    const list = Array.from(domains).sort();
    console.error(`[cro-quality-gate] loaded ${list.length} domains from API`);
    return list;
  } catch (error) {
    console.error(`[cro-quality-gate] failed to load domains from API: ${String(error?.message || error)}`);
    console.error('[cro-quality-gate] falling back to static domain list');
    return FALLBACK_DOMAINS;
  }
}

function expectedGoal(paid) {
  return paid
    ? { name: 'CTA_CALCULATE_CLICK', segment: 'paid' }
    : { name: 'CTA_CALLBACK_CLICK', segment: 'organic' };
}

async function runCase(browser, domain, paid) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  await context.addInitScript(() => {
    window.__goalCalls = [];
    window.reachMetrikaGoal = (name, params) => {
      window.__goalCalls.push({ name, params: params || null });
    };
  });

  const page = await context.newPage();
  try {
    const url = `https://${domain}/${paid ? '?yclid=test123' : ''}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1200);

    const ctaName = paid ? 'Рассчитать стоимость' : 'Заказать обратный звонок';
    const cta = page.getByRole('button', { name: ctaName }).first();
    await cta.click();

    await page.waitForTimeout(700);
    let goal = await page.evaluate(() => window.__goalCalls.at(-1) || null);
    if (!goal) {
      // Safety retry for occasional click/render race on live pages.
      await page.waitForTimeout(500);
      await cta.click();
      await page.waitForTimeout(900);
      goal = await page.evaluate(() => window.__goalCalls.at(-1) || null);
    }

    const expectation = expectedGoal(paid);
    const ok = Boolean(
      goal &&
      goal.name === expectation.name &&
      goal.params &&
      goal.params.segment === expectation.segment &&
      typeof goal.params.variant_id === 'string' &&
      goal.params.variant_id.length > 0 &&
      goal.params.dealer_domain === domain,
    );

    return {
      domain,
      mode: paid ? 'paid' : 'organic',
      ok,
      url,
      goal,
      expectation,
    };
  } catch (error) {
    return {
      domain,
      mode: paid ? 'paid' : 'organic',
      ok: false,
      error: String(error?.message || error),
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const domains = await loadDomains();
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  try {
    for (const domain of domains) {
      rows.push(await runCase(browser, domain, true));
      rows.push(await runCase(browser, domain, false));
    }
  } finally {
    await browser.close();
  }

  const passed = rows.filter((row) => row.ok).length;
  const total = rows.length;
  const status = passed === total ? 'PASS' : 'FAIL';

  const report = {
    run_id: RUN_ID,
    status,
    passed,
    total,
    rows,
  };

  console.log(JSON.stringify(report, null, 2));

  if (SAVE_REPORT) {
    const stamp = RUN_ID.replaceAll(':', '-').replaceAll('.', '-');
    const jsonPath = path.join(REPORTS_DIR, `${stamp}.json`);
    const mdPath = path.join(REPORTS_DIR, `${stamp}.md`);
    await mkdir(REPORTS_DIR, { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    const markdown = [
      `# CRO Quality Gate`,
      ``,
      `- run_id: \`${RUN_ID}\``,
      `- status: \`${status}\``,
      `- passed: \`${passed}/${total}\``,
      ``,
      `## Cases`,
      ``,
      `| Domain | Mode | Result | Goal | Segment | Variant |`,
      `| --- | --- | --- | --- | --- | --- |`,
      ...rows.map((row) => {
        const result = row.ok ? 'PASS' : 'FAIL';
        const goalName = row.goal?.name || 'n/a';
        const segment = row.goal?.params?.segment || 'n/a';
        const variant = row.goal?.params?.variant_id || 'n/a';
        return `| ${row.domain} | ${row.mode} | ${result} | ${goalName} | ${segment} | ${variant} |`;
      }),
      ``,
    ].join('\n');
    await writeFile(mdPath, markdown, 'utf8');
    console.error(`[cro-quality-gate] report saved: ${jsonPath}`);
    console.error(`[cro-quality-gate] report saved: ${mdPath}`);
  }

  if (status !== 'PASS') {
    process.exitCode = 1;
  }
}

main();
