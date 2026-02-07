#!/usr/bin/env node
/**
 * Генерирует WebP версию героя для LCP/скорости.
 * Запуск: node scripts/generate-hero-webp.mjs (после npm install sharp)
 */
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public/images/optimized/e09')
const conversions = [
  {
    src: join(root, 'public/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png'),
    out: join(outDir, 'e09007396221ccbae983f19a970e4be5.webp'),
  },
  {
    src: join(root, 'public/upload/iblock/e09/hero-vstavnye.png'),
    out: join(outDir, 'hero-vstavnye.webp'),
  },
  {
    src: join(root, 'public/upload/iblock/e09/hero-remont.png'),
    out: join(outDir, 'hero-remont.webp'),
  },
]

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.warn('sharp не установлен. Установите: npm install sharp --save-dev')
    process.exit(1)
  }
  mkdirSync(outDir, { recursive: true })
  for (const { src, out } of conversions) {
    if (!existsSync(src)) continue
    const buf = readFileSync(src)
    await sharp(buf).webp({ quality: 82, effort: 4 }).toFile(out)
    console.log('WebP создан:', out)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
