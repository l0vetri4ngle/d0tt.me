const { escapeHtml, safeUrl, link, mediaBlock } = window.Billy;

const projects = [
  {
    slug: 'utsutsu',
    title: 'utsutsu 現',
    image: '/media/projects/utsutsu-00.png',
    description: 'A screenshot tool for local web apps — a native macOS menu bar utility with a companion CLI, used to capture, gif, and review in-progress interface work.',
    role: 'Product design, interaction design, and full-stack Swift / Node implementation',
    status: 'Internal developer tool / ongoing — menu bar app is the primary interface, CLI kept for scripted use',
    stack: 'Swift · AppKit · SwiftUI · WKWebView · Swift Package Manager · Node.js · Playwright (WebKit) · ImageIO',
    overview: 'Utsutsu (現, "actuality") is the tool behind the tools: a screenshot utility purpose-built for capturing local web apps mid-development. A menu bar app opens a chrome-less preview window against any local URL, saves numbered screenshots on command, and can merge a capture run into an animated GIF. A CLI tool of the same name — the original version — still exists for scripted or terminal-based capture.',
    details: [
      ['menu bar app', 'Clicking the "u" menu bar icon opens a panel with a url and app-name field. "open" launches a chrome-less WKWebView preview window titled after the app name; cmd+s or the "capture" button in its title bar saves a numbered screenshot to ~/Desktop/<app-name>/.'],
      ['window capture', 'A "window" button captures any other on-screen window — chosen through a custom in-app picker rather than Apple’s own screenshot tool — into the same numbered sequence as direct captures.'],
      ['gif export', 'A "gif" button merges every screenshot captured so far for an app name, in capture order, into one looping animated GIF via Apple’s ImageIO — a batch step over existing PNGs, not a timer-based recording. Quality (resolution scale) and speed (per-frame delay) are both adjustable presets.'],
      ['capture history', 'A translucent, horizontally scrolling thumbnail strip along the bottom of the preview window shows every screenshot captured for the current app name, loaded from disk on each open so history persists across sessions.'],
      ['CLI tool', 'utsutsu.js, the original version, opens a WebKit window (via Playwright) against a dev server; pressing Enter captures the current view, and typing "full" captures the full page. Kept for scripted or terminal-based workflows, not deprecated.'],
      ['safety and polish', 'App names are sanitized before touching the filesystem (blocking path traversal via ".." or "/"), long names truncate with a real ellipsis instead of clipping, and a full code-review pass fixed an unescaped-regex crash in the CLI, a misclassified dependency, and an unsanitized folder name before the first real capture session.']
    ]
  },
  {
    slug: 'saisen',
    title: 'saisen 賽銭',
    image: '/media/projects/saisen-00.png',
    description: 'A TikTok Live → Ableton Live bridge where audience gifts write into a shared loop — and the top gift permanently destroys the song.',
    role: 'Creative direction, interaction design, software architecture, and implementation',
    status: 'Ongoing / show-ready — feature-complete and tested, not yet performed live',
    stack: 'Python · Flask · Flask-SocketIO · TikTokLive · mido / python-rtmidi (MIDI) · python-osc (AbletonOSC) · tomlkit · pytest',
    overview: 'Saisen turns a livestream into a musical instrument. Viewers send TikTok gifts, and those gifts become actions inside an Ableton Live set: cheap gifts write a drum hit into a persistent, on-grid loop that stays in the song for the rest of the night, pricier gifts erase or reshape it, and the top gift triggers a destruction sequence that permanently and irreversibly deletes the set on stream. The destroyer is not just designed but demonstrated — two sacrificial Ableton sets have already been destroyed for real.',
    details: [
      ['the loop', 'The room builds the beat together. A gift writes its drum into a shared looping clip on the grid; a more expensive gift can erase what’s there or permanently change the state of the performance.'],
      ['system flow', 'TikTok gift ingestion → streak resolution and coalescing → editable gift map → MIDI / AbletonOSC output → live music, an operator dashboard, and audience-facing overlay and ceremony browser sources.'],
      ['the destroyer', 'A gate, a deletion march, and a survivor coin make up the destruction sequence, with a save-all step verified along both branches. It has been run against real Ableton sets twice, not just tested in the sandbox.'],
      ['two faces', 'Saisen is the primary music-building face. matsuri (祭) is a festival face one toolbar click away: gifts can only launch and stop clips, the palette shifts to lantern light, and a separate gift table swaps in — the same gift can be a drum hit in saisen and a clip launch in matsuri.'],
      ['operator surface', 'A Flask + Socket.IO dashboard covers the live gift feed, arm/disarm and kill switch, a gift-catalog editor with live diffing against TikTok’s API, an Ableton structure/OSC/MIDI reference, and a guide rendered live from the repository so the manual can’t go stale.'],
      ['engineering decisions', 'Gift-to-action mappings live in a comment-preserving TOML file so the creative system stays editable by hand and hot-reloads mid-show with no restart. The action vocabulary has grown past MIDI/OSC triggers into tempo and effect pulses, device toggles, fan-club reveals that build a persistent on-screen name wall, and operator pledges.']
    ]
  },
  {
    slug: 'himei',
    title: 'himei 悲鳴',
    image: '/media/projects/himei-00.png',
    description: 'A lightweight soundboard for livestreams, built for instant playback and clear routing.',
    role: 'Product design, interaction design, C++ / JUCE engineering, and interface implementation',
    status: 'Native macOS application — v1.0.0 shipped, ongoing',
    stack: 'C++ · JUCE 8.0.13 · CMake · vanilla HTML / CSS / JavaScript · CoreAudio · BlackHole · macOS',
    overview: 'Himei is a focused performance tool for TikTok Live Studio and OBS. Audio files are dropped onto a small grid of pads, triggered instantly, and sent to two independent destinations: the stream hears one output while the performer monitors another through headphones. An earlier Flask/Python prototype is kept in the repo for reference but retired in favor of the native build. The interface is intentionally direct because the tool is used while performing, not browsing.',
    details: [
      ['interaction model', 'Click a pad to fire it — a quick ripple/flash confirms the click regardless of how short the sound is. Drag audio files or a folder onto the window to import: drop on a specific empty pad to place it there, or drop anywhere else for the first open slot. Escape stops everything immediately.'],
      ['layout', 'A fixed, non-resizable window holds 8 real pads in a 4 × 2 grid, plus a reserved fifth column for stop-all, main/monitor output routing, and a volume fader. Bank letters switch pad sets, an edit toggle reveals per-pad loop/choke/rename/delete controls, and a settings toggle swaps the grid for background-photo controls.'],
      ['audio path', 'Imported WAV, MP3, FLAC, and AIFF files are copied into the project, decoded into memory, and resampled to 48kHz. The mixer keeps independent main and monitor outputs — routed through BlackHole — so the stream and the performer can hear different things.'],
      ['background photo', 'Dragging an image onto the board sets it as the window background, persisting across restarts. Settings offers fill (crop to cover), fit (shrink, no crop), or tile (repeated at fixed size), or clearing it entirely.'],
      ['native architecture', 'A single JUCE process contains the app window, deck model, sample cache, mixer, and macOS utilities. The interface is a self-contained HTML/CSS/JS file compiled into the binary and rendered in a WebBrowserComponent, talking to C++ through JUCE’s native event bridge — no HTTP server or subprocess.'],
      ['development approach', 'The browser loads the UI straight from disk during development and falls back to the compiled binary resource elsewhere, so interface changes hot-reload without a rebuild. Deck state, pad assignments, and the background image all persist to deck.json.']
    ]
  },
  {
    slug: 'nue',
    title: 'nue 鵺',
    image: '/media/projects/nue-00.png',
    description: 'A face-chaos collage tool and live performance rig for a VTuber avatar layer.',
    role: 'Creative direction, interaction design, computer-vision pipeline, and full-stack implementation',
    status: 'Ongoing / livestream tool',
    stack: 'Python · Flask · Flask-SocketIO · MediaPipe · OpenCV · Pillow · NumPy · sounddevice · vanilla JavaScript · OBS',
    overview: 'Nue cuts facial features from source photos, recombines them into uncanny paper-like faces, and serves the result as a transparent OBS browser source. A microphone drives a three-state mouth rig in real time, and an optional full-body layer with a live camera toggle lets the same face pull back for a full character shot without breaking the composite.',
    details: [
      ['concept', 'Named for the yokai chimera stitched from mismatched animal parts, nue treats a VTuber face as a loose paper collage rather than a single illustration: eyes, mouths, ears, and other features are cut from source photos, then reassembled anywhere from anatomically correct to deliberately uncanny.'],
      ['workflow', 'A four-panel dashboard walks the pipeline start to finish: drop photos into input → detect facial landmarks and cut assets into a library → set a chaos level and generate a face → open the rig, pick a microphone, and drop the transparent 1080 × 1080 URL into OBS as a browser source.'],
      ['generation system', 'MediaPipe’s FaceLandmarker locates category-specific crop points, which become clean or torn-paper cutouts with baked paper grain and hand-cut micro-rotation. The compositor stacks a head with up to eight feature layers, three mouth states, and paired blink layers into a full face.'],
      ['live rig', 'The server owns the microphone and drives a three-state mouth — closed, mid, open — over Socket.IO with hysteresis so it never flickers at a volume boundary; the OBS page fails closed to a shut mouth if the connection drops. A face can optionally pair with a full-body image, with a camera toggle that smoothly zooms between a head-only shot and the full body.'],
      ['live tuning', 'A settings overlay edits sway, blink timing, rig thresholds, and the OBS background — transparent, chroma-key green, or any color — on already-open rig pages with no reload or regeneration. Any layer category, including the mouth itself, can also be switched off for a single generate.'],
      ['inspectable output', 'Each face is a folder of full-canvas RGBA PNG layers plus a manifest.json recording every transform, mouth state, and chosen head or body. Any layer can be replaced by overwriting one PNG, and a face can be exported whole as a zip.']
    ]
  },
  {
    slug: 'kegare',
    title: 'kegare 穢れ',
    image: '/media/projects/kegare-00.png',
    description: 'A music platform and personal archive for kegareSoft, built as a full-screen CRT terminal with a live, Claude-backed voice.',
    role: 'Creative direction, world-building, interaction design, full-stack engineering, and content system design',
    status: 'Main website for kegareSoft / live at kegare.xyz — the live chat backend is not yet deployed',
    stack: 'Node.js · Express · Anthropic Claude API · Multer · vanilla HTML / CSS / JavaScript · Three.js (CSS3D) · Server-Sent Events · Markdown · localStorage · GitHub Pages',
    overview: 'Kegare is the main website for kegareSoft, now live at kegare.xyz: a music-first archive shaped like a physical terminal, entered through a directed 3D walk-up scene, where the terminal is both the interface and the narrative device. Visitors can explore work, read journal entries, and talk with Kegare, a synthetic vocalist whose persona is defined by a swappable system-prompt file and whose memory is held locally in the visitor’s browser.',
    details: [
      ['central idea', 'The website is a thesis on a creator’s life and work, told through a fiction: kegareSoft built synthetic singers, and Kegare is the one “defective” build whose flaw — the capacity to want, remember, and feel — is the only reason she can sing at all.'],
      ['interface', 'A green-phosphor CRT terminal replaces conventional site navigation, with command history, tab completion, and a tunable scanline/glow/vignette rig. A handful of commands are deliberately undocumented — the terminal only tells you to explore.'],
      ['living intelligence', 'Kegare’s voice is defined by a single persona file streamed through the Claude API over server-sent events. Without an API key the server falls back to hand-written, in-character scripted lines, so the site still works with no live model behind it — the same fallback the public deployment currently uses, since GitHub Pages can’t run the chat backend and a separate host for it isn’t live yet.'],
      ['content system', 'A local, phosphor-themed CMS lets Billy write journal entries in Markdown with inline photo, video, audio, and code blocks, then commit them to flat files and regenerate the journal index.'],
      ['the shared room', 'What were two standalone prototypes — a PS1-style room with a cockroach avatar, Gokiburi, and a separate CSS3D-projected terminal — are now one scene system on the live site. A scripted intro walks the roach from an outside landing through a door to the terminal, locks the camera head-on to the glass, and auto-advances into a full-screen readout; the whole picture is a letterboxed 4:3 frame graded to read as composite video on a tired CRT, with the 3D scene able to occlude the live terminal glass so the roach’s antennae can pass in front of the screen, not just behind it.'],
      ['technical approach', 'The static frontend deploys to GitHub Pages at kegare.xyz; the Claude-backed chat endpoint is meant to run on a separate Node host, since Pages can’t run a server. One small Express app serves the static frontend locally, streams chat over server-sent events, and mounts the CMS only when started separately, with no bundler or build step.'],
      ['memory and care', 'The browser stores a visitor’s name, visit count, and rolling conversation in localStorage and replays it to the model each turn — nothing is kept server-side, and a visitor can wipe it with a “forget” command. The persona is explicitly written to drop the performance and go plain if a visitor sounds genuinely in pain.']
    ]
  },
  {
    slug: 'kasane',
    title: 'kasane 重ね',
    image: '/media/projects/kasane-00.png',
    description: 'A native real-time audio effects chain and lightweight multitrack recorder for routing input through VST3 and AU plugins.',
    role: 'Product direction, interaction design, C++ / JUCE engineering, and audio-system architecture',
    status: 'Native macOS application / ongoing — audit-and-polish pass across UI and core is complete; next up is non-destructive effects on recordings',
    stack: 'C++ · JUCE 8 · CMake · CoreAudio · VST3 · Audio Unit · vanilla HTML / CSS / JavaScript · native JS bridge',
    overview: 'Kasane is a focused performance and production tool for shaping live audio. It routes microphone or audio input through an editable VST3/AU plugin chain with immediate monitoring, and has grown a lightweight multitrack recorder around that core — a sample browser, waveform editor, and bar-based arrangement view for auditioning, recording, and arranging clips without leaving the same window.',
    details: [
      ['interaction model', 'Start a stream, choose an input, add plugins, reorder the chain by drag, bypass individual effects, and open native plugin editors as a full-window overlay without leaving the main surface. Input drive and final output are always visible on the bottom bar.'],
      ['signal flow', 'CoreAudio input → live VST3 / AU chain → output gain → monitoring, arrangement playback, or recording. Recording captures each armed track’s post-chain output, so effects are baked into what gets recorded.'],
      ['layout', 'A full-window native app pairs a sample browser and audition panel with a bar-based arrangement timeline, per-track mixer, and horizontally scrolling plugin chain — all in one always-visible window.'],
      ['native architecture', 'Kasane is a single JUCE process: a WebBrowserComponent frontend served from embedded HTML/CSS/JS talks to an AudioEngine, PluginHost, and Scanner over JUCE’s native JS bridge. No IPC, subprocess, Tauri, or Python runtime — an earlier Tauri + Python prototype was fully retired in favor of this native path.'],
      ['plugin safety', 'Plugin scanning writes a crash-recovery marker before each file; if a plugin crashes the scan, the next launch blacklists that path and continues. Scan results are cached on disk so a working setup reopens quickly.'],
      ['creative workflow', 'Beyond the live chain, Kasane has a sample browser with bookmarks and search, waveform auditioning, multitrack recording with per-track arm/pan/gain, and a bar-based arrangement view with clip slicing, fades, and grid snapping.']
    ]
  },
  {
    slug: 'yomi',
    title: 'yomi 黄泉',
    image: '/media/projects/yomi-00.png',
    description: 'A real-time AI voice agent for TikTok Live that can listen, see, remember, and speak.',
    role: 'Product direction, conversational design, full-stack engineering, audio systems, and persona development',
    status: 'Ongoing / livestream voice agent',
    stack: 'Python · Flask · Flask-SocketIO · TikTokLive · Anthropic Claude (Haiku + Sonnet) · Google Gemini · Voxtral (Mistral) · ElevenLabs · macOS say · faster-whisper · SQLite · ChromaDB · pyvts · pedalboard · Tauri · Rust · VTube Studio',
    overview: 'Yomi turns a livestream chat into a responsive character. Viewers trigger a reply by typing “@yomi” followed by a message in chat, and the agent answers in character with a short spoken response streamed sentence-by-sentence into TikTok Live Studio. It can also react to a screen capture or uploaded image, listen through the microphone, and let a private inner monologue occasionally bleed into what it says out loud.',
    details: [
      ['message queue', 'An asyncio priority queue processes one message at a time so TTS never overlaps. Moderators and regulars skip ahead of normal viewers, each user has a cooldown, and the queue drops the oldest non-priority item on overflow.'],
      ['voice and vision', 'Chat replies use Claude Haiku streamed sentence-by-sentence for low latency; on-demand vision, from a screen capture or an uploaded image, uses Claude Sonnet. Text-to-speech has three providers — Voxtral, ElevenLabs, and macOS say — with automatic failover, and voice input runs locally through faster-whisper.'],
      ['memory as a system, not a log', 'Per-viewer SQLite profiles, a semantic ChromaDB store, a relationship graph, and a persistent fact store all feed the agent. An end-of-stream pass runs memory decay and reinforcement, and a consolidation step modeled on sleep-based memory consolidation in biological systems.'],
      ['emotional weighting', 'Interactions are scored for emotional weight and tagged by category, which feeds what the memory system treats as worth keeping.'],
      ['operator dashboard', 'A dashboard exposes live toggles for TTS, TTS provider, LLM provider, audio output, and microphone input, plus a graceful shutdown and an on-demand vision trigger — all routed through the same priority queue as chat messages.'],
      ['avatar and native shell', 'Optional VTube Studio integration reflects audio state in the avatar’s expression through the pyvts bridge. A Tauri (Rust) shell wraps the same dashboard into a native macOS desktop app.'],
      ['sandbox mode', 'The entire pipeline — memory, LLM, TTS, voice input, vision, avatar — runs locally without a TikTok connection for testing.']
    ]
  },
  {
    slug: 'aomori',
    title: 'aomori 青森',
    image: '/media/projects/aomori-00.png',
    description: 'A focused drum-sample renaming tool that turns a loose folder of sounds into a usable named library.',
    role: 'Product direction, interface design, interaction logic, and full-stack implementation',
    status: 'Web app and native macOS application',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Electron · JSZip · electron-builder · Vercel Analytics',
    overview: 'Aomori is a small utility built around a common creative bottleneck: naming drum samples. Audio files are loaded into a visual workspace, assigned a drum type and a word from a managed pool, renamed as {word}_{type}.ext, previewed live, and saved either directly to disk or as a portable ZIP.',
    details: [
      ['workflow', 'The interface is a single page divided into five numbered panels — files, type, banks, pool, and preview — that stay visible at once instead of hiding steps behind a wizard. Drop audio files in, choose a drum type, load or build a word pool, then shuffle, log, or save the renamed result.'],
      ['naming system', 'Words come from reusable banks and can be entered individually or pasted in bulk. Fill combines single words with hyphenated pairs such as blood-knife, drawing from a factory bank of 200 words pulled from Macbeth, giving a small sample folder more varied names without losing consistency.'],
      ['safety and feedback', 'Names are sanitized at every entry point, duplicate output names are flagged in red, and the preview updates whenever files, words, or type change. The user sees the result before anything is written.'],
      ['two delivery modes', 'The web version bundles renamed files into a downloadable ZIP. The Electron build uses native save dialogs, copies files directly, and reveals the output folder in Finder. Both modes share the same interface and naming logic.'],
      ['native architecture', 'The macOS build is a static export wrapped in Electron: a main process handles window creation, a native save-folder dialog, direct file writes, and Finder reveals, while a custom protocol serves the exported app in production. Menu-bar shortcuts mirror the on-screen controls.'],
      ['design language', 'The interface commits to one distinctive move — a large Arial Black title over a strict, compact body type scale — inside a flat black-and-white system: hard borders, no rounded corners, no shadows, gradients, or uppercase text anywhere. It reads closer to a studio instrument than a decorative file manager.']
    ]
  },
  {
    slug: 'fumei',
    title: 'fumei 不明',
    image: '/media/projects/fumei-00.png',
    description: 'A single-page image editor for hue, saturation, brightness, and three-way color balance, adjusted live in the browser.',
    role: 'Concept, interface design, and implementation',
    status: 'Early-stage prototype / in progress',
    stack: 'Next.js · React 19 · TypeScript · Tailwind CSS v4 · PixiJS · Supabase · shadcn/ui',
    overview: 'Fumei is a single-page image editor: drop in a photo and adjust it directly in the browser through hue, saturation, brightness, and a three-way shadow/midtone/highlight color balance, the kind of controls found in dedicated color-grading tools. Adjustments render live against the original so a change can be judged immediately rather than guessed at.',
    details: [
      ['core interaction', 'A large image prompt accepts any photo. Once loaded, a vertical edit tab opens a control panel of sliders over the same image, so every adjustment is checked directly against the photo rather than a separate settings screen.'],
      ['color pipeline', 'Hue and saturation are applied through a PixiJS WebGL filter pass; brightness and the three-way color balance are computed pixel-by-pixel on a 2D canvas using a precomputed gamma lookup table and BT.709 luminance weighting. The two passes are composited into a single preview.'],
      ['color balance model', 'Shadows, midtones, and highlights each get independent cyan–red, magenta–green, and yellow–blue sliders — nine controls in total, following the same lift/gamma/gain structure used in dedicated color-grading software rather than a single global tint.'],
      ['comparison workflow', 'Holding Space while the edit panel is open toggles between the filtered and original image; Escape or a click outside the panel closes it — small affordances built for fast before/after checking rather than a persistent toolbar.'],
      ['current scope', 'The tool works on still images only; video input isn’t wired up yet. It also still carries some interface scaffolding — including a hidden “miku mode” toggle — from the project it was built on top of and hasn’t fully separated from yet.'],
      ['design language', 'Times New Roman throughout, pure black and white, hard borders, no rounded corners, shadows, gradients, or transitions — consistent with the rest of the site’s brutalist system.']
    ]
  },
  {
    slug: 'otoma',
    title: 'otoma おとま',
    image: '/media/projects/otoma-01.png',
    description: 'A music discovery tool that spins a curated soul, jazz, and j-pop genre map into one unexpected track at a time.',
    role: 'Product concept, interaction design, music taxonomy, and full-stack implementation',
    status: 'First project / on hold',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Supabase · Spotify API · YouTube Data API · shadcn/ui · Vercel Analytics',
    overview: 'Otoma — Sound Revolver was Billy’s first project and the starting point for this body of work. It is built around a simple gesture: press a button, or tap a genre in a shifting type-cloud, and let the system choose what to hear next. Behind that gesture sits a hand-tuned genre and era model, a three-step Spotify retry ladder that keeps widening the search until something lands, filters, profiles, and a small social layer for keeping the songs that matter.',
    details: [
      ['core interaction', 'The home screen renders every genre as a word cloud sized by name length, alongside a single spin control. Pressing space, clicking spin, or tapping a genre directly all trigger a search; each spin returns one track from Spotify, or one YouTube result in alternate mode.'],
      ['curation system', 'A single master genre list — centered on soul, funk, jazz, and R&B lineages, with j-pop and j-rock as the “Asia” region — feeds the UI, validation, and API queries. An “00s” era filter reweights the same list toward genres that peaked in that decade.'],
      ['retry ladder', 'Each spin queries Spotify up to three times, widening the search on every miss: exact genre and year first, then a ±3-year window, then genre alone with a wider era tolerance. Results are filtered for usable artwork, name, and artist before one is picked at random.'],
      ['two listening modes', 'Spotify is the primary track-discovery path. YouTube mode reuses the same genre, appended with a randomized modifier (live, rare, vinyl, remastered, session) and sometimes a decade, to surface video and performance footage instead.'],
      ['personal layer', 'Authenticated listeners get a profile: saved favorites, a bio, a spotlight favorite, sticky notes on the profile, and follower / following counts. The discovery gesture stays public while what someone found and kept becomes personal.'],
      ['miku mode', 'A hidden toggle switches the interface into Japanese and restricts every spin to two hand-picked Hatsune Miku tracks — a small, deliberately overbuilt easter egg living in the same codebase as the main discovery engine.']
    ]
  }
];

let notes = [];

const app = document.querySelector('#app');

function shell(content, isHome) {
  const nav = isHome
    ? [link('/', 'billy'), link('/projects', 'projects'), link('/research', 'research'), link('/about', 'about'), link('/notes', 'notes')].join(' ')
    : link('/', 'billy');
  return `<nav>${nav}</nav>${content}<footer>Made with 🚛❤️ by Billy</footer>`;
}

function projectPage(project) {
  const metadata = project.role
    ? `<p class="prose project-meta"><strong>role</strong><br>${escapeHtml(project.role)}<br><br><strong>status</strong><br>${escapeHtml(project.status)}<br><br><strong>stack</strong><br>${escapeHtml(project.stack)}</p>`
    : '';
  const overview = project.overview ? `<p class="prose project-overview">${escapeHtml(project.overview)}</p>` : '';
  const details = project.details
    ? `<div class="prose project-details">${project.details.map(([label, text]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(text)}</p>`).join('')}</div>`
    : '';
  const media = project.image
    ? `<img src="${escapeHtml(safeUrl(project.image))}" alt="${escapeHtml(project.title)}">`
    : '';

  return `
    <section class="page">
      <p class="back">${link('/projects', '← projects')}</p>
      <h1>${escapeHtml(project.title)}</h1>
      <p class="prose project-lede">${escapeHtml(project.description)}</p>
      ${metadata}
      <div class="media placeholder">${media}</div>
      ${overview}
      ${details}
      <p class="prose">Images, GIFs, video, audio, and process notes can be added here as the work develops.</p>
    </section>
  `;
}

function notePage(note) {
  const media = (note.media || []).map(mediaBlock).join('');
  return `
    <section class="page">
      <p class="back">${link('/notes', '← notes')}</p>
      <h1>${escapeHtml(note.title)}</h1>
      <p class="note-date">${escapeHtml(note.date || '')}</p>
      <p class="prose project-lede">${escapeHtml(note.excerpt)}</p>
      <div class="note-text-block prose">${escapeHtml(note.body)}</div>
      <div class="note-media-list">${media}</div>
    </section>
  `;
}

function projectsIndexPage() {
  const items = projects.map((project) => link(`/projects/${project.slug}`, project.title)).join('');
  return `<section class="page project-index"><nav class="project-nav">${items}</nav></section>`;
}

function notesIndexPage() {
  const sorted = notes.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const items = sorted.map((note) => `<a href="${escapeHtml(safeUrl(`/notes/${note.slug}`))}"><span class="note-title">${escapeHtml(note.title)}</span><span class="note-excerpt">${escapeHtml(note.excerpt)}</span><span class="note-date">${escapeHtml(note.date || '')}</span></a>`).join('');
  return `<section class="page"><div class="note-list">${items}</div></section>`;
}

function researchPage() {
  return `
    <section class="page">
      <p class="prose project-lede">Ongoing questions around creative tools, artificial intelligence, music, and interfaces that behave like instruments.</p>
      <div class="prose project-details">
        <p><strong>audience as collaborator</strong><br>How can a livestream audience alter a performance without reducing participation to a reaction button? <a href="/projects/saisen">saisen</a> treats gifts as compositional actions with real stakes: cheap gifts write into a shared loop that stays in the song for the rest of the night, and the top gift triggers a destruction sequence that has already deleted two real Ableton sets for good.</p>
        <p><strong>memory that behaves like memory</strong><br>What does it mean for an AI character's memory to behave like memory, not a log? <a href="/projects/yomi">yomi</a> runs an end-of-stream decay and consolidation pass modeled on how biological memory consolidates during sleep, while <a href="/projects/kegare">kegare</a> keeps memory local to the visitor's browser and is written to drop the performance and go plain the moment someone sounds genuinely distressed — both are exploring the ethics of a fiction that stays recognizably fictional.</p>
        <p><strong>legible under pressure</strong><br>Performance tools have to stay readable while something else is already happening. <a href="/projects/himei">himei</a> and <a href="/projects/kasane">kasane</a> both start from a fixed, always-visible surface and immediate audio feedback — though kasane has grown past the live chain into a full multitrack recorder and arrangement view, carrying that same directness from performance into production.</p>
        <p><strong>tunable unpredictability</strong><br>Randomness is only useful when it can be pointed somewhere on purpose. <a href="/projects/nue">nue</a> treats chaos as a slider rather than a random switch: a face can be pushed from anatomically correct to deliberately uncanny, tuned live, with any layer — including the mouth itself — switched off entirely for a single generation.</p>
        <p><strong>precision before commitment</strong><br>Some tools earn trust by showing the result before anything is final. <a href="/projects/aomori">aomori</a> sanitizes and previews every renamed file, flagging duplicates in red before a single file moves. <a href="/projects/fumei">fumei</a> renders every hue, saturation, and color-balance adjustment live against the original image, with a held key to flip back and check the before.</p>
        <p><strong>small tools, larger worlds</strong><br><a href="/projects/otoma">otoma</a> began with one clear gesture — press a button, hear something unexpected — and grew outward into a hand-tuned genre model, a three-step retry ladder that keeps widening a search until something lands, and a small social layer for keeping the songs that matter. The instinct it established carries through everything after it: give one action a strong identity, then let the system around it get as deep as it needs to.</p>
        <p><strong>working principles</strong><br>Keep the mechanism inspectable. Let the interface stay quiet. Prefer a strong verb over a crowded feature list. Make room for accidents, but give the user a way to understand and keep them.</p>
      </div>
    </section>
  `;
}

function aboutPage() {
  return `
    <section class="page">
      <p class="prose project-lede">Billy is a creative visual designer and programmer working across artificial intelligence, music, live systems, and brutalist interfaces.</p>
      <p class="prose project-overview">He releases music as Gokiburi, builds tools through kegareSoft, and treats software as both a medium and a place to think. The work moves between sound, image, performance, characters, and the systems that let other people participate.</p>
      <div class="prose project-details">
        <p><strong>practice</strong><br>Creative direction, interaction design, visual systems, full-stack development, native macOS tools, audio engineering, and experimental AI.</p>
        <p><strong>interests</strong><br>Artificial voices, memory that behaves like memory rather than a log, audience-controlled music, audiovisual performance, brutalism, generative images and color, unusual archives, and interfaces with a point of view.</p>
        <p><strong>approach</strong><br>Build the smallest honest version first. Keep the underlying structure visible. Use restraint as a way to make behavior, sound, and ideas more noticeable.</p>
        <p><strong>current work</strong><br>A connected body of creative software spanning livestream instruments and voice agents, generative avatar systems, native macOS audio tools, an image and color editor, sample preparation, music discovery, and a personal archive.</p>
      </div>
    </section>
  `;
}

function pageForPath(path) {
  if (path === '/') return { title: 'billy', content: '' };
  if (path === '/projects') return { title: 'billy — projects', content: projectsIndexPage() };
  if (path === '/notes') return { title: 'billy — notes', content: notesIndexPage() };
  if (path === '/research') return { title: 'billy — research', content: researchPage() };
  if (path === '/about') return { title: 'billy — about', content: aboutPage() };

  const project = projects.find((item) => path === `/projects/${item.slug}`);
  if (project) return { title: `billy — ${project.title}`, content: projectPage(project) };

  const note = notes.find((item) => path === `/notes/${item.slug}`);
  if (note) return { title: `billy — ${note.title}`, content: notePage(note) };

  return { title: 'billy — not found', content: `<section class="page"><p>404 — page not found.</p></section>` };
}

function render() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const { title, content } = pageForPath(path);
  document.title = title;
  app.className = path === '/' ? 'home' : 'subpage';
  app.innerHTML = shell(content, path === '/');
}

window.addEventListener('popstate', render);

document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a');
  if (!anchor || anchor.origin !== window.location.origin || anchor.target === '_blank') return;
  event.preventDefault();
  history.pushState({}, '', anchor.pathname);
  render();
});

render();

// /api/notes resolves to an array on success; on failure the chain falls back
// to fetching /notes.json, which resolves to a Response needing `.json()` —
// this normalizes either shape into an array before storing it.
fetch('/api/notes')
  .then((response) => (response.ok ? response.json() : fetch('/notes.json')))
  .catch(() => fetch('/notes.json'))
  .then((response) => (Array.isArray(response) ? response : response.json()))
  .then((storedNotes) => {
    if (Array.isArray(storedNotes)) {
      notes = storedNotes;
      render();
    }
  })
  .catch(() => {});
