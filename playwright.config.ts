import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
 import dotenv from 'dotenv';
 import path from 'path';
 dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  //testIgnore: ['tests/auth.setup.ts'],
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {    
    trace: 'on-first-retry',
    headless: true, 
    ignoreHTTPSErrors: true,   // ⬅️ SSL ошибки игнорируем
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  /* Configure projects for major browsers */ 
   projects: [
{
  name: 'setup-client',
  testMatch: '**/auth.client.setup.ts',
  use: {
  baseURL: 'https://2at.ai',
  browserName: 'firefox'
}
},
{
  name: 'setup-provider',
  testMatch: '**/auth.provider.setup.ts',
  use: {
 baseURL: 'https://pro.2at.ai',
 browserName: 'firefox',
      }
},
{
  name: 'client',
  dependencies: ['setup-client'],
  testMatch: '**/client.spec.ts',

  use: {
    //...devices['Desktop Chrome'],
    baseURL: 'https://2at.ai',
    storageState: 'authClient.json',
    browserName: 'firefox',
  },
},
{
  name: 'provider',
  dependencies: ['setup-provider'],
  testMatch: '**/provider.spec.ts',
  use: {
    //...devices['Desktop Chrome'],
    storageState: 'authProvider.json',
    baseURL: 'https://pro.2at.ai',
    browserName: 'firefox',
  },
},
{
  name: 'auth-client',
  testMatch: '**/authTestv2.spec.ts',
  use: { ...devices['Desktop Chrome'],
    baseURL: 'https://2at.ai',
    storageState: undefined,
   // browserName: 'firefox'
     },
 
},

{
  name: 'auth-provider',
  testMatch: '**/authTestv2provider.spec.ts',

  use: { ...devices['Desktop Chrome'],
    baseURL: 'https://pro.2at.ai',
    storageState: undefined,
    browserName: 'firefox', },
    
},
{
  name: 'registration',
  testMatch: '**/registration.spec.ts',

  use: {
    //...devices['Desktop Chrome'],
    baseURL: 'https://2at.ai',
    storageState: undefined,
    browserName: 'firefox',
  },
},
 /*  {
      name: 'firefox-provider',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/provider.json',
      },
    }, */

]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  
});
