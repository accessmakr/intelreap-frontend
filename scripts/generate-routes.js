const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://intelreap.com';
const EXCLUDE_FILES = ['404.html'];
// System and build folders to drop from the dynamic filesystem crawl
const EXCLUDE_DIRS = ['node_modules', '.git', '.github', 'scripts', 'dist', 'build', 'assets'];

/**
 * Recursively parses the filesystem starting at the root directory
 * to discover all nested .html routing files dynamically.
 */
function scanForHtmlFiles(currentDir, fileList = []) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const dirName = path.basename(fullPath);
            if (!EXCLUDE_DIRS.includes(dirName)) {
                scanForHtmlFiles(fullPath, fileList);
            }
        } else if (stat.isFile() && item.endsWith('.html') && !EXCLUDE_FILES.includes(item)) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function getLastModifiedDate(filePath) {
    try {
        const date = execSync(`git log -1 --format="%cI" -- "${filePath}"`).toString().trim();
        return date || new Date().toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
}

function generateCleanUrl(filePath) {
    let cleanPath = filePath
        .replace(/\\/g, '/') // Normalize platform specific slashes
        .replace(/^\.\//, ''); // Strip leading relative dot paths
        
    if (cleanPath === 'index.html') {
        return BASE_URL;
    }
    
    // Enforce strict clean URL parameters for target platforms
    cleanPath = cleanPath.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    return `${BASE_URL}/${cleanPath}`;
}

function runEngine() {
    console.log('🔄 Initializing dynamic repository filesystem map...');
    const detectedFiles = scanForHtmlFiles('.');
    console.log(`Found ${detectedFiles.length} valid production HTML files.`);

    const routeMap = detectedFiles.map(file => ({
        url: generateCleanUrl(file),
        lastmod: getLastModifiedDate(file),
        file: file
    }));

    // Output structured Pages JSON
    fs.writeFileSync('pages.json', JSON.stringify(routeMap, null, 2));
    console.log('✔ Generated pages.json');

    // Build standard-compliant Sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    routeMap.forEach(route => {
        xml += `  <url>\n`;
        xml += `    <loc>${route.url}</loc>\n`;
        xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>${route.url === BASE_URL ? '1.0' : '0.8'}</priority>\n`;
        xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    fs.writeFileSync('sitemap.xml', xml);
    console.log('✔ Generated sitemap.xml');
}

runEngine();
