/**
 * CLEAN CONVERSION SCRIPT
 * Reads old_static/index.html and old_static/register.html
 * and produces clean React JSX + CSS files
 */
const fs = require('fs');
const path = require('path');

// ── Read originals ──────────────────────────────────────────────────
const indexHtml = fs.readFileSync('old_static/index.html', 'utf8');
const regHtml   = fs.readFileSync('old_static/register.html', 'utf8');
const sharedCss = fs.readFileSync('old_static/shared.css', 'utf8');

// ── CSS: extract all <style> blocks ────────────────────────────────
function extractStyles(html) {
  const matches = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
  return matches.map(m => m[1]).join('\n');
}

const allCss = `/* ====== SHARED ====== */\n${sharedCss}\n/* ====== HOME PAGE ====== */\n${extractStyles(indexHtml)}\n/* ====== REGISTER PAGE ====== */\n${extractStyles(regHtml)}`;
fs.writeFileSync('src/index.css', allCss);
console.log('✅ src/index.css written');

// ── HTML→JSX transformation ─────────────────────────────────────────
function toJsx(html) {
  return html
    // Remove HTML comments
    .replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}')
    // Attributes
    .replace(/\bclass=/g, 'className=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\bnovalidate\b/gi, 'noValidate')
    .replace(/\bautocomplete=/gi, 'autoComplete=')
    .replace(/\bcrossorigin\b/gi, 'crossOrigin')
    // Self-closing void elements  
    .replace(/<(br|hr|input|img|meta|link|source)([^>]*?)(?<!\/)>/g, '<$1$2 />')
    // SVG self-closing elements
    .replace(/<(path|circle|rect|line|polygon|ellipse|polyline|use)([^>]*?)(?<!\/)>/g, '<$1$2 />')
    // Inline style strings → JSX objects
    .replace(/style="([^"]*)"/g, (_, styleStr) => {
      const obj = styleStr
        .split(';')
        .filter(s => s.trim())
        .map(s => {
          const colonIdx = s.indexOf(':');
          if (colonIdx === -1) return null;
          const prop = s.slice(0, colonIdx).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          const val  = s.slice(colonIdx + 1).trim().replace(/"/g, "'");
          return `${prop}: "${val}"`;
        })
        .filter(Boolean)
        .join(', ');
      return `style={{ ${obj} }}`;
    })
    // HTML event handlers
    .replace(/onclick="([^"]*)"/gi, (_, code) => `onClick={() => { ${code} }}`)
    .replace(/onchange="([^"]*)"/gi, (_, code) => `onChange={() => { ${code} }}`)
    .replace(/oninput="([^"]*)"/gi,  (_, code) => `onInput={() => { ${code} }}`)
    // HTML booleans
    .replace(/\bchecked\b(?!=)/g, 'defaultChecked')
    // fix &amp; in JSX text
    .replace(/&amp;/g, '&');
}

// ── Extract <body> inner content between comments ────────────────────
function extractBody(html, startComment, endComment) {
  const startIdx = html.indexOf(startComment);
  const endIdx   = html.indexOf(endComment);
  if (startIdx === -1 || endIdx === -1) {
    // fallback: get everything between <body ...> and </body>
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : '';
  }
  return html.slice(startIdx, endIdx);
}

// ── HOME PAGE ───────────────────────────────────────────────────────
const homeBody = extractBody(indexHtml, '<!-- ============ HERO', '<!-- ============ FOOTER');
const homeJsx = `import React from 'react';
import '../index.css';

export default function Home() {
  return (
    <>
      ${toJsx(homeBody).trim()}
    </>
  );
}
`;
fs.writeFileSync('src/pages/Home.jsx', homeJsx);
console.log('✅ src/pages/Home.jsx written');

// ── REGISTER PAGE ───────────────────────────────────────────────────
const regMainMatch = regHtml.match(/<main([^>]*)>([\s\S]*?)<\/main>/i);
if (!regMainMatch) { console.error('❌ Could not find <main> in register.html'); process.exit(1); }
const regAttrs   = regMainMatch[1];
const regInner   = regMainMatch[2];
const regClassName = (regAttrs.match(/class="([^"]*)"/) || [])[1] || '';

const regJsx = `import React from 'react';
import '../index.css';

export default function Register() {
  return (
    <main className="${regClassName}">
      ${toJsx(regInner).trim()}
    </main>
  );
}
`;
fs.writeFileSync('src/pages/Register.jsx', regJsx);
console.log('✅ src/pages/Register.jsx written');

console.log('\n🎉 All files re-generated from originals. Run: npm run dev');
