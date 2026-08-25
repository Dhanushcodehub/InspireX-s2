const fs = require('fs');
let html = fs.readFileSync('old_static/register.html', 'utf8');

let mainContentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
let mainContent = mainContentMatch ? mainContentMatch[1] : '';

mainContent = mainContent
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
  .replace(/style="[^"]*"/g, '');

let registerComponent = `import React from 'react';
import '../index.css';

export default function Register() {
  return (
    <main className="register-main">
      ${mainContent}
    </main>
  );
}
`;
fs.writeFileSync('src/pages/Register.jsx', registerComponent);
console.log('Register.jsx generated.');
