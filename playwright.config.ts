import { defineConfig } from '@playwright/test';

export default defineConfig({

    testDir: './tests',
    // testIgnore: ['tests/citizen_search.spec.ts'],
    fullyParallel: false,  // Keep false to maintain shared session  
    forbidOnly: false,
    retries: 0,
    workers: 1,  // Single worker to share browser session
    maxFailures: 0,
    reporter: [
        ['html'],
        ['list'],
        ['json', { outputFile: 'test-results.json' }],
        ['allure-playwright', { outputFolder: 'allure-results' }]
    ],
    timeout: 300000,
    expect: {
        timeout: 10000
    },
    use: {
        baseURL: 'https://sit-bayambang.aris.ph',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 30000,
        navigationTimeout: 60000,
        ignoreHTTPSErrors: true
    },

    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                viewport: { width: 1366, height: 768 },
                launchOptions: {
                    headless: false,
                    args: ['--start-maximized']
                }
            }
        }
    ]
});