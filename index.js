const fs = require('fs');
const path = require('path');

const targetDir = './New file'; // change to the folder you want
const outputFile = 'folder1.json';
try {
  const allItems = fs.readdirSync(targetDir);
  const folders = allItems.filter(item => {
    const fullPath = path.join(targetDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(folders, null, 2));
  console.log(`✅ Folder names written to ${outputFile}`);
} catch (err) {
  console.error('❌ Error reading directory:', err);
}