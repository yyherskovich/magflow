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

Marketing updates: keep Tutorials out of navigation while it covers the desktop version.
Trial buttons should say Start Free Trial and link to /contact/. Preserve the form
confirmation at /contact/thanks/ with its immediate-access button to /demo/.
Present the online option as the online demo, with professional, factual copy. Avoid
unverified feature claims and unfinished/development wording. Keep the ACP Associate Member badge
in the marketing-page footer; membership was confirmed for November 2026 through
October 2027. Reconfirm membership before extending that claim beyond that period.

Tidio live chat: every marketing HTML page, including new pages, must include exactly
one async loader before </body> for
https://code.tidio.co/iyvdeiw59ir0j541zpgtjv8q6jgwgnir.js.
The /demo/ page only forwards to the existing app and does not load the marketing widget.
Keep the widget installation separate from the trial form endpoint and analytics.

Online positioning: /online/ and the current Q&A are the current online feature overview.
Lead with online bookings, customers, flatplans, invoices, collections and reports.
Production InDesign generation and specialized desktop tools use the desktop workflow.
Do not claim feature-for-feature parity or describe planned AI booking as already available.
Published $100/$149 plans are desktop plans; confirm online pricing with the owner.
Keep public copy and FAQ structured data consistent.
