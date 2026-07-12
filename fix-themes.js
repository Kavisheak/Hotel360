const fs = require('fs');
const path = require('path');
const dir = 'e:/3.2 project/hotel-booking-system/src/components/landing/book';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace bg-[#111111] -> bg-[#FDFBF7] dark:bg-[#111111]
  content = content.replace(/bg-\[\#111111\]/g, 'bg-[#FDFBF7] dark:bg-[#111111]');

  // Replace bg-[#1A1A1A] -> bg-white dark:bg-[#1A1A1A]
  // Careful not to replace dark:bg-[#1A1A1A]
  content = content.replace(/(?<!dark:)bg-\[\#1A1A1A\]/g, 'bg-white dark:bg-[#1A1A1A]');

  // Replace border-[#C9A84C]/20 -> border-[#D4C9A8] dark:border-[#C9A84C]/20
  // content = content.replace(/(?<!dark:)border-\[\#C9A84C\]\/20/g, 'border-[#D4C9A8] dark:border-[#C9A84C]/20');

  // Replace text-white -> text-[#2C1E14] dark:text-white
  content = content.replace(/(?<!dark:)text-white/g, 'text-[#2C1E14] dark:text-white');

  // Replace text-gray-400 -> text-gray-600 dark:text-gray-400
  content = content.replace(/(?<!dark:)text-gray-400/g, 'text-gray-600 dark:text-gray-400');
  
  // Replace text-gray-500 -> text-gray-600 dark:text-gray-500
  content = content.replace(/(?<!dark:)text-gray-500/g, 'text-gray-600 dark:text-gray-500');

  // Replace bg-[#2A1111] -> bg-red-50 dark:bg-[#2A1111]
  content = content.replace(/bg-\[\#2A1111\]/g, 'bg-red-50 dark:bg-[#2A1111]');
  
  // Replace text-red-500/50 -> text-red-600 dark:text-red-500/50
  content = content.replace(/(?<!dark:)text-red-500\/50/g, 'text-red-600 dark:text-red-500/50');
  
  // Replace border-red-900/50 -> border-red-200 dark:border-red-900/50
  content = content.replace(/(?<!dark:)border-red-900\/50/g, 'border-red-200 dark:border-red-900/50');

  // Replace bg-[#2A1A00] -> bg-orange-50 dark:bg-[#2A1A00]
  content = content.replace(/bg-\[\#2A1A00\]/g, 'bg-orange-50 dark:bg-[#2A1A00]');
  
  // Replace text-orange-500/60 -> text-orange-600 dark:text-orange-500/60
  content = content.replace(/(?<!dark:)text-orange-500\/60/g, 'text-orange-600 dark:text-orange-500/60');
  
  // Replace border-orange-900/50 -> border-orange-200 dark:border-orange-900/50
  content = content.replace(/(?<!dark:)border-orange-900\/50/g, 'border-orange-200 dark:border-orange-900/50');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Replacements completed.');
