import puppeteer from 'puppeteer-core';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 900);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/isaia/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(async () => {
  const step = 150;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 120));
  }
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise(r => setTimeout(r, 300));
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 800));

const dir = './temporary screenshots';
await import('node:fs').then(fs => fs.promises.mkdir(dir, { recursive: true }));
let n = 1;
const fs = await import('node:fs');
while (fs.existsSync(`${dir}/screenshot-${n}${label ? '-' + label : ''}.png`)) n++;
const path = `${dir}/screenshot-${n}${label ? '-' + label : ''}.png`;
await page.screenshot({ path, fullPage: true });
console.log(path);
await browser.close();
