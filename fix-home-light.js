const fs = require('fs');
const path = require('path');

const dir = 'e:/3.2 project/hotel-booking-system/src/components/landing/home';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace section backgrounds
  content = content.replace(/bg-\[\#F0E6D0\]/g, 'bg-white');
  content = content.replace(/bg-\[\#FDFBF7\]/g, 'bg-white');

  if (file === 'LandingHero.tsx') {
    // Brighten the gradient overlays
    content = content.replace(/from-\[\#F0E6D0\]\/95 via-\[\#F6EED9\]\/60 to-\[\#F0E6D0\]\/85/g, 'from-white/95 via-white/40 to-white/90');
    // Button styling for Explore Packages
    content = content.replace(/bg-white\/20 dark:bg-black\/20 backdrop-blur-sm/g, 'bg-white dark:bg-black/20 backdrop-blur-sm');
    content = content.replace(/border border-\[\#805D3A\]\/60/g, 'border border-[#805D3A]/30');
  }

  if (file === 'PackagesSection.tsx') {
    // Card styling
    // First, restore the Gold card to have bg-[#FDFBF7] if needed, but since we replaced #FDFBF7 to white globally,
    // let's adjust the card loop.
    content = content.replace(/flex flex-col bg-white dark:bg-\[\#111111\] overflow-hidden transition-all duration-500 relative card-entrance stagger-\$\{index \+ 1\} \$\{/g, 
      "flex flex-col overflow-hidden transition-all duration-500 relative card-entrance stagger-  

  if (file === 'EstimateSection.tsx') {
    // The estimate card originally had bg-[#F0E6D0]/50, which became bg-white/50.
    content = content.replace(/bg-white\/50 dark:bg-\[\#111111\]/g, 'bg-[#FDFBF7] dark:bg-[#111111]');
  }

  if (file === 'CTASection.tsx') {
    // Button
    content = content.replace(/border border-\[\#805D3A\]\/60 dark:border-\[\#C9A84C\]\/60 bg-white\/20/g, 'border border-[#805D3A]/30 dark:border-[#C9A84C]/60 bg-white');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// Update page.tsx
const pagePath = 'e:/3.2 project/hotel-booking-system/src/app/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace(/bg-\[\#FDFBF7\]/g, 'bg-white');
fs.writeFileSync(pagePath, pageContent, 'utf8');

console.log('Replacements completed.');
