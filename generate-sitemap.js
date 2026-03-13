const fs = require('fs');

// Your Supabase credentials
const SUPABASE_URL = 'https://xtooblgzedrkyxdmwvpp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0b29ibGd6ZWRya3l4ZG13dnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzc2NzQsImV4cCI6MjA4ODkxMzY3NH0.sLwUrLeHo1YJqGPcN8voeaLYlrS5e6o4px7tvez_4M4';
const SITE_URL = 'https://dekho.elv8dgtl.in';

async function generateSitemap() {
  console.log('Fetching published articles from Supabase...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?status=eq.published&select=slug,updated_at,created_at`, {
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const articles = await response.json();
    
    let articleUrls = '';
    articles.forEach(article => {
      // Use updated_at if available, otherwise fallback to created_at or today
      const lastMod = article.updated_at || article.created_at || new Date().toISOString();
      articleUrls += `
  <url>
    <loc>${SITE_URL}/dekho-article.html?slug=${article.slug}</loc>
    <lastmod>${lastMod.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${articleUrls}
</urlset>`;

    fs.writeFileSync('sitemap.xml', xml);
    console.log('✅ sitemap.xml generated successfully!');
    
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
