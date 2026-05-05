const fs = require('fs');
const content = fs.readFileSync('frontend/src/data/mock-data.js', 'utf8');
const idMatches = content.match(/id:\s*["']([^"']+)["']/g) || [];
const uniqueIds = [...new Set(idMatches.map(m => m.match(/["']([^"']+)["']/)[1]))];
console.log(`Found ${uniqueIds.length} unique IDs.`);
uniqueIds.forEach(id => console.log(id));
