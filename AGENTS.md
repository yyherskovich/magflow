# PublicationFlow website

This repository publishes publicationflow.com through GitHub Pages from main.

Every HTML page, including new pages, must contain the Google Analytics tag for
G-ZS4E43QH65 exactly once in its head. After creating any page, run:

    node scripts/analytics.mjs --write
    node scripts/analytics.mjs

The first command adds the shared tag to new untagged pages. The second checks
all pages for missing, incorrect, or duplicate tags. Keep this check passing
before committing or publishing. Do not add another analytics loader or send a
second manual page_view event: Google's config command already sends pageviews.
