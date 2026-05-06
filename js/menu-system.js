/**
 * menu-system.js
 * Implementation: Dynamic fetch from registry.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const navDock = document.getElementById('master-nav-dock');
    
    // Safety check: ensure registry exists and dock is present
    if (!navDock || !window.siteRegistry) {
        console.error("Menu System: Navigation dock or registry.js missing.");
        return;
    }

    const registry = window.siteRegistry;
    const menuContainer = document.createElement('nav');
    menuContainer.className = "flex items-center gap-2 sm:gap-4 font-semibold text-sm";

    // 1. Static Homepage Link
    const homeLink = document.createElement('a');
    homeLink.href = "/index.html";
    homeLink.className = "px-3 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 transition-colors";
    homeLink.innerText = "Home";
    menuContainer.appendChild(homeLink);

    // 2. Dynamic Folders from Registry
    // Expected Registry structure: { guides: [...], tools: [...] }
    Object.keys(registry).forEach(folderName => {
        const folderData = registry[folderName];
        
        const wrapper = document.createElement('div');
        wrapper.className = "relative group";

        wrapper.innerHTML = `
            <button class="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 transition-colors capitalize">
                ${folderName}
                <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div class="absolute right-0 mt-1 w-64 hidden group-hover:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[100] animate-fade-in">
                <div class="p-2 space-y-1">
                    ${folderData.map(file => `
                        <a href="${file.url}" class="block px-4 py-2 text-xs font-medium hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-l-2 border-transparent hover:border-blue-600">
                            ${file.name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        menuContainer.appendChild(wrapper);
    });

    navDock.appendChild(menuContainer);
});
