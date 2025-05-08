### Todo

```ts
// 1. Install:
//    npm install -D @playwright/test
//    npx playwright install

import { test, expect, chromium, firefox, webkit } from '@playwright/test';

// Define the browsers you want to test
const browsers = [
  { name: 'Chromium', instance: chromium },
  { name: 'Firefox',  instance: firefox  },
  { name: 'WebKit',   instance: webkit   },  // simulates Safari
];

for (const {name, instance} of browsers) {
  test.describe(`${name} smoke test`, () => {
    test(`${name} should reach homepage without endless redirect`, async () => {
      const browser = await instance.launch();
      const context = await browser.newContext({
        // start with no cookies (fresh visitor)
        storageState: undefined,
      });
      const page = await context.newPage();

      // Go to your production URL
      await page.goto('https://www.asross.com');

      // Check final URL isn’t stuck on /elevator
      expect(page.url()).not.toContain('/elevator');

      // Optionally take a screenshot for later inspection
      await page.screenshot({ path: `error-${page.context().browser()?.browserType().name()}.png` });
      await browser.close();
    });
  });
}

```
