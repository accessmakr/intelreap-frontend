/**
 * menu-system.js
 * Priority: High - Renders the main navigation from registry.js
 */

(function() {
    const renderMenu = () => {
        const dock = document.getElementById('master-nav-dock');
        const registry = window.siteRegistry;

        // Exit if the dock is missing or registry hasn't loaded yet
        if (!dock) return;
        if (!registry) {
            // Re-attempt in 10ms if registry.js is still parsing
            setTimeout(renderMenu, 10);
            return;
        }

        // Build the navigation structure
        let menuHTML = `
            <nav class="flex items-center gap-4 font-semibold text-sm">
                <a href="/index.html" class="px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors">Home</a>
        `;

        // Loop through categories in registry.js (e.g., guides, tools)
        for (const [category, items] of Object.entries(registry)) {
            menuHTML += `
                <div class="relative group">
                    <button class="flex items-center gap-1 px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors capitalize">
                        ${category}
                        <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="absolute left-0 mt-1 w-64 hidden group-hover:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[100]">
                        <div class="p-2 space-y-1">
                            ${items.map(item => `
                                <a href="${item.url}" class="block px-4 py-2 text-xs font-medium hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-l-2 border-transparent hover:border-blue-600 text-slate-600 dark:text-slate-300">
                                    ${item.name}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        menuHTML += `</nav>`;
        dock.innerHTML = menuHTML;
    };

    renderMenu();
})();
