#!/usr/bin/env node
import { chromium } from 'playwright';

const DOMAINS = [
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

    if (paid) {
      await page.getByRole('button', { name: 'Рассчитать стоимость' }).first().click();
    } else {
      await page.getByRole('button', { name: 'Заказать обратный звонок' }).first().click();
    }

    await page.waitForTimeout(700);
    const goal = await page.evaluate(() => window.__goalCalls.at(-1) || null);

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
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  try {
    for (const domain of DOMAINS) {
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

  if (status !== 'PASS') {
    process.exitCode = 1;
  }
}

main();
