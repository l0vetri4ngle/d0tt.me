window.Billy = (() => {
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  function safeUrl(value) {
    const url = String(value || '').trim();
    if (url.startsWith('/media/')) return url;
    try {
      const parsed = new URL(url, window.location.origin);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
    } catch {
      return '#';
    }
  }

  function link(href, label) {
    return `<a href="${escapeHtml(safeUrl(href))}">${escapeHtml(label)}</a>`;
  }

  function mediaBlock(item) {
    const url = escapeHtml(safeUrl(item.url));
    const alt = escapeHtml(item.alt || '');
    const caption = alt ? `<small>${alt}</small>` : '';

    if (item.type === 'image') return `<figure class="media-block media-image"><img src="${url}" alt="${alt}">${caption}</figure>`;
    if (item.type === 'audio') return `<div class="media-block media-audio"><audio controls src="${url}"></audio></div>`;
    if (item.type === 'video') return `<figure class="media-block media-video"><video controls src="${url}"></video>${caption}</figure>`;
    return `<div class="media-block media-link">${link(item.url, item.alt || item.url)}</div>`;
  }

  return { escapeHtml, safeUrl, link, mediaBlock };
})();
