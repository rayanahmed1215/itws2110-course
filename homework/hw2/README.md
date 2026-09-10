# Homework 2 — Test Grocy

**Assigned:** Fri 9/11 · **Due:** Fri 9/18, 11:59 PM · **Individual**

On Tuesday you tested Pantry: 400 lines you could read end to end, with one rule missing.
This week you test something you did not write and cannot fully read:
[Grocy](https://github.com/grocy/grocy), a real, actively maintained PHP application for
running a household — groceries, stock, shopping lists — with a REST API and a web front
end. It has been in development since 2017. **It ships with no automated tests at all.**

That is the professional situation. It is the assignment Chojrin's chapter 7 is about, and
you should read that chapter alongside this. The tasks below follow Tuesday's parts in the
same order — use it, read the tests, prompt for one, API, browser — so everything you did
on Pantry has a counterpart here.

## Reading

Chojrin, *Modern Testing with PHP*, **chapter 7 — Case Study** (46 pp.), via the
[RPI library](https://learning-oreilly-com.libproxy.rpi.edu/library/view/modern-testing-with/9798868823268/).
He adds tests to Grocy — the same Grocy, the same version of the same file. Three
sections, weighted differently:

| Section | | Read it |
|---|---|---|
| *Characterization Tests on an Open Source Application* | He takes `helpers/UrlManager.php`, writes an assertion he knows is wrong, runs it, and copies what the failure tells him into the test. Then a data provider. | **Closely.** This is Task 2's method, on a different file. |
| *Development of a New Feature Using ATDD* | Adds an endpoint outside-in with mocks and test doubles. | Skim. It is where this course goes next month, not this week. |
| *Testing a Web Page* | HTML assertions with a crawler; then one paragraph on browser tools like Playwright: "better kept to a minimum". | The last paragraph. It is the pyramid, from the other side. |

## Get the starter

```bash
cp -R ../itws2110-course/homework/hw2/starter/. homework/hw2/
```

Copying the files across in Finder or Explorer works just as well. Your write-up goes in
`homework/hw2/WRITEUP.md`; the starter includes it.

## What you are given

| | |
|---|---|
| `docker-compose.yml` | Grocy, plus `unit`, `api` and `e2e` — the same three names as Tuesday |
| `grocy/www/` | **Grocy's entire source**, 4.7.0, unchanged, MIT-licensed. The Grocy you run is built from it, `watch` syncs your edits into it, and the unit tests import from it. One tree: what you read is what runs is what you test. |
| `grocy/init/`, `grocy/seed/`, `grocy/Dockerfile` | The boot hook that turns the login screen off, the starting database (migrated, and filled with Grocy's demo data), and the three-line Dockerfile that puts them together. Read the comments; you do not edit these. |
| `Dockerfile` | One image of test tools, built from the **same lines as the Pantry image**, so Docker reuses what you already have |
| `tests/unit/`, `tests/api/`, `tests/e2e/` | **One working example test in each.** They run. Your job is to add to them. |
| `WRITEUP.md` | Task 5 |

The three verbs are the same as always: `docker compose watch` for Grocy, `run --rm` for a
test suite, `down` to stop.

---

## Task 0 — Bring it up, and use it

```bash
docker compose watch
```

The first time, this builds Grocy from the source in `grocy/www/` — the pinned image with
that tree laid over it, a few seconds on top of the pull — and then stays attached to its
log. From then on it works exactly as it did for Pantry: save a file under `grocy/www/` and
the terminal says `Syncing service "grocy"`. Open a second terminal for everything else;
`Ctrl+C` stops the watching and `docker compose down` stops Grocy.

Prove the sync to yourself once: change `ReleaseDate` in `grocy/www/version.json`, then open
<http://localhost:9283/api/system/info>.

Open <http://localhost:9283>. No login, and not empty: the pantry you are looking at is the
one Grocy's own developers use to demonstrate it — 29 products in five locations, stock
with best-before dates, a shopping list, some recipes — generated once with Grocy's demo
data tool and shipped as the starting database. Some of it is already overdue, on purpose.
Spend five minutes just reading it: the stock overview, one product's page, the shopping
list. Then add a product of your own, buy some, consume some. Then do the thing that broke
Pantry: **try to consume more than you have.** Grocy stops you. Find out
*how* — what the page does, and then what the API does. Open <http://localhost:9283/api>:
that is Swagger, the live documentation of Grocy's REST API, and **the front end you just
used is a client of it**, exactly as Pantry's page was. Try `GET /objects/products` from the
Swagger page and find the product you made, then `POST /stock/products/{productId}/consume`
with more than is in stock and read what comes back.

Write down what you find. Task 3 turns it into a test.

## Task 1 — Read the three examples, then run them

Same order as Tuesday: read first.

- `tests/unit/GrocycodeTest.php` — one PHPUnit test on `Grocycode::Validate()`, a pure
  function inside Grocy. Note the shape: assert( act( arrange ) ), like `DueDateTest`.
- `tests/api/products.spec.js` — one Playwright `request` test. Note that a Grocy product
  needs a location and a quantity unit, and the test *asks the API which ones exist*
  rather than guessing ids.
- `tests/e2e/products.spec.js` — one browser test. Note the three dropdowns that start on
  a blank placeholder, and the `waitForURL` before the assertion.

Then run them, in pyramid order:

```bash
docker compose run --rm unit
docker compose run --rm api
docker compose run --rm e2e
```

The first `run` builds the test image. If you built Pantry on Tuesday, most of it is
already on your machine. **Done when** all three are green before you have written a line.

## Task 2 — Unit tests on Grocy's own code (`tests/unit/`)

Open `grocy/www/helpers/Grocycode.php`. A *Grocycode* is Grocy's own barcode format:
`grcy:p:42` means product 42. `Validate()` is string in, boolean out — no database, no
globals — which is why it is the place to start. The rules of the format are in the docblock
at the top and in `setFromCode()`. Read both.

**1. Prompt for the first test**, the way you did on Tuesday. The sentence to test:

> A Grocycode with an empty id — `grcy:p:` — is not valid. `Validate()` returns `false`.

Five-part prompt: the class, whole; `tests/unit/GrocycodeTest.php`, whole, for style; the
sentence above with that exact input; what not to do (no editing `grocy/www`, no changing
the existing test, one behaviour per test); where it runs (`phpunit.xml` points at
`tests/unit`; the `Grocy\Helpers\` namespace maps to Grocy's `helpers/` folder). Send it,
check what comes back against the shape from Tuesday, paste it in, run.

**2. It is red.** Grocy says `grcy:p:` *is* valid. You do not change Grocy's code — it is not
yours, and the next release would put it back. Make the test say what Grocy actually does:

1. Change the assertion to what the failure told you: `assertTrue`, not `assertFalse`.
2. Rename the test to say so: `test_an_empty_id_is_currently_accepted`.
3. Above it, a comment: what you expected, what Grocy does, why you think Grocy is wrong.

Run. Green. A test that pins down what code does today, so that a change is noticed, is
called a *characterization test*. The comment is your bug report; the write-up asks for it.

**3. Five more.** Bring the file to at least six tests that pin down the format: other object
types, a wrong prefix, a missing id, extra data fields, whatever else the source tells you.
Prompt for them or write them by hand — either way, **run each one before you trust it**. At
least one more will surprise you the same way `grcy:p:` did.

**Done when** `docker compose run --rm unit` prints six or more sentences with ticks, and at
least one test carries a comment explaining why you think Grocy is wrong.

## Task 3 — Three API tests (`tests/api/`)

Tuesday's Part 3. Playwright's `request` fixture talks to `/api/...` directly:

1. `POST /api/objects/products` creates a product; `GET` returns it. *(The example — read it.)*
2. `POST /api/stock/products/{id}/add` then `.../consume` leaves the expected amount.
3. **Consuming more than is in stock is refused** — the status code and message you found
   in Task 0 — and the stock is unchanged afterwards. The same rule as Pantry's `422`, in
   someone else's API.

Every test creates its own product. Note the time per test; it goes in the write-up.

## Task 4 — Three end-to-end tests (`tests/e2e/`)

Tuesday's Part 4. Playwright driving the real UI, one test per user story:

1. A user can **create a product** and see it in the products list. *(The example.)*
2. A user can **purchase** some of that product and see the quantity in stock.
3. A user can **consume** some and see the quantity go down.

Each test sets up its own data — do not depend on test 1 having run. Selectors are the
work here; the example shows how Grocy names its form fields, and a failing test leaves a
screenshot in `test-results/`. Time these too — and reread the last paragraph of chapter 7
while you wait: browser tests are "better kept to a minimum, as they are both costly to
write and hard to keep up to date". Three is the minimum.

## Task 5 — Write it up (`WRITEUP.md`)

Four questions and one paste — the prompt and what you did with the red test, the ratio,
something Grocy did that you did not expect, and what you could not test. Plus what broke,
and the **AI Use Statement — required.** Which tools, what for, what you changed.

---

## Grading

| | |
|---|---|
| Task 0–1 — up, explored, examples green | 10% |
| Task 2 — six+ unit tests on `Grocycode`, one characterization test with a comment | 30% |
| Task 3 — three API tests, including the refusal | 20% |
| Task 4 — three e2e tests, each self-contained | 25% |
| Task 5 — write-up | 15% |

*Autochecked:* `docker compose run --rm unit` passes with ≥ 6 tests; `run --rm api` with
≥ 3; `run --rm e2e` with ≥ 3; no `.db` file committed.

## Submission

Everything in `homework/hw2/` in **your own private repository**. Commit to `main` and
push.

```bash
git add homework/hw2/
git commit -m "HW2: testing Grocy"
git push
```

Do not commit `config/data/*.db` — the `.gitignore` excludes it; the database is your local
state. `grocy/www/` *is* committed, all of it, license included — it is about 30 MB and four
thousand files, which is what a real application looks like. To put Grocy back to the
starting pantry, stop it and delete `config/data/grocy.db`; the seed is copied back in on
the next start.
