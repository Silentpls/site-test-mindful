import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const pages = process.argv.slice(2);
const dir = './temporary screenshots';
fs.mkdirSync(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/isaia/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  headless: true,
});
for (const p of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:3000/${p}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: `${dir}/${p.replace('.html', '')}-top.png` });
  await page.evaluate(() => window.scrollTo(0, 250));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${dir}/${p.replace('.html', '')}-scrolled.png` });
  await page.close();
}
await browser.close();
console.log('done');
