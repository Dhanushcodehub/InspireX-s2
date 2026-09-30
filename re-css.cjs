const fs = require('fs');

let sharedCss = fs.readFileSync('old_static/shared.css', 'utf8');
let indexHtml = fs.readFileSync('old_static/index.html', 'utf8');
let regHtml = fs.readFileSync('old_static/register.html', 'utf8');

let indexStyleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
let regStyleMatch = regHtml.match(/<style>([\s\S]*?)<\/style>/);

let cssToAppend = `
/* =========================================
   STYLES EXTRACTED FROM SHARED.CSS
========================================= */
${sharedCss}

/* =========================================
   STYLES EXTRACTED FROM INDEX.HTML 
========================================= */
${indexStyleMatch ? indexStyleMatch[1] : ''}

/* =========================================
   STYLES EXTRACTED FROM REGISTER.HTML 
========================================= */
${regStyleMatch ? regStyleMatch[1] : ''}
`;

fs.writeFileSync('src/index.css', cssToAppend);
console.log('src/index.css completely rewritten with only our styles.');
