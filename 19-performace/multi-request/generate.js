const fs = require("fs");
const path = require("path");
const content = fs.readFileSync("./src/template.jsx");

fs.mkdirSync("./src/components");
for (let i = 0; i < 100; i++) {
  const filePath = path.resolve(__dirname, `src/components/${i}.jsx`);

  fs.writeFileSync(filePath, content);
}
