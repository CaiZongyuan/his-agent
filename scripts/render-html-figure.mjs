#!/usr/bin/env node
/**
 * render-html-figure.mjs — HTML 图稿源 → 高分辨率 PNG（Chromium 确定性渲染）
 *
 * 用法：
 *   node scripts/render-html-figure.mjs <input.html> <output.png> [逻辑宽度，默认1280]
 *
 * 约定（docs/style/README.md）：
 *   - 图稿源放 docs/style/sources/，PNG 母版落 outputs/imagegen/（Git 忽略），
 *     教程采用的压缩图（cwebp -q 90）放对应文档的 assets/ 目录。
 *   - deviceScaleFactor 2：逻辑 1280px → 物理 2560px，正文 ≥13px 保证缩印后 ≥5pt 字号下限。
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// playwright 解析：默认从当前 Node 解析路径找；若本机只有 npx 缓存安装，
// 通过环境变量 PLAYWRIGHT_DIR 指向含 node_modules/playwright 的目录（机器相关配置不入库）。
const pwDir = process.env.PLAYWRIGHT_DIR;
const req = pwDir ? createRequire(resolve(pwDir, 'noop.js')) : createRequire(import.meta.url);
const { chromium } = req('playwright');

const [input, output, widthArg] = process.argv.slice(2);
if (!input || !output) {
  console.error('用法: node render-html-figure.mjs <input.html> <output.png> [width]');
  process.exit(1);
}
const width = parseInt(widthArg || '1280', 10);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 900 },
  deviceScaleFactor: 2,
});
await page.goto(pathToFileURL(resolve(input)).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(400); // 字体渲染余量
await page.screenshot({ path: output, fullPage: true });
await browser.close();

// 输出物理尺寸便于核对
const { statSync } = await import('node:fs');
const kb = (statSync(output).size / 1024).toFixed(0);
console.log(`rendered ${output} (${kb} KB, viewport ${width}px @2x)`);
