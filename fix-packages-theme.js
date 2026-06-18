const fs = require('fs');
const path = require('path');
const dir = 'e:/3.2 project/hotel-booking-system/src/components/landing/packages';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace backgrounds
  content = content.replace(/(?<!dark:)bg-\[\#0A0A0A\]/g, 'bg-[#F0E6D0] dark:bg-[#0A0A0A]');
  content = content.replace(/(?<!dark:)bg-\[\#111111\]/g, 'bg-[#FDFBF7] dark:bg-[#111111]');
  content = content.replace(/(?<!dark:)bg-\[\#1A1A1A\]/g, 'bg-white dark:bg-[#1A1A1A]');

  // Replace texts
  content = content.replace(/(?<!dark:)text-white/g, 'text-[#2C1E14] dark:text-white');
  content = content.replace(/(?<!dark:)text-gray-400/g, 'text-gray-600 dark:text-gray-400');
  content = content.replace(/(?<!dark:)text-gray-300/g, 'text-gray-700 dark:text-gray-300');
  content = content.replace(/(?<!dark:)text-gray-500/g, 'text-gray-500 dark:text-gray-400');
  content = content.replace(/(?<!dark:)text-\[\#C9A84C\]/g, 'text-[#805D3A] dark:text-[#C9A84C]');
  
  // Replace borders
  content = content.replace(/(?<!dark:)border-\[\#C9A84C\]\/20/g, 'border-[#D4C9A8] dark:border-[#C9A84C]/20');
  content = content.replace(/(?<!dark:)border-\[\#C9A84C\]\/30/g, 'border-[#D4C9A8] dark:border-[#C9A84C]/30');
  
  // Custom hero lines
  content = content.replace(/bg-white/g, 'bg-[#805D3A]/20 dark:bg-white');

  fs.writeFileSync(filePath, content, 'utf8');
}

// Fix page.tsx
const pagePath = 'e:/3.2 project/hotel-booking-system/src/app/customer/packages/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace(/bg-\[\#0A0A0A\] min-h-screen flex flex-col font-sans text-white/g, 'bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white transition-colors duration-300');
fs.writeFileSync(pagePath, pageContent, 'utf8');

console.log('Replacements completed.');
