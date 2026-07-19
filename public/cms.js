const form = document.querySelector('#note-form');
const fields = ['title', 'slug', 'date', 'excerpt', 'body'];
const media = [];
let notes = [];

const value = (id) => document.querySelector(`#${id}`).value;
const setValue = (id, next) => { document.querySelector(`#${id}`).value = next || ''; };
const status = (message) => { document.querySelector('#status').textContent = message; };
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

function renderMedia() {
  document.querySelector('#media-list').innerHTML = media.map((item, index) => `<div class="media-item"><span>${escapeHtml(item.type)}: ${escapeHtml(item.alt || item.url)}</span><button type="button" data-remove-media="${index}">remove</button></div>`).join('');
  document.querySelectorAll('[data-remove-media]').forEach((button) => button.addEventListener('click', () => { media.splice(Number(button.dataset.removeMedia), 1); renderMedia(); renderPreview(); }));
}

function renderPreview() {
  const mediaMarkup = media.map((item) => item.type === 'image' ? `<figure class="media-block media-image"><figcaption>image</figcaption><img src="${escapeHtml(safeUrl(item.url))}" alt="${escapeHtml(item.alt || '')}"></figure>` : item.type === 'audio' ? `<div class="media-block media-audio"><p>audio</p><audio controls src="${escapeHtml(safeUrl(item.url))}"></audio></div>` : item.type === 'video' ? `<figure class="media-block media-video"><figcaption>video</figcaption><video controls src="${escapeHtml(safeUrl(item.url))}"></video></figure>` : `<div class="media-block media-link"><p>link</p><a href="${escapeHtml(safeUrl(item.url))}">${escapeHtml(item.alt || item.url)}</a></div>`).join('');
  document.querySelector('#preview').innerHTML = `<h1>${escapeHtml(value('title') || 'untitled')}</h1><p class="preview-date">${escapeHtml(value('date'))}</p><p>${escapeHtml(value('excerpt'))}</p><div class="note-text-block">${escapeHtml(value('body'))}</div>${mediaMarkup}`;
}

function renderNotes() {
  document.querySelector('#notes-list').innerHTML = notes.map((note) => `<div class="saved-note"><a data-edit="${escapeHtml(note.slug)}">${escapeHtml(note.title)}</a><button type="button" data-delete="${escapeHtml(note.slug)}">delete</button></div>`).join('');
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
  if (!window.confirm('Delete this note?')) return;
  const response = await fetch(`/api/notes/${slug}`, { method: 'DELETE' });
  if (response.ok) { await loadNotes(); clearForm(); status('deleted'); }
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
  const response = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ originalSlug: value('original-slug'), slug: value('slug'), title: value('title'), date: value('date'), excerpt: value('excerpt'), body: value('body'), media }) });
  const result = await response.json();
  if (!response.ok) { status(result.error || 'could not save'); return; }
  await loadNotes();
  document.querySelector('#original-slug').value = result.slug;
  status(`published ${result.title}`);
});

document.querySelector('#clear').addEventListener('click', clearForm);
document.querySelector('#add-link').addEventListener('click', () => {
  const url = document.querySelector('#link-url').value.trim();
  const alt = document.querySelector('#link-label').value.trim() || url;
  if (!url) { status('add a link URL first'); return; }
  media.push({ type: 'link', url, alt });
  document.querySelector('#link-url').value = '';
  document.querySelector('#link-label').value = '';
  renderMedia(); renderPreview(); status('link block ready');
});
document.querySelector('#media-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  status('uploading media…');
  const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
  const response = await fetch('/api/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, data }) });
  const result = await response.json();
  if (!response.ok) { status(result.error || 'could not upload'); return; }
  media.push({ type: result.type, url: result.url, alt: file.name });
  renderMedia(); renderPreview(); status('media ready');
  event.target.value = '';
});

fields.forEach((field) => document.querySelector(`#${field}`).addEventListener('input', renderPreview));
clearForm();
loadNotes().catch(() => status('could not load notes'));
