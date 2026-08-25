const fs = require('fs');
const path = require('path');
const dir = 'e:/3.2 project/hotel-booking-system/src/components/dj-artist/events-bookings/detail';
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/getPackageName\(booking, 'dj-artist'\)/g, "getPackageName(booking, 'dj')");
    content = content.replace(/getVendorStatus\(booking, 'dj-artist'\)/g, "getVendorStatus(booking, 'dj')");
    content = content.replace(/getPackageName\(job, 'dj-artist'\)/g, "getPackageName(job, 'dj')");
    content = content.replace(/getVendorStatus\(job, 'dj-artist'\)/g, "getVendorStatus(job, 'dj')");
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Fixed TS Errors');
