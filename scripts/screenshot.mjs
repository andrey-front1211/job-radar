import { chromium } from 'playwright';
import { resolve } from 'node:path';

const file = 'file://' + resolve('preview/demo.html');
const browser = await chromium.launch();

const shoot = async (name, { width, height, theme = 'light', action } = {}) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.route('**://www.arbeitnow.com/**', (route) => route.abort());
  await page.route('**/api/job-board-api**', (route) => route.abort());
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(file, { waitUntil: 'load' });
  await page.waitForSelector('.job-row', { timeout: 15000 });
  await page.waitForTimeout(400);
  if (action) await action(page);
  await page.screenshot({ path: `docs/${name}.png`, fullPage: false });
  await page.close();
};

await shoot('desktop-light', { width: 1440, height: 1080, theme: 'light' });
await shoot('desktop-dark', { width: 1440, height: 1080, theme: 'dark' });
await shoot('drawer', {
  width: 1440,
  height: 1080,
  theme: 'dark',
  action: async (page) => {
    await page.getByRole('button', { name: 'Подробнее' }).first().click();
    await page.waitForTimeout(500);
  },
});
await shoot('mobile', { width: 390, height: 844, theme: 'light' });

await browser.close();
console.log('screenshots ready');
