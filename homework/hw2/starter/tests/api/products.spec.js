const { test, expect } = require('@playwright/test');

// One working API test. No browser: Playwright's `request` fixture talks HTTP
// to Grocy's REST API, the same API the web front end uses for everything.
// Swagger for it is at /api. Your two tests for Task 3 go beside this one.

test('POST /api/objects/products creates a product that GET returns', async ({ request }) => {
  const name = `API Apples ${Date.now()}`;                          // arrange

  // A product needs a location and a quantity unit. Ask the API which ones
  // exist rather than guessing an id -- a fresh database numbers them itself.
  const [location] = await (await request.get('/api/objects/locations')).json();
  const [unit] = await (await request.get('/api/objects/quantity_units')).json();

  const created = await request.post('/api/objects/products', {   // act
    data: { name, location_id: location.id, qu_id_purchase: unit.id, qu_id_stock: unit.id },
  });
  expect(created.ok()).toBeTruthy();                                // assert: the status...
  const { created_object_id: id } = await created.json();

  const fetched = await request.get(`/api/objects/products/${id}`);
  expect(fetched.ok()).toBeTruthy();                                // ...and that a GET gives it back
  expect((await fetched.json()).name).toBe(name);
});
