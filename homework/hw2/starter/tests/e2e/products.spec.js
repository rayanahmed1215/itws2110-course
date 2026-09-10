const { test, expect } = require('@playwright/test');

// One working end-to-end test. It creates a product through the real UI and
// checks it shows up. Your three tests for Task 2 go beside it.
//
// Every test makes its own product with a unique name, so tests never depend
// on each other or on what is already in the database.

test('a user can create a product and see it in the product list', async ({ page }) => {
  const name = `Test Apples ${Date.now()}`;                       // arrange: a name nobody else will use

  await page.goto('/product/new');                                 // act: what a person does...
  await page.fill('#name', name);
  // The three dropdowns start on a blank placeholder, and Grocy will not save
  // without them. Index 1 is the first real choice.
  await page.selectOption('#location_id', { index: 1 });
  await page.selectOption('#qu_id_purchase', { index: 1 });
  await page.selectOption('#qu_id_stock', { index: 1 });
  await page.click('#save-product-button');
  await page.waitForURL(/\/(products|product\/[0-9]+)$/);        // ...and waits for the page to move on

  await page.goto('/products');                                    // assert: is it where a person would look?
  await expect(page.locator('#products-table')).toContainText(name);
});
