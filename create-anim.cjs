const fs = require('fs');

let mainJs = fs.readFileSync('old_static/main.js', 'utf8');

let newMainJs = `
export function initAnimations() {
${mainJs}
}
`;

fs.writeFileSync('src/animations.js', newMainJs);
console.log('animations.js created');
