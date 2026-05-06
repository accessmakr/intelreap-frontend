/**
 * search-system.js
 * Implementation: Dynamic search index from registry.js
 */

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const triggers = document.querySelectorAll('.trigger-search');
        if (!triggers.length || !window.siteRegistry) return;

        // 1. Create Modal UI
        const modal = document.createElement('div');
        modal.id = "search-overlay";
        modal.className = "fixed inset-0 z-[10000] bg-slate-950/90 backdrop-blur-md hidden flex-col items-center pt-24 px-6";
        modal.innerHTML = `
            <div class="w-full max-w-2xl animate-fade-in">
                <div class="relative group">
                    <input type="text" id="global-search-input" placeholder="Search guides, tools, and resources..." 
                        class="w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 shadow-2xl text-xl outline-none transition-all">
                    <kbd class="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-400">ESC</kbd>
                </div>
                <div id="global-search-results" class="mt-6 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const input = document.getElementById('global-search-input');
        const resultsBox = document.getElementById('global-search-results');

        // 2. Flatten registry for searching
        const getFlattenedIndex = () => {
            const index = [];
            Object.keys(window.siteRegistry).forEach(category => {
                window.siteRegistry[category].forEach(item => {
                    index.push({ ...item, category: category });
                });
            });
            return index;
        };

        const renderResults = (query) => {
            const index = getFlattenedIndex();
            const filtered = index.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase())
            );

            resultsBox.innerHTML = filtered.map(item => `
                <a href="${item.url}" class="flex items-center justify-between p-5 bg-white dark:bg-slate-900 hover:bg-blue-600 hover:text-white rounded-2xl transition-all border border-slate-100 dark:border-slate-800 group shadow-sm">
                    <div>
                        <div class="font-bold text-lg">${item.name}</div>
                        <div class="text-[10px] uppercase tracking-widest opacity-60 group-hover:text-blue-100">${item.category}</div>
                    </div>
                    <span class="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                </a>
            `).join('');

            if (filtered.length === 0) {
                resultsBox.innerHTML = `<div class="text-center py-12 text-slate-500">No results found for "${query}"</div>`;
            }
        };

        // 3. Event Handlers
        const openSearch = () => {
            modal.classList.remove('hidden');
            input.focus();
            renderResults("");
        };

        const closeSearch = () => {
            modal.classList.add('hidden');
            input.value = "";
        };

        triggers.forEach(t => t.addEventListener('click', openSearch));
        input.addEventListener('input', (e) => renderResults(e.target.value));
        
        // Close on ESC or clicking backdrop
        window.addEventListener('keydown', (e) => { if(e.key === "Escape") closeSearch(); });
        modal.addEventListener('click', (e) => { if(e.target === modal) closeSearch(); });
    });
})();
