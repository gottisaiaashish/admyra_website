import express from 'express';
const router = express.Router();

// Mock college data for sitemap (matching frontend IDs)
const colleges = [
  { id: 1, name: 'JNTU Hyderabad' },
  { id: 2, name: 'Osmania University' },
  { id: 3, name: 'CBIT Hyderabad' },
  { id: 4, name: 'Vasavi College of Engineering' },
  { id: 5, name: 'VNR VJIET' },
  { id: 6, name: 'Gokaraju Rangaraju (GRIET)' },
  { id: 7, name: 'MVSR Engineering College' },
  { id: 8, name: 'BVRIT Narsapur' },
  { id: 9, name: 'MGIT' },
  { id: 10, name: 'Vardhaman College' },
  { id: 11, name: 'KMIT' },
  { id: 12, name: 'GNITS (Womens)' },
  { id: 13, name: 'SNIST' },
  { id: 14, name: 'CVR College' },
  { id: 15, name: 'IARE' }
];

router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://admyra.in';
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Static Pages
  const staticPages = ['', '/predictor', '/colleges', '/aimentor', '/login', '/signup'];
  staticPages.forEach(page => {
    xml += '<url>';
    xml += `<loc>${baseUrl}${page}</loc>`;
    xml += '<changefreq>weekly</changefreq>';
    xml += '<priority>0.8</priority>';
    xml += '</url>';
  });
  
  // Dynamic College Pages
  colleges.forEach(college => {
    xml += '<url>';
    xml += `<loc>${baseUrl}/colleges/${college.id}</loc>`;
    xml += '<changefreq>monthly</changefreq>';
    xml += '<priority>0.6</priority>';
    xml += '</url>';
  });
  
  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

export default router;
