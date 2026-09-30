const fs = require('fs');

let html = fs.readFileSync('old_static/index.html', 'utf8');

let mainContentMatch = html.match(/<!-- ============ HERO ============ -->([\s\S]*?)<!-- ============ FOOTER ============ -->/);
if (!mainContentMatch) {
  console.log('Could not extract main content');
  process.exit(1);
}
let mainContent = mainContentMatch[1];

mainContent = mainContent
  .replace(/class=/g, 'className=')
  .replace(/for=/g, 'htmlFor=')
  .replace(/<br>/g, '<br />')
  .replace(/<hr>/g, '<hr />')
  .replace(/<img([^>]*[^/])>/g, '<img$1 />')
  .replace(/<input([^>]*[^/])>/g, '<input$1 />')
  // React style prop requires an object, so we convert inline styles like style="--mx:50%;" manually later if needed,
  // For now we will just strip the style="" attributes from speaker cards
  .replace(/style="[^"]*"/g, '');

let homeComponent = `import React, { useEffect } from 'react';
import '../index.css';

export default function Home() {
  useEffect(() => {
    // Add logic here if needed
  }, []);

  return (
    <>
      ${mainContent}
    </>
  );
}
`;

fs.writeFileSync('src/pages/Home.jsx', homeComponent);
console.log('Home.jsx generated successfully.');
