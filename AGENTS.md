# billy — project instructions

## Purpose

`billy` is Brandon Ocampo’s minimal, brutalist portfolio and project archive. It
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

## Static publishing

GitHub Pages publishes the static `gh-pages` branch for `d0tt.me`. The custom
domain is declared in `public/CNAME` and the repository root `CNAME`.

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
- Index and project-index navigation: `44px`
- Footer credit: `11px`, fixed bottom-left
- No gradients, shadows, rounded corners, or decorative UI
- Keep spacing and hierarchy sparse
- Use lowercase interface labels unless a project name or proper noun requires
  otherwise

The active site uses `public/styles.css`. The archived card layout has its own
stylesheet and should not be treated as the active design system.

## Content structure

Project and note data currently live in `public/app.js` as the client-side
fallback and in `content/notes.json` for CMS-managed notes. When adding a
project, keep the case-study fields consistent:

- `slug`
- `title`
- `description`
- `role`
- `status`
- `stack`
- `overview`
- `details`

Dedicated project routes are rendered client-side as `/projects/<slug>`.
Dedicated note routes are rendered as `/notes/<slug>`.

## Server/API

`server.js` is a small Node HTTP server. It serves static files, provides the
local notes API, and accepts local media uploads:

- `GET /api/notes`
- `POST /api/notes`
- `DELETE /api/notes/<slug>`
- `POST /api/media`

Do not expose the CMS API publicly without adding authentication, upload limits,
and a persistent storage strategy.

## Verification

Before handing off changes:

```bash
node --check public/app.js
node --check public/cms.js
node --check server.js
npm run prepare:pages
```

Check the index, projects, one dedicated project, notes, one dedicated note,
the CMS, and the archived layout in a browser. Preserve existing user content
and avoid destructive commands.
