const { escapeHtml, safeUrl, mediaBlock } = window.Billy;

const form = document.querySelector('#note-form');
const fields = ['title', 'slug', 'date', 'excerpt', 'body'];
const media = [];
let notes = [];

const value = (id) => document.querySelector(`#${id}`).value;
const setValue = (id, next) => { document.querySelector(`#${id}`).value = next || ''; };
const status = (message) => { document.querySelector('#status').textContent = message; };

function renderMedia() {
  document.querySelector('#media-list').innerHTML = media.map((item, index) => {
    const url = escapeHtml(safeUrl(item.url));
    const label = escapeHtml(item.alt || item.url);
    const preview = item.type === 'image'
      ? `<img src="${url}" alt="">`
      : item.type === 'audio'
        ? '<span class="media-signal">audio ready</span>'
        : item.type === 'video'
          ? '<span class="media-signal">video ready</span>'
          : `<a href="${url}" target="_blank" rel="noopener">open link</a>`;
    return `<div class="media-item"><div class="media-item-head"><span class="media-name">${label}</span></div><div class="media-item-preview">${preview}</div><button class="remove-media" type="button" data-remove-media="${index}">remove</button></div>`;
  }).join('');

  document.querySelectorAll('[data-remove-media]').forEach((button) => {
    button.addEventListener('click', () => {
      media.splice(Number(button.dataset.removeMedia), 1);
      renderMedia();
      renderPreview();
    });
  });
}

function renderPreview() {
  const mediaMarkup = media.map(mediaBlock).join('');
  document.querySelector('#preview').innerHTML = `
    <section class="page">
      <h1>${escapeHtml(value('title') || 'untitled')}</h1>
      <p class="note-date">${escapeHtml(value('date') || '')}</p>
      <p class="prose project-lede">${escapeHtml(value('excerpt') || '')}</p>
      <div class="note-text-block prose">${escapeHtml(value('body') || '')}</div>
      <div class="note-media-list">${mediaMarkup}</div>
    </section>
  `;
}

function renderNotes() {
  document.querySelector('#notes-list').innerHTML = notes.map((note) =>
    `<div class="saved-note"><a data-edit="${escapeHtml(note.slug)}">${escapeHtml(note.title)}</a><button type="button" data-delete="${escapeHtml(note.slug)}">delete</button></div>`
  ).join('');

  document.querySelectorAll('[data-edit]').forEach((item) => item.addEventListener('click', () => loadNote(item.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach((item) => item.addEventListener('click', () => deleteNote(item.dataset.delete)));
}

function loadNote(slug) {
  const note = notes.find((item) => item.slug === slug);
  if (!note) return;

  document.querySelector('#original-slug').value = note.slug;
  fields.forEach((field) => setValue(field, note[field]));
  media.splice(0, media.length, ...(note.media || []));
  renderMedia();
  renderPreview();
  status(`editing ${note.title}`);
}

async function deleteNote(slug) {
  if (!window.confirm('delete this note?')) return;
  const response = await fetch(`/api/notes/${slug}`, { method: 'DELETE' });
  if (response.ok) {
    await loadNotes();
    clearForm();
    status('deleted');
  }
}

async function loadNotes() {
  const response = await fetch('/api/notes');
  notes = await response.json();
  renderNotes();
}

function clearForm() {
  form.reset();
  document.querySelector('#original-slug').value = '';
  media.splice(0, media.length);
  setValue('date', new Date().toISOString().slice(0, 10));
  renderMedia();
  renderPreview();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalSlug: value('original-slug'),
      slug: value('slug'),
      title: value('title'),
      date: value('date'),
      excerpt: value('excerpt'),
      body: value('body'),
      media
    })
  });
  const result = await response.json();
  if (!response.ok) {
    status(result.error || 'could not save');
    return;
  }
  await loadNotes();
  document.querySelector('#original-slug').value = result.slug;
  status(`published ${result.title}`);
});

document.querySelector('#clear').addEventListener('click', clearForm);

document.querySelector('#add-link').addEventListener('click', () => {
  const url = document.querySelector('#link-url').value.trim();
  const alt = document.querySelector('#link-label').value.trim() || url;
  if (!url) {
    status('add a link URL first');
    return;
  }
  media.push({ type: 'link', url, alt });
  document.querySelector('#link-url').value = '';
  document.querySelector('#link-label').value = '';
  renderMedia();
  renderPreview();
  status('link block ready');
});

document.querySelector('#media-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  status('uploading media…');
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch('/api/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, data })
  });
  const result = await response.json();
  if (!response.ok) {
    status(result.error || 'could not upload');
    return;
  }
  media.push({ type: result.type, url: result.url, alt: file.name });
  renderMedia();
  renderPreview();
  status('media ready');
  event.target.value = '';
});

fields.forEach((field) => document.querySelector(`#${field}`).addEventListener('input', renderPreview));

document.querySelector('#title').addEventListener('input', (event) => {
  const originalSlug = document.querySelector('#original-slug').value;
  if (!originalSlug) {
    const slug = event.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    setValue('slug', slug);
    renderPreview();
  }
});

clearForm();
loadNotes().catch(() => status('could not load notes'));
