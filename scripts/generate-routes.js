const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://intelreap.com';

// Utility, verification and error pages are never listed.
const EXCLUDE_FILES = [
  '404.html',
  '410.html',
  'offline.html',
  'pinterest-917fa.html'
];
const EXCLUDE_DIRS = [
  'node_modules', '.git', '.github',
  'scripts', 'dist', 'build', 'assets'
];

function scanForHtmlFiles(currentDir, fileList = []) {
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(path.basename(fullPath))) {
        scanForHtmlFiles(fullPath, fileList);
      }
    } else if (
      stat.isFile() &&
      item.endsWith('.html') &&
      !EXCLUDE_FILES.includes(item)
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function getLastModifiedDate(filePath) {
  try {
    const date = execSync(
      `git log -1 --format="%cI" -- "${filePath}"`
    ).toString().trim();
    return date || new Date().toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
}

function fallbackUrl(filePath) {
  let clean = filePath
    .replace(/\\/g, '/')
    .replace(/^\.\//, '');
  if (clean === 'index.html') return BASE_URL;
  clean = clean.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  return `${BASE_URL}/${clean}`;
}

// The sitemap must list exactly the URL each page declares as
// canonical. Pages marked noindex are skipped.
function readUrl(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) {
    return null;
  }
  const m = html.match(
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
  );
  return m ? m[1] : fallbackUrl(filePath);
}

function runEngine() {
  console.log('Scanning repository for HTML pages...');
  const files = scanForHtmlFiles('.').sort();
  console.log(`Found ${files.length} candidate HTML files.`);

  const seen = new Set();
  const routeMap = [];
  for (const file of files) {
    const url = readUrl(file);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    routeMap.push({
      url,
      lastmod: getLastModifiedDate(file),
      file
    });
  }

  fs.writeFileSync('pages.json', JSON.stringify(routeMap, null, 2));
  console.log(`Generated pages.json (${routeMap.length} pages)`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  routeMap.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${route.url}</loc>\n`;
    xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
    xml += '  </url>\n';
  });
  xml += '</urlset>\n';
  fs.writeFileSync('sitemap.xml', xml);
  console.log('Generated sitemap.xml');
}

runEngine();
