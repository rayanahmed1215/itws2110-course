module.exports = {
  testDir: './tests',
  reporter: 'list',
  retries: 0,
  // Grocy is one SQLite database. Two tests writing to it at the same time is
  // a real race, so run them one at a time -- and notice that this is a
  // property of the system under test, not of Playwright.
  workers: 1,
  fullyParallel: false,
  timeout: 20000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:9283',
    browserName: 'chromium',
    // On failure, keep a screenshot and a page snapshot in test-results/.
    screenshot: 'only-on-failure',
  },
};
