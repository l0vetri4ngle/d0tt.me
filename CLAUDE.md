# billy — project instructions

## Purpose

`billy` is Billy’s minimal, brutalist portfolio and project archive. It
showcases creative software, visual design, music systems, artificial
intelligence, live performance tools, and experimental interfaces.

The site should remain quiet, direct, and easy to inspect. The projects are the
content; the interface should not compete with them.

## Local development

Requirements: Node.js 18+.

```bash
npm start
```

The local site runs at <http://127.0.0.1:6967>.

Useful routes:

- `/` — index navigation
- `/projects` — stacked project-name index
- `/research` — working themes and questions
- `/about` — provisional biography and practice summary
- `/notes` — public notes index
- `/cms` — local notes editor
- `/archive/projects-original.html` — inactive archived card layout

The server is intentionally bound to `127.0.0.1`. The CMS is local-only and is
not intended to be exposed directly to the public internet.

## CMS workflow

1. Start the server with `npm start`.
2. Open <http://127.0.0.1:6967/cms>.
3. Create a note with a title, slug, date, excerpt, and body.
4. Upload optional images, audio, or video from the media field.
5. Review the live preview.
6. Select `publish` to create or update the note.
7. Use the saved-notes list to edit or delete existing entries.
8. Confirm the public result at <http://127.0.0.1:6967/notes>.

Content is stored in `content/notes.json`. Uploaded files are stored in
`public/media/`. Keep both under version control so notes and media are backed
up and can be published later.

The CMS currently supports plain text. Keep paragraphs readable and avoid
putting secrets, credentials, or private personal information into notes or
uploaded media.

Images, audio, and video uploads become media blocks. Link blocks can be added
with the `add link block` control. The public note renderer and CMS preview use
the same flush, borderless block alignment.

The saved-notes list's `edit` and `delete` controls (`public/cms.js`,
`renderNotes()`) are both real `<button>` elements, not anchors — this keeps
them keyboard-focusable and screen-reader-legible. Keep them as buttons if
this markup changes.

## Static publishing

GitHub Pages is published by `.github/workflows/pages.yml` on every push to
`main`: it runs `npm run prepare:pages`, uploads `public/` as the Pages
artifact, and deploys it directly — there is no `gh-pages` branch. The custom
domain is declared in `public/CNAME` for `d0tt.me`.

Before a Pages deployment, synchronize CMS content and generate the single-page
route fallback:

```bash
npm run prepare:pages
```

This copies `content/notes.json` to `public/notes.json` and copies
`public/index.html` to `public/404.html`, allowing client-side project and note
routes to work on GitHub Pages.

The local CMS API does not run on GitHub Pages. Publishing a CMS change requires
running the preparation script, committing the updated static files, and
pushing the publishing branch.

## Design language

- Background: `#FFFFFF`
- Primary text: `#000000`
- Link blue: `#0000EE`
- Font: Arial, with Helvetica as fallback
- Navigation: `44px`, on every page including the CMS
- Footer credit: `11px`, fixed bottom-left, on every page including the CMS
- No gradients, shadows, rounded corners, or decorative UI
- Note text and media blocks share a flush left edge and have no visible frame
- Keep spacing and hierarchy sparse — margins and gaps sit on a 4px grid
- Use lowercase interface labels unless a project name or proper noun requires
  otherwise
- Use 6-digit hex (`#000000`, not `#000`) for color values

The active site uses `public/styles.css`. `public/cms.css` extends it with
CMS-only form and preview styling and must stay consistent with these same
tokens rather than introducing its own. The archived card layout has its own
stylesheet and should not be treated as the active design system.

## Content structure

Project data is hardcoded in `public/app.js` — there is no CMS for projects.
Notes have no client-side fallback: `app.js` starts with an empty `notes`
array and populates it by fetching `/api/notes` (local server) or falling
back to `/notes.json` (static hosting); the source of truth is always
`content/notes.json`, managed through the CMS. Rendering helpers shared
between the public site and the CMS (`escapeHtml`, `safeUrl`, `link`,
`mediaBlock`) live in `public/shared.js`, loaded before `app.js` and `cms.js`.
When adding a project, keep the case-study fields consistent:

- `slug`
- `title`
- `description`
- `role`
- `status`
- `stack`
- `overview`
- `details`

The `projects` array in `public/app.js` is ordered newest first: add a new
project at the top of the array. `otoma`, Billy's first project, is fixed at
the bottom as the oldest entry, and the rest of the order reflects when each
project was actually started — check the project's own repo history before
inserting one in the middle rather than guessing from feel.

`projectPage()` HTML-escapes every project text field (`title`, `description`,
`role`, `status`, `stack`, `overview`, and each `details` label/text) before
rendering. Write plain characters (`&`, `<`, `>`) directly in project data —
do not hand-write HTML entities (`&amp;`, `&lt;`) to work around escaping,
that now produces double-escaped text on the page.

Dedicated project routes are rendered client-side as `/projects/<slug>`.
Dedicated note routes are rendered as `/notes/<slug>`. `notesIndexPage()`
sorts notes by `date` descending at render time, so entries in
`content/notes.json` don't need to be stored in any particular order.

## Server/API

`server.js` is a small Node HTTP server. It serves static files, provides the
local notes API, and accepts local media uploads:

- `GET /api/notes`
- `POST /api/notes`
- `DELETE /api/notes/<slug>`
- `POST /api/media`

Saving or deleting a note automatically removes any `public/media/` files that
are no longer referenced by any note (`pruneOrphanedMedia` in `server.js`).
Only locally uploaded media is pruned this way; external links are left alone.

Do not expose the CMS API publicly without adding authentication, upload limits,
and a persistent storage strategy.

## Verification

Before handing off changes:

```bash
node --check public/shared.js
node --check public/app.js
node --check public/cms.js
node --check server.js
npm run prepare:pages
```

Check the index, projects, one dedicated project, notes, one dedicated note,
the CMS, and the archived layout in a browser. Preserve existing user content
and avoid destructive commands.
