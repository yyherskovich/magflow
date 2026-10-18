# PublicationFlow website

Static website for https://publicationflow.com, published by GitHub Pages from main.

## Google Analytics

All HTML pages use Google Analytics 4 measurement ID `G-ZS4E43QH65`.
The tag is installed in each page's head and automatically records pageviews.

When adding pages, run `node scripts/analytics.mjs --write` to install the same
tag on every new HTML page. Run `node scripts/analytics.mjs` to verify coverage
and catch duplicate tags. GitHub Actions runs this check on pushes and pull requests.

To check collection, open Google Analytics > Reports > Realtime and visit the
website in a browser without a tracking blocker. The source tag being present
does not by itself verify receipt in the Analytics property.
