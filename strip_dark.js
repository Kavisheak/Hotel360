const fs = require('fs');
const path = require('path');

const directoriesToProcess = [
  'src/components/landing/home',
  'src/components/landing/shared',
  'src/app'
];

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  // Regular expression to match any dark: class
  // It matches "dark:" followed by any characters that are valid in a class name
  const regex = /dark:[A-Za-z0-9_\-\/\[\]#\.]+/g;
  
  if (regex.test(content)) {
    const newContent = content.replace(regex, '').replace(/\s+/g, ' ').replace(/ "\}/g, '"}').replace(/ \`/g, '`');
    // a more careful replace that doesn't mess up formatting completely
    // actually, let's just replace `dark:[a-zA-Z0-9_/-[\]#.]+` with empty string
    
    const refinedContent = content.replace(/dark:[A-Za-z0-9_\-\/\[\]#\.]+/g, '');
    fs.writeFileSync(filePath, refinedContent, 'utf8');
    console.log(`Processed: ${filePath}`);
  }
}

function processDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (item === 'home' || item === 'shared' || dirPath === 'src/app' && item === '') {
          // just let it recurse if we are targeting specific ones, actually let's just target the specific files.
      }
    } else {
      // processFile(fullPath);
    }
  }
}

const filesToTarget = [
  'src/components/landing/home/LandingHero.tsx',
  'src/components/landing/home/PackagesSection.tsx',
  'src/components/landing/home/AmenitiesSection.tsx',
  'src/components/landing/home/EstimateSection.tsx',
  'src/components/landing/home/TheHallSection.tsx',
  'src/components/landing/home/FAQSection.tsx',
  'src/components/landing/home/CTASection.tsx',
  'src/components/landing/shared/MainNavbar.tsx',
  'src/components/landing/shared/Footer.tsx',
  'src/app/page.tsx'
];

filesToTarget.forEach(f => {
  const full = path.join(__dirname, f);
  if (fs.existsSync(full)) {
    let content = fs.readFileSync(full, 'utf8');
    // Replace dark:something
    const refinedContent = content.replace(/dark:[A-Za-z0-9_\-\/\[\]#\.]+/g, '').replace(/  +/g, ' ');
    fs.writeFileSync(full, refinedContent, 'utf8');
    console.log(`Cleaned ${f}`);
  }
});
