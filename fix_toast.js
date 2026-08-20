const fs = require('fs');

const files = [
  'src/components/landing/book/BookingHistory.tsx',
  'src/components/myaccount/RefundRequestModal.tsx'
];

files.forEach(f => {
  const p = 'e:/3.2 project/hotel-booking-system/' + f;
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf-8');
  
  // replace addToast(A, B) with addToast({ message: A, type: B })
  // Match addToast( ... , ... ) ensuring no brackets inside to avoid nested calls if any
  // Wait, some might just be variables.
  code = code.replace(/addToast\(([^,]+),\s*([^)]+)\)/g, 'addToast({ message: $1, type: $2 })');
  
  fs.writeFileSync(p, code);
  console.log('Fixed ' + f);
});
