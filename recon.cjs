const fs = require('fs');

function styleStringToObjectStr(styleStr) {
  if (!styleStr) return '{}';
  const parts = styleStr.split(';');
  let objStr = '{ ';
  parts.forEach(part => {
    if (!part.trim()) return;
    let [key, ...valParts] = part.split(':');
    let val = valParts.join(':'); // Re-join in case value had colons (like url)
    if (!key || !val) return;
    key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    val = val.trim().replace(/'/g, '"');
    objStr += `${key}: '${val}', `;
  });
  objStr += '}';
  return objStr;
}

function htmlToJsx(html) {
  return html
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />')
    .replace(/<img([^>]*[^/])>/g, '<img$1 />')
    .replace(/<input([^>]*[^/])>/g, '<input$1 />')
    .replace(/<path([^>]*[^/])>/g, '<path$1 />')
    .replace(/<circle([^>]*[^/])>/g, '<circle$1 />')
    .replace(/<rect([^>]*[^/])>/g, '<rect$1 />')
    .replace(/<line([^>]*[^/])>/g, '<line$1 />')
    .replace(/<polygon([^>]*[^/])>/g, '<polygon$1 />')
    .replace(/novalidate/g, 'noValidate')
    .replace(/onclick="([^"]*)"/g, (match, code) => `onClick={() => { ${code.replace(/'/g, "\\'")} }}`)
    .replace(/onchange="([^"]*)"/g, 'onChange={() => {}}') // Dummy to prevent React warnings
    .replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')
    .replace(/style="([^"]*)"/g, (match, p1) => `style={${styleStringToObjectStr(p1)}}`);
}

// Convert Home.jsx
let indexHtml = fs.readFileSync('old_static/index.html', 'utf8');
let mainContentMatch = indexHtml.match(/<!-- ============ HERO ============ -->([\s\S]*?)<!-- ============ FOOTER ============ -->/);
if (mainContentMatch) {
  let mainContent = htmlToJsx(mainContentMatch[1]);
  let homeComponent = `import React, { useEffect } from 'react';
import '../index.css';

export default function Home() {
  return (
    <>
      ${mainContent}
    </>
  );
}
`;
  fs.writeFileSync('src/pages/Home.jsx', homeComponent);
}

// Convert Register.jsx
let regHtml = fs.readFileSync('old_static/register.html', 'utf8');
let regMainContentMatch = regHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/);
if (regMainContentMatch) {
  let regContent = htmlToJsx(regMainContentMatch[1]);
  
  // Fix the duplicate reg-form-eyebrow issue
  regContent = regContent.replace('<div className="reg-form-eyebrow">\n      <div className="reg-form-eyebrow">', '<div className="reg-form-wrap">\n      <div className="reg-form-eyebrow">');

  let registerComponent = `import React from 'react';
import '../index.css';

export default function Register() {
  return (
    <main className="register-main">
      ${regContent}
    </main>
  );
}
`;
  fs.writeFileSync('src/pages/Register.jsx', registerComponent);
}

console.log('Re-converted HTML to JSX with styles preserved.');
