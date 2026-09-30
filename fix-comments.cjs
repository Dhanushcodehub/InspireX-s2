const fs = require('fs');

const files = ['src/pages/Home.jsx', 'src/pages/Register.jsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // replace html comments with jsx comments
  content = content.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
  fs.writeFileSync(file, content);
});
console.log('Fixed JSX comments');
