import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig<TestOptions>({
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    navigationTimeout: 5000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
      },
    },
    {
      name: 'staging',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
