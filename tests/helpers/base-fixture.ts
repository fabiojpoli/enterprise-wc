/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Page, test as baseTest } from '@playwright/test';

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output');

/**
 * Generate a Unique ID
 * @returns {string} the unique ID
 */
export function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Extends the test command in playwright
 */
export const test = baseTest.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() => window.addEventListener('beforeunload', () => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))),);
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
      if (coverageJSON) { fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`), coverageJSON); }
    });
    await use(context);
    for (const page of context.pages()) {
      await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)));
    }
  }
});

/**
 * Adds a command to mount a blank page
 * @param {any} page the page element
 * @param {string} html the html element
 * @returns {unknown} the element that was inserted
 */
export async function mount<T>(page: Page, html: string): Promise<T> {
  await page.goto('/ids-demo-app/blank.html');
  await page.evaluate((pageHtml: string) => {
    const body = document.querySelector('body');
    if (body) {
      body.innerHTML = pageHtml;
    }
  }, html);

  const tagHandle = await page.locator('body:first-child');
  return tagHandle as T;
}

export const expect = test.expect;
