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

const MONTHS = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12'
};

// lastmod is the page's own "last updated" date, the same date the
// page shows and declares in its JSON-LD (see docs/data/page-dates.json).
// It is never taken from git commit times, because site-wide commits
// (headers, logos, scripts) would then move every page's date.
function readPageDate(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  let m = html.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  m = html.match(/id="freshness-badge"[^>]*>\s*Last updated\s+(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m && MONTHS[m[2]]) return `${m[3]}-${MONTHS[m[2]]}-${m[1].padStart(2, '0')}`;
  m = html.match(/Last Updated<\/span>\s*<span[^>]*>\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m && MONTHS[m[2]]) return `${m[3]}-${MONTHS[m[2]]}-${m[1].padStart(2, '0')}`;
  return null;
}

function getLastModifiedDate(filePath) {
  const own = readPageDate(filePath);
  if (own) return own;
  try {
    const date = execSync(
      `git log -1 --format="%cs" -- "${filePath}"`
    ).toString().trim();
    return date || new Date().toISOString().slice(0, 10);
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
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
