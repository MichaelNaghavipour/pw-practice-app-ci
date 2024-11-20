import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';
import * as dotenv from 'dotenv';
import { Token } from '@angular/compiler';

dotenv.config();

export default defineConfig<TestOptions>({
  timeout: 40000,
  // globalTimeout: 60000,
  expect: {
    timeout: 2000,
    toHaveScreenshot: {maxDiffPixels: 50}
  },

  retries: 1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
        token: "f5e6e0573b0e5e869e43689ec088cce3e2c3f41f",
      },
    ],
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    // ['allure-playwright'],
    ['html']
  ],

  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
          : process.env.STAGING === '1' ? 'http://localhost:4202/'
          : 'http://localhost:4200/',

    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },

  projects: [
    {
      name: 'dev',
      use: { 
        browserName: 'chromium',
        baseURL: 'http://localhost:4200/'
      },
    },
    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox'
      },
    },
    {
      name: 'pageObjectsFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: {width: 1920, height: 1018}
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 14 Pro']
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/'
  }
});
