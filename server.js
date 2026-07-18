const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 6967;
const host = '127.0.0.1';
const publicDir = path.join(__dirname, 'public');
const contentDir = path.join(__dirname, 'content');
const notesFile = path.join(contentDir, 'notes.json');
const mediaDir = path.join(publicDir, 'media');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4'
};

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(body);
}

function readBody(request, limit = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > limit) {
        request.destroy();
        reject(new Error('payload too large'));
      }
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

async function readNotes() {
  try {
    return JSON.parse(await fs.promises.readFile(notesFile, 'utf8'));
  } catch {
    return [];
  }
}

async function writeNotes(notes) {
  await fs.promises.mkdir(contentDir, { recursive: true });
  await fs.promises.writeFile(notesFile, `${JSON.stringify(notes, null, 2)}\n`, 'utf8');
}

function cleanSlug(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

async function handleApi(request, response, requestedPath) {
  if (requestedPath === '/api/notes' && request.method === 'GET') {
    sendJson(response, 200, await readNotes());
    return true;
  }

  if (requestedPath === '/api/notes' && request.method === 'POST') {
    try {
      const input = JSON.parse(await readBody(request, 512 * 1024));
      const slug = cleanSlug(input.slug || input.title);
      if (!slug || !input.title || !input.body) {
        sendJson(response, 400, { error: 'title and body are required' });
        return true;
      }
      const notes = await readNotes();
      const note = {
        slug,
        title: String(input.title).trim().slice(0, 160),
        date: String(input.date || new Date().toISOString().slice(0, 10)).slice(0, 10),
        excerpt: String(input.excerpt || '').trim().slice(0, 280),
        body: String(input.body).trim(),
        media: Array.isArray(input.media) ? input.media.slice(0, 12).map((item) => ({ type: String(item.type || 'link'), url: String(item.url || ''), alt: String(item.alt || '') })) : []
      };
      const index = notes.findIndex((item) => item.slug === slug);
      if (index === -1) notes.unshift(note);
      else notes[index] = note;
      await writeNotes(notes);
      sendJson(response, 200, note);
    } catch (error) {
      sendJson(response, error.message === 'payload too large' ? 413 : 400, { error: 'invalid note payload' });
    }
    return true;
  }

  if (requestedPath.startsWith('/api/notes/') && request.method === 'DELETE') {
    const slug = cleanSlug(requestedPath.slice('/api/notes/'.length));
    const notes = await readNotes();
    const next = notes.filter((note) => note.slug !== slug);
    await writeNotes(next);
    sendJson(response, 200, { ok: true });
    return true;
  }

  if (requestedPath === '/api/media' && request.method === 'POST') {
    try {
      const input = JSON.parse(await readBody(request));
      const dataMatch = String(input.data || '').match(/^data:(image|audio|video)\/([a-z0-9.+-]+);base64,(.+)$/i);
      const baseName = path.basename(String(input.name || 'upload'));
      const extension = path.extname(baseName).toLowerCase() || `.${dataMatch ? dataMatch[2] : 'bin'}`;
      const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp3', '.wav', '.ogg', '.mp4', '.webm'];
      if (!dataMatch || !allowed.includes(extension)) {
        sendJson(response, 400, { error: 'unsupported media' });
        return true;
      }
      const safeName = `${Date.now()}-${cleanSlug(path.basename(baseName, extension)) || 'upload'}${extension}`;
      await fs.promises.mkdir(mediaDir, { recursive: true });
      await fs.promises.writeFile(path.join(mediaDir, safeName), Buffer.from(dataMatch[3], 'base64'));
      sendJson(response, 200, { url: `/media/${safeName}`, type: dataMatch[1] });
    } catch (error) {
      sendJson(response, error.message === 'payload too large' ? 413 : 400, { error: 'invalid media payload' });
    }
    return true;
  }

  return false;
}

const server = http.createServer(async (request, response) => {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(request.url.split('?')[0]);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  if (requestedPath.includes('\0')) {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  if (await handleApi(request, response, requestedPath)) return;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  const relativePath = requestedPath === '/' ? '/index.html' : requestedPath === '/cms' ? '/cms.html' : requestedPath;
  const filePath = path.normalize(path.join(publicDir, relativePath));
  const relativeFilePath = path.relative(publicDir, filePath);

  if (relativeFilePath.startsWith('..') || path.isAbsolute(relativeFilePath)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (path.extname(filePath)) {
        response.writeHead(error.code === 'EACCES' ? 403 : 404);
        response.end('Not found');
        return;
      }

      fs.readFile(path.join(publicDir, 'index.html'), (fallbackError, fallback) => {
        if (fallbackError) {
          response.writeHead(500);
          response.end('Server error');
          return;
        }
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if (request.method === 'HEAD') response.end();
        else response.end(fallback);
        });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'application/octet-stream' });
    if (request.method === 'HEAD') response.end();
    else response.end(content);
  });
});

server.listen(port, host, () => {
  console.log(`billy is running at http://${host}:${port}`);
});
