const fs = require('fs');
const path = require('path');
const content = fs.readFileSync('./template.jsx');

// fs.mkdir('./components');
for (let i = 0; i < 500; i++) {
  const filePath = path.resolve(__dirname, `./components/${i}.jsx`);

  fs.writeFileSync(filePath, content);
}