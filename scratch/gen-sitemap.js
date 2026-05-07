const fs = require('fs');

// Read ALL college IDs from mock-data.js
const content = fs.readFileSync('frontend/src/data/mock-data.js', 'utf8');
const idMatches = content.match(/id:\s*["']([^"']+)["']/g) || [];
const allIds = [...new Set(idMatches.map(m => m.match(/["']([^"']+)["']/)[1]))];

console.log(`Found ${allIds.length} unique college IDs from mock-data.js`);

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

// === HIGH PRIORITY: Main Pages ===
const staticPages = [
  { url: '',                priority: '1.0', freq: 'daily',   lastmod: today },
  { url: '/predictor',      priority: '1.0', freq: 'daily',   lastmod: today },
  { url: '/colleges',       priority: '0.9', freq: 'daily',   lastmod: today },
  { url: '/aimentor',       priority: '0.8', freq: 'weekly',  lastmod: today },
];

// === LOW PRIORITY: Auth/utility pages (excluded from robots but good for sitemap completeness) ===
const utilityPages = [
  { url: '/login',            priority: '0.3', freq: 'monthly',  lastmod: today },
  { url: '/signup',           priority: '0.3', freq: 'monthly',  lastmod: today },
  { url: '/forgot-password',  priority: '0.2', freq: 'monthly',  lastmod: today },
];

// Write static pages
staticPages.forEach(page => {
  xml += `  <url>\n`;
  xml += `    <loc>https://admyra.in${page.url}</loc>\n`;
  xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${page.freq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>\n`;
  xml += `  </url>\n`;
});

// Write utility pages
utilityPages.forEach(page => {
  xml += `  <url>\n`;
  xml += `    <loc>https://admyra.in${page.url}</loc>\n`;
  xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${page.freq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>\n`;
  xml += `  </url>\n`;
});

// === MEDIUM-HIGH PRIORITY: All College Pages ===
allIds.forEach(id => {
  xml += `  <url>\n`;
  xml += `    <loc>https://admyra.in/colleges/${id}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += `  </url>\n`;
});

xml += '</urlset>';

fs.writeFileSync('frontend/public/sitemap.xml', xml);

const totalUrls = staticPages.length + utilityPages.length + allIds.length;
console.log(`\n✅ Successfully generated frontend/public/sitemap.xml`);
console.log(`   📄 Static pages:  ${staticPages.length}`);
console.log(`   🔐 Utility pages: ${utilityPages.length}`);
console.log(`   🎓 College pages: ${allIds.length}`);
console.log(`   📊 Total URLs:    ${totalUrls}`);
