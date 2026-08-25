const fs = require('fs');

let indexHtml = fs.readFileSync('old_static/index.html', 'utf8');
let regHtml = fs.readFileSync('old_static/register.html', 'utf8');

let indexStyleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
let regStyleMatch = regHtml.match(/<style>([\s\S]*?)<\/style>/);

let cssToAppend = `
/* =========================================
   STYLES EXTRACTED FROM INDEX.HTML 
========================================= */
${indexStyleMatch ? indexStyleMatch[1] : ''}

/* =========================================
   STYLES EXTRACTED FROM REGISTER.HTML 
========================================= */
${regStyleMatch ? regStyleMatch[1] : ''}
`;

fs.appendFileSync('src/index.css', cssToAppend);
console.log('Styles appended to src/index.css');
