const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });
  return results;
}
const files = walk('src');
files.forEach(f => {
  if (f.endsWith('.tsx') || f.endsWith('.ts')) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('API_BASE')) {
      let originalContent = content;
      // replace `${API_BASE}${some.var}` with getImageUrl(some.var)
      content = content.replace(/\`\$\{API_BASE\}\$\{([^}]+)\}\`/g, 'getImageUrl($1)');
      
      if (content !== originalContent) {
          if (!content.includes('getImageUrl')) {
             // In case getImageUrl wasn't in the original file
          }
          const importStmt = 'import { getImageUrl } from "@/lib/utils";\n';
          if (!content.includes(importStmt)) {
              const lastImportIdx = content.lastIndexOf('import ');
              if (lastImportIdx !== -1) {
                  const nextLine = content.indexOf('\n', lastImportIdx);
                  content = content.slice(0, nextLine + 1) + importStmt + content.slice(nextLine + 1);
              } else {
                  content = importStmt + content;
              }
          }
          fs.writeFileSync(f, content);
          console.log('Updated ' + f);
      }
    }
  }
});
