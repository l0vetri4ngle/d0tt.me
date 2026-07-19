const projects = [
  {
    slug: 'saisen',
    title: 'saisen 賽銭',
    description: 'A TikTok Live → Ableton Live bridge where audience gifts intervene in the music.',
    role: 'Creative direction, interaction design, software architecture, and implementation',
    status: 'Ongoing / live-system prototype',
    stack: 'Python · Flask · Flask-SocketIO · TikTokLive · MIDI · AbletonOSC · OSC · TOML · pytest',
    overview: 'Saisen turns a livestream into a musical instrument. Viewers send TikTok gifts, and those gifts become actions inside an Ableton Live set: a drum is added to a loop, a tempo rises, a clip launches, or a more expensive gift can remove part of the song. The project treats participation as composition rather than decoration.',
    details: [
      ['interaction model', 'The room writes the song together. Cheap gifts add material to a looping clip; expensive gifts subtract, destroy, or permanently change the state of the performance.'],
      ['system flow', 'TikTok gift ingestion → streak resolution and coalescing → editable gift map → MIDI / AbletonOSC output → live music, dashboard, and audience overlay.'],
      ['designed for live use', 'A sandbox simulator makes the system testable without money or a live room. Rate limits, alarms, a kill switch, and a separate operator dashboard keep the audience-facing experience expressive without making the rig fragile.'],
      ['modes', 'Saisen is the primary music-building mode. Matsuri is a festival mode with its own gift table and palette, where gifts launch and stop Ableton clips instead of editing the drum loop.'],
      ['interface layer', 'The dashboard exposes mappings, gift catalog changes, Ableton structure, live events, and operator actions. A transparent overlay and ceremony layer give the audience a readable view of what their gifts changed.'],
      ['engineering decisions', 'Mappings live in a comment-preserving TOML file so the creative system stays editable by hand. The operator guide is rendered from the same repository and grows with every new action, alarm, and failure mode.']
    ]
  },
  {
    slug: 'himei',
    title: 'himei 悲鳴',
    description: 'A lightweight soundboard for livestreams, built for instant playback and clear routing.',
    role: 'Product design, interaction design, C++ / JUCE engineering, and interface implementation',
    status: 'Native macOS application / ongoing',
    stack: 'C++ · JUCE 8 · CMake · vanilla HTML / CSS / JavaScript · CoreAudio · BlackHole · macOS',
    overview: 'Himei is a focused performance tool for TikTok Live Studio and OBS. Audio files are dropped onto a small grid of pads, triggered instantly, and sent to two independent destinations: the stream hears one output while the performer monitors another through headphones. The interface is intentionally direct because the tool is used while performing, not browsing.',
    details: [
      ['interaction model', 'Import a sound by dropping it onto the board, then trigger it with one click. Each pad can be renamed, looped, choked, or deleted. Escape stops everything immediately.'],
      ['layout', 'A fixed 4 × 2 pad grid keeps eight sounds visible at once. A reserved fifth column stays available for stop-all, main and monitor routing, and master volume, even when editing or changing settings.'],
      ['audio path', 'Imported WAV, MP3, FLAC, and AIFF files are copied into the project, decoded into memory, and resampled to 48kHz. The mixer maintains separate stream and monitor outputs so the audience and performer can hear the right things.'],
      ['native architecture', 'A single JUCE process contains the app window, browser UI, deck model, sample cache, mixer, and macOS utilities. A native JavaScript bridge connects the frontend to C++ without an HTTP server or subprocesses.'],
      ['persistence', 'Banks, pad assignments, playback settings, and the optional background image persist in deck.json and the project root. The data stays visible and portable rather than being hidden in application storage.'],
      ['development approach', 'The HTML interface hot-reloads from disk during development, while the compiled JUCE binary remains the release and fallback path. This keeps interaction design fast without sacrificing a native distributable app.']
    ]
  },
  {
    slug: 'nue',
    title: 'nue 鵺',
    description: 'A face-chaos collage tool and live mouth rig for a VTuber avatar layer.',
    role: 'Creative direction, interaction design, computer-vision pipeline, and full-stack implementation',
    status: 'Ongoing / livestream tool',
    stack: 'Python · Flask · Flask-SocketIO · MediaPipe · OpenCV · Pillow · NumPy · sounddevice · vanilla JavaScript · OBS',
    overview: 'Nue cuts facial features from source photos, recombines them into uncanny paper-like faces, and serves the result as a transparent OBS browser source. A microphone drives a three-state mouth rig in real time, so the generated face can perform rather than remain a static image.',
    details: [
      ['concept', 'The project treats an avatar as a loose collage instead of a single illustration. Eyes, mouths, ears, and other features can be cut, reassembled, swapped, and pushed from anatomical to deliberately chaotic.'],
      ['workflow', 'Drop photos into input → detect facial landmarks → cut clean or torn-paper assets → arrange a face at a chosen chaos level → select it in the rig → add the transparent URL to OBS.'],
      ['generation system', 'MediaPipe landmarks guide category-specific crops. The compositor builds a layered 1080 × 1080 face with a head, feature layers, mouth states, optional body placement, shadows, grain, blink layers, and subtle idle sway.'],
      ['live rig', 'The server owns microphone input and sends mouth state through Socket.IO. Hysteresis keeps the mouth from flickering at volume boundaries, and the OBS page fails closed to a closed mouth if the connection drops.'],
      ['inspectable output', 'Each generated face is a folder of full-canvas RGBA PNG layers plus a manifest.json. The format is intentionally transparent and diffable: any layer can be replaced without rebuilding the whole face or committing to a binary authoring format.'],
      ['design decisions', 'Chaos is a tunable range rather than a random switch. Head and body placement are recorded in the manifest, settings can update live, and the browser source remains a fixed 1080 × 1080 square so it stays predictable in a broadcast layout.']
    ]
  },
  {
    slug: 'kegare',
    title: 'kegare 穢れ',
    description: 'A music platform and personal archive built as a full-screen CRT terminal with a living voice.',
    role: 'Creative direction, world-building, interaction design, full-stack engineering, and content system design',
    status: 'Main website / ongoing platform',
    stack: 'Node.js · Express · Anthropic Claude API · vanilla HTML / CSS / JavaScript · Three.js · Server-Sent Events · Markdown · localStorage',
    overview: 'Kegare is the main website for kegareSoft: a music-first archive shaped like a physical terminal. The terminal is both the interface and the narrative device. Visitors can explore work, read journal entries, and talk with Kegare, a synthetic vocalist whose persona is powered by a swappable system prompt and whose memory is held locally in the visitor’s browser.',
    details: [
      ['central idea', 'The website is a thesis on a creator’s life and work. Music is the first room, with video, photography, projects, and writing able to join the same phosphor family through their own media rituals.'],
      ['interface', 'A green-phosphor CRT terminal replaces conventional site navigation. Commands, history, tab completion, scanlines, glow, and a typed response rhythm make the archive feel like a place the visitor enters rather than a page they scroll.'],
      ['living intelligence', 'Kegare’s voice is defined by a persona file and can stream Claude-backed replies through the terminal. Without an API key, the site falls back to scripted in-character responses so the experience remains intact instead of exposing an error state.'],
      ['content system', 'A local CMS lets the creator write journal entries in Markdown, upload photos, video, and audio, insert code snippets, and regenerate the archive index. The content stays as readable files rather than disappearing into a database.'],
      ['world and navigation', 'The terminal is being placed inside a shared PS1-style room with Gokiburi, a cockroach avatar and navigation figure. A physical CRT object, a walk-up camera lock, and a full-screen readout connect the spatial world to the readable terminal.'],
      ['technical approach', 'One small Express app serves the frontend, streams chat responses, and mounts the CMS locally when requested. The frontend uses native browser APIs and ES modules with no build step, keeping the site inspectable and easy to reshape.'],
      ['memory and care', 'The browser stores a visitor’s name, visit count, and rolling conversation locally. The fictional hunger remains fictional: the persona is designed to become plain and kind when a visitor is genuinely distressed.']
    ]
  },
  {
    slug: 'kasane',
    title: 'kasane 重ね',
    description: 'A native real-time audio effects chain for routing input through VST3 and AU plugins.',
    role: 'Product direction, interaction design, C++ / JUCE engineering, and audio-system architecture',
    status: 'Native macOS application / ongoing',
    stack: 'C++ · JUCE 8 · CMake · CoreAudio · VST3 · Audio Unit · vanilla HTML / CSS / JavaScript · native JS bridge',
    overview: 'Kasane is a focused performance and production tool for shaping live audio. It routes microphone or audio input through an editable plugin chain, keeps monitoring immediate, and makes the chain visible as a spatial arrangement rather than hiding it behind a conventional DAW interface.',
    details: [
      ['interaction model', 'Start a stream, choose an input, add plugins, reorder the chain, bypass individual effects, and open native plugin editors without leaving the main surface. Input drive and final output are always visible.'],
      ['signal flow', 'CoreAudio input → live VST3 / AU chain → output gain → monitoring or recording. The engine keeps the active chain as an atomic snapshot so audio processing stays stable while the UI edits it.'],
      ['layout', 'A full-window native app pairs a file browser and audition area with an arrangement timeline, mixer, and horizontally scrolling plugin chain. The interface supports both live monitoring and session-style recording / playback.'],
      ['native architecture', 'Kasane is a single JUCE process with a WebBrowserComponent frontend, AudioEngine, PluginHost, and crash-recoverable Scanner. The frontend communicates with C++ through JUCE’s native JavaScript bridge—no IPC, subprocess, Tauri, or Python runtime.'],
      ['plugin safety', 'Plugin scanning writes a marker before each file. If a plugin crashes the scan, the next launch can blacklist that path and continue. Scan results are cached so a working setup opens quickly on subsequent sessions.'],
      ['creative workflow', 'Beyond the live chain, Kasane supports file browsing, auditioning, bookmarks, sample loading, tracks, clips, looping, recording, arrangement playback, gain, pan, and per-track arming.']
    ]
  },
  {
    slug: 'yomi',
    title: 'yomi 黄泉',
    description: 'A real-time AI voice agent for TikTok Live that can listen, see, remember, and speak.',
    role: 'Product direction, conversational design, full-stack engineering, audio systems, and persona development',
    status: 'Ongoing / livestream agent framework',
    stack: 'Python · Flask · Flask-SocketIO · Anthropic Claude · Google Gemini · ElevenLabs · Mistral Voxtral · faster-whisper · SQLite · ChromaDB · Tauri · Rust · VTube Studio',
    overview: 'Yomi turns a livestream chat into a responsive character. Messages trigger short, streamed replies that are synthesized into speech and routed into TikTok Live Studio. The operator can also speak to her, send an image, ask her to look at a window, or let a private inner monologue surface through a subtle audio effect.',
    details: [
      ['conversation loop', 'TikTok chat → priority queue → streamed LLM response → sentence-level TTS → serialized audio playback → dashboard and optional avatar expression. The response starts speaking before the full answer is finished.'],
      ['multimodal input', 'Yomi can respond to typed chat, local microphone input through Whisper, uploaded images, and on-demand screen captures. Vision uses Claude Sonnet while normal conversation uses a faster chat model.'],
      ['voice system', 'Three TTS providers—Voxtral, ElevenLabs, and macOS say—share an automatic failover chain. Audio is resampled, serialized, and routed through BlackHole so the stream receives a clean signal without the agent talking over itself.'],
      ['memory and personality', 'Per-viewer SQLite profiles, semantic ChromaDB recall, a graph memory, extracted facts, and session working memory give the agent continuity. After each stream, a controlled evolution pass can make small updates to personality.json.'],
      ['operator controls', 'The dashboard exposes TTS and LLM providers, output routing, microphone state, image input, and graceful shutdown. States are replayed on reconnect, and sandbox mode runs the full pipeline without requiring a live TikTok room.'],
      ['avatar layer', 'Optional VTube Studio integration maps audio amplitude to mouth movement and response tone to expressions. The native Tauri shell wraps the Flask dashboard into a focused macOS desktop app.'],
      ['reliability as design', 'Cooldowns, queue priorities, echo cancellation, noise filtering, provider failover, graceful shutdown, and local fallback speech keep the character present when external services or network conditions become imperfect.']
    ]
  },
  {
    slug: 'aomori',
    title: 'aomori 青森',
    description: 'A focused drum-sample renaming tool that turns a loose folder of sounds into a usable named library.',
    role: 'Product direction, interface design, interaction logic, and full-stack implementation',
    status: 'Web app and native macOS application',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Electron · JSZip · electron-builder · Vercel Analytics',
    overview: 'Aomori is a small utility built around a common creative bottleneck: naming drum samples. Audio files are loaded into a visual workspace, assigned a drum type and a word from a managed pool, previewed as final filenames, and saved either directly to disk or as a portable ZIP.',
    details: [
      ['workflow', 'Drop WAV, AIF, MP3, or FLAC files into 01 Files → choose a drum type → load or build a word pool → inspect the live rename preview → shuffle, log, or save.'],
      ['naming system', 'Words come from reusable banks and can be entered individually or pasted in bulk. Fill combines single words with hyphenated pairs such as blood-knife, giving a small sample folder more varied names without losing consistency.'],
      ['safety and feedback', 'Names are sanitized at every entry point, duplicate output names are flagged in red, and the preview updates whenever files, words, or type change. The user sees the result before anything is written.'],
      ['two delivery modes', 'The web version bundles renamed files into a downloadable ZIP. The Electron build uses native save dialogs, copies files directly, and reveals the output folder in Finder. Both modes share the same interface and naming logic.'],
      ['structure', 'A single-page interface is divided into five quiet, numbered panels: files, type, banks, pool, and preview. The layout keeps the full operation visible instead of hiding the core actions behind a multi-step wizard.'],
      ['design language', 'The tool uses a strict black-and-white system, Arial typography, hard borders, no rounded corners, and a compact type scale. It is intentionally closer to a studio instrument than a decorative file manager.']
    ]
  },
  {
    slug: 'fumei',
    title: 'fumei 不明',
    description: 'A small image and video manipulation tool for exploring randomized and controlled visual outcomes.',
    role: 'Concept, interface design, and implementation',
    status: 'Early-stage experiment / in progress',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS · Supabase · shadcn/ui',
    overview: 'Fumei is the most basic and open-ended tool in the current set: a space to put an image or video through a series of transformations and see what happens. Randomness is treated as a material, but it can also be constrained, repeated, and directed toward an intentional result.',
    details: [
      ['core idea', 'Upload or select an image or video, choose how much control to keep, and generate a visual variation. The first version is deliberately small so the behavior of the tool can be understood before its feature set grows.'],
      ['randomness as an instrument', 'Randomized outcomes should feel reproducible rather than arbitrary: parameters can be bounded, a result can be regenerated, and a useful accident can become a controlled choice.'],
      ['media direction', 'The project is being shaped around both still images and moving images, with the same quiet manipulation language extending across the two formats instead of treating video as a separate product.'],
      ['future album-cover generator', 'A planned next layer will use the manipulation system to generate album artwork—compositions that can be explored quickly, constrained by a visual direction, and exported as cover candidates.'],
      ['current scope', 'The goal is a comprehensible foundation: a small interface, a clear input/output relationship, and room for experiments. More elaborate presets, history, batch generation, and export decisions can follow once the core gesture feels right.'],
      ['design language', 'The visual system is intentionally stark: Times New Roman, black and white, hard borders, no gradients, no shadows, and no decorative motion. The restraint keeps attention on the transformation itself.']
    ]
  },
  {
    slug: 'otoma',
    title: 'otoma おとま',
    description: 'A music discovery tool that spins a curated genre universe into one unexpected track at a time.',
    role: 'Product concept, interaction design, music taxonomy, and full-stack implementation',
    status: 'First project / ongoing',
    stack: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Supabase · Spotify API · YouTube · shadcn/ui · Vercel Analytics',
    overview: 'Otoma—Sound Revolver is my first project and the starting point for this body of work. It is built around a simple gesture: press a button and let the system choose what to hear next. Behind that gesture is a curated genre map, weighted discovery logic, filters, profiles, and a small social layer for keeping the songs that matter.',
    details: [
      ['core interaction', 'The home screen is a genre void and a single spin. Each spin returns one track from Spotify, or one YouTube result in alternate mode. The space is designed to make discovery feel immediate and a little unpredictable.'],
      ['curation system', 'A typed master genre list feeds the UI, validation, API queries, regional pools, and era filters. Weighted genre selection gives the 00s and Asia modes a point of view without removing the possibility of surprise.'],
      ['two listening modes', 'Spotify is the primary track-discovery path. YouTube mode uses the same genre gesture to surface videos, so the tool can move between recorded music and a wider audiovisual archive without changing its central interaction.'],
      ['personal layer', 'Authenticated listeners can create a profile, save favorites, write notes, choose a spotlight track, and follow other listeners. The discovery gesture stays public while the memory of what was found becomes personal.'],
      ['design approach', 'Large type, compressed metadata, an almost empty split layout, and a restrained black-and-white system keep the result closer to a music instrument than a recommendation dashboard. The act of spinning is the visual event.'],
      ['why it matters', 'Otoma established several principles that carry through the later projects: give one action a strong identity, make the underlying system inspectable, and let a small interface open into a much larger world of culture.']
    ]
  }
];

const defaultNotes = [
  {
    slug: 'on-quiet-interfaces',
    title: 'on quiet interfaces',
    excerpt: 'Why less on the screen can make more happen in the work.',
    body: 'I keep returning to interfaces that barely announce themselves. A quiet surface gives the sound, image, or action somewhere to land. The goal is not to remove personality; it is to stop the interface from spending all of the attention before the work has a chance to speak.'
  },
  {
    slug: 'training-a-machine',
    title: 'training a machine',
    excerpt: 'What it means to give a system a voice without pretending it is a person.',
    body: 'The interesting part of an AI character is not making it sound human at all costs. It is deciding what it remembers, what it refuses, and how clearly the fiction admits that it is fiction. Personality is a design material, not a shortcut around responsibility.'
  },
  {
    slug: 'the-tool-is-the-performance',
    title: 'the tool is the performance',
    excerpt: 'Building software for the moment when everything is already happening.',
    body: 'A live tool cannot ask for a perfect workflow. It has to show its state, recover quickly, and make the next useful action obvious. The best controls in himei, kasane, and saisen are not the most sophisticated ones; they are the ones that remain legible under pressure.'
  },
  {
    slug: 'useful-accidents',
    title: 'useful accidents',
    excerpt: 'A note on randomness, repetition, and keeping the result that surprises you.',
    body: 'Randomness is only useful when I can stay with it. I want to set a range, run the process again, understand what changed, and keep the accident that feels like a direction. Control and surprise are not opposites; they are a conversation.'
  }
];

let notes = defaultNotes;

const app = document.querySelector('#app');
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const safeUrl = (value) => {
  const url = String(value || '').trim();
  if (url.startsWith('/media/')) return url;
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch {
    return '#';
  }
};
const link = (href, label) => `<a href="${escapeHtml(safeUrl(href))}">${escapeHtml(label)}</a>`;
const shell = (content, isHome) => `<nav>${isHome ? `${link('/', 'billy')} ${link('/projects', 'projects')} ${link('/research', 'research')} ${link('/about', 'about')} ${link('/notes', 'notes')}` : link('/', 'billy')}</nav>${content}<footer>Made with 🚛❤️ by Brandon</footer>`;

function mediaBlock(item) {
  const url = escapeHtml(safeUrl(item.url));
  const alt = escapeHtml(item.alt || '');
  if (item.type === 'image') return `<figure class="media-block media-image"><img src="${url}" alt="${alt}">${alt ? `<small>${alt}</small>` : ''}</figure>`;
  if (item.type === 'audio') return `<div class="media-block media-audio"><audio controls src="${url}"></audio></div>`;
  if (item.type === 'video') return `<figure class="media-block media-video"><video controls src="${url}"></video>${alt ? `<small>${alt}</small>` : ''}</figure>`;
  return `<div class="media-block media-link">${link(item.url, item.alt || item.url)}</div>`;
}

function projectPage(project) {
  const details = project.details ? `<div class="prose project-details">${project.details.map(([label, text]) => `<p><strong>${label}</strong><br>${text}</p>`).join('')}</div>` : '';
  const metadata = project.role ? `<p class="prose project-meta"><strong>role</strong><br>${project.role}<br><br><strong>status</strong><br>${project.status}<br><br><strong>stack</strong><br>${project.stack}</p>` : '';
  const overview = project.overview ? `<p class="prose project-overview">${project.overview}</p>` : '';
  return `<section class="page"><p class="back">${link('/projects', '← projects')}</p><h1>${project.title}</h1><p class="prose project-lede">${project.description}</p>${metadata}<div class="media placeholder"></div>${overview}${details}<p class="prose">Images, GIFs, video, audio, and process notes can be added here as the work develops.</p></section>`;
}

function notePage(note) {
  const media = (note.media || []).map(mediaBlock).join('');
  return `<section class="page"><p class="back">${link('/notes', '← notes')}</p><h1>${escapeHtml(note.title)}</h1><p class="note-date">${escapeHtml(note.date || '')}</p><p class="prose project-lede">${escapeHtml(note.excerpt)}</p><div class="note-text-block prose">${escapeHtml(note.body)}</div><div class="note-media-list">${media}</div></section>`;
}

function render() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  let content = '';
  if (path === '/') content = '';
  else if (path === '/projects') content = `<section class="page project-index"><nav class="project-nav">${projects.map((project) => link(`/projects/${project.slug}`, project.title)).join('')}</nav></section>`;
  else if (path === '/notes') content = `<section class="page"><div class="note-list">${notes.map((note) => `<a href="${escapeHtml(safeUrl(`/notes/${note.slug}`))}"><span class="note-title">${escapeHtml(note.title)}</span><span class="note-excerpt">${escapeHtml(note.excerpt)}</span><span class="note-date">${escapeHtml(note.date || '')}</span></a>`).join('')}</div></section>`;
  else if (path === '/research') content = `<section class="page"><p class="prose project-lede">Ongoing questions around creative tools, artificial intelligence, music, and interfaces that behave like instruments.</p><div class="prose project-details"><p><strong>audience as collaborator</strong><br>How can a livestream audience alter a performance without reducing participation to a reaction button? <a href="/projects/saisen">saisen</a> treats gifts as compositional actions: viewers add, erase, accelerate, and reshape a shared musical state.</p><p><strong>artificial voices and memory</strong><br>What makes an AI character feel situated rather than merely responsive? <a href="/projects/yomi">yomi</a> and <a href="/projects/kegare">kegare</a> explore persona files, local memory, voice, vision, and the ethics of keeping fiction recognizably fictional.</p><p><strong>interfaces for live attention</strong><br>Performance tools have to be legible while something else is already happening. <a href="/projects/himei">himei</a> and <a href="/projects/kasane">kasane</a> use fixed surfaces, immediate feedback, native audio paths, and visible state to reduce distance between intention and action.</p><p><strong>controlled chaos</strong><br>Randomness becomes useful when it can be bounded, repeated, inspected, and turned into a choice. <a href="/projects/nue">nue</a> and <a href="/projects/fumei">fumei</a> use variation as a design material rather than an excuse for an opaque result.</p><p><strong>small tools, larger worlds</strong><br><a href="/projects/otoma">otoma</a> and <a href="/projects/aomori">aomori</a> begin with one clear gesture—spin, rename—and grow outward into systems for discovery, curation, and making.</p><p><strong>working principles</strong><br>Keep the mechanism inspectable. Let the interface stay quiet. Prefer a strong verb over a crowded feature list. Make room for accidents, but give the user a way to understand and keep them.</p></div></section>`;
  else if (path === '/about') content = `<section class="page"><p class="prose project-lede">Brandon Ocampo is a creative visual designer and programmer working across artificial intelligence, music, live systems, and brutalist interfaces.</p><p class="prose project-overview">He releases music as Gokiburi, builds tools through kegareSoft, and treats software as both a medium and a place to think. The work moves between sound, image, performance, characters, and the systems that let other people participate.</p><div class="prose project-details"><p><strong>practice</strong><br>Creative direction, interaction design, visual systems, full-stack development, native macOS tools, audio engineering, and experimental AI.</p><p><strong>interests</strong><br>Artificial voices, synthetic memory, audience-controlled music, audiovisual performance, brutalism, generative images, unusual archives, and interfaces with a point of view.</p><p><strong>approach</strong><br>Build the smallest honest version first. Keep the underlying structure visible. Use restraint as a way to make behavior, sound, and ideas more noticeable.</p><p><strong>current work</strong><br>Developing a connected body of creative software—from music discovery and sample preparation to livestream agents, avatar systems, audio instruments, and a personal archive.</p></div></section>`;
  else {
    const project = projects.find((item) => path === `/projects/${item.slug}`);
    const note = notes.find((item) => path === `/notes/${item.slug}`);
    content = project ? projectPage(project) : note ? notePage(note) : `<section class="page"><p>404 — page not found.</p></section>`;
  }
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
fetch('/api/notes')
  .then((response) => response.ok ? response.json() : fetch('/notes.json'))
  .catch(() => fetch('/notes.json'))
  .then((response) => Array.isArray(response) ? response : response.json())
  .then((storedNotes) => {
    if (Array.isArray(storedNotes)) {
      notes = storedNotes;
      render();
    }
  })
  .catch(() => {});
