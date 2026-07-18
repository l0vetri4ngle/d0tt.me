const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const contentNotes = path.join(root, 'content', 'notes.json');

fs.copyFileSync(contentNotes, path.join(publicDir, 'notes.json'));
fs.copyFileSync(path.join(publicDir, 'index.html'), path.join(publicDir, '404.html'));
console.log('Prepared static notes data and SPA fallback for GitHub Pages.');
