const fs = require('fs');
const path = require('path');

const srcDir = 'e:/3.2 project/hotel-booking-system/src/components/videographer/events-bookings/detail';
const destDir = 'e:/3.2 project/hotel-booking-system/src/components/dj-artist/events-bookings/detail';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    
    // Replacements
    content = content.split('videographerAPI').join('djAPI');
    content = content.split('vendors?.videographer').join('vendors?.dj');
    content = content.split('videographerCost').join('djCost');
    content = content.split('videographer').join('dj-artist');
    content = content.split('Videographer').join('Dj');
    content = content.split('Videography').join('DJ');
    content = content.split('VIDEOGRAPHER').join('DJ');
    content = content.split('dj-artistAPI').join('djAPI');
    content = content.split('components/dj-artist/').join('components/dj-artist/');
    content = content.split('getVendorStatus(job, "dj-artist")').join('getVendorStatus(job, "dj")');
    content = content.split('getPackageName(job, "dj-artist")').join('getPackageName(job, "dj")');
    content = content.split('vendors?.dj-artist').join('vendors?.dj');
    
    fs.writeFileSync(path.join(destDir, file), content, 'utf8');
    console.log('Copied and transformed: ' + file);
  }
});

const pageSrc = 'e:/3.2 project/hotel-booking-system/src/app/videographer/events-bookings/[id]/page.tsx';
const pageDestDir = 'e:/3.2 project/hotel-booking-system/src/app/dj-artist/events-bookings/[id]';

if (!fs.existsSync(pageDestDir)) {
  fs.mkdirSync(pageDestDir, { recursive: true });
}

let pageContent = fs.readFileSync(pageSrc, 'utf8');
pageContent = pageContent.split('videographer').join('dj-artist');
pageContent = pageContent.split('Videographer').join('Dj');
fs.writeFileSync(path.join(pageDestDir, 'page.tsx'), pageContent, 'utf8');
console.log('Copied page.tsx');
