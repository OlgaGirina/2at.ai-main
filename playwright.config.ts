import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: 15000,
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
    headless: !!process.env.CI,
    ignoreHTTPSErrors: true,   // ⬅️ SSL ошибки игнорируем
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 10000,

  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup-client',
      testMatch: '**/auth.client.setup.ts',
      use: {
        baseURL: process.env.CLIENT_URL || 'https://2at.ai',
        browserName: 'firefox'

      }
    },
    {
      name: 'setup-provider',
      testMatch: '**/auth.provider.setup.ts',
      use: {
        baseURL: process.env.PROVIDER_URL || 'https://pro.2at.ai',
        browserName: 'firefox',
      }
    },
    {
      name: 'client',
      dependencies: ['setup-client'],
      testMatch: '**/client.spec.ts',

      use: {
        //...devices['Desktop Chrome'],
        baseURL: process.env.CLIENT_URL || 'https://2at.ai',
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
        baseURL: process.env.PROVIDER_URL || 'https://pro.2at.ai',
        browserName: 'firefox',
      },
    },
    {
      name: 'auth-client',
      testMatch: '**/authTestv2.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.CLIENT_URL || 'https://2at.ai',
        storageState: undefined,
        // browserName: 'firefox'
      },

    },
    {
      name: 'auth-provider',
      testMatch: '**/authTestv2provider.spec.ts',

      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.PROVIDER_URL || 'https://pro.2at.ai',
        storageState: undefined,
        browserName: 'firefox',
      },

    },
    {
      name: 'registration',
      testMatch: '**/registration.spec.ts',

      use: {
        //...devices['Desktop Chrome'],
        baseURL: process.env.CLIENT_URL || 'https://2at.ai',
        storageState: undefined,
        browserName: 'firefox',
      },
    },

    {
      name: 'caseCreation',
      testMatch: '**/caseCreation.spec.ts',

      use: {
        storageState: 'authProvider.json',
        baseURL: process.env.PROVIDER_URL || 'https://pro.2at.ai',
        browserName: 'firefox',

      }
    }

  ]
});
