# grocy/ — the application under test

| | |
|---|---|
| `www/` | **Grocy 4.7.0's source, unchanged**, from the `lscr.io/linuxserver/grocy:4.7.0` image: PHP, views, migrations, localization, its Composer packages. MIT-licensed (`www/LICENSE.md`, copyright Bernd Bestel). Everything except `public/packages/`, the front-end dependencies, which the image supplies. |
| `init/` | A boot hook that turns the login screen off and hides the non-grocery features. Runs on every start. |
| `seed/` | The starting database, copied in on first start: migrated for 4.7.0 and filled with Grocy's own demo data (29 products, stock with dates, a shopping list) so the app is not empty on day one. |
| `Dockerfile` | The image plus the three things above. |

`www/` is the same tree in three places: it is built into the Grocy image, `docker compose
watch` syncs your edits into the running container, and the `unit` service mounts it at
`/app/grocy-src` for PHPUnit. What you read, run, and test is one copy.
