// ─────────────────────────────────────────
// INTELREAP SEARCH SYSTEM
// Lightweight client-side search
// Triggered by .trigger-search
// Searches INTELREAP_REGISTRY
// ─────────────────────────────────────────

const SearchSystem = (() => {

  let modalInjected = false
  let searchInput = null
  let searchResults = null
  let isOpen = false

  // ─────────────────────────────────────
  // BUILD MODAL
  // ─────────────────────────────────────

  const buildModal = () => {
    const overlay = document.createElement('div')
    overlay.className = 'ndic-search-overlay'
    overlay.id = 'ndic-search-overlay'
    overlay.setAttribute('aria-hidden', 'true')
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-label', 'Search')

    overlay.innerHTML = `
      <div class="ndic-search-modal">
        <div class="ndic-search-header">
          <div class="ndic-search-input-wrap">
            <svg class="ndic-search-icon"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor">
              <path stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0
                7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              id="ndic-search-input"
              class="ndic-search-input"
              placeholder="Search intelligence panels..."
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <button
            class="ndic-search-close"
            id="ndic-search-close"
            aria-label="Close search"
          >
            ESC
          </button>
        </div>
        <div
          id="ndic-search-results"
          class="ndic-search-results"
          role="listbox"
          aria-label="Search results"
        ></div>
        <div class="ndic-search-footer">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>ESC close</span>
        </div>
      </div>
    `

    return overlay
  }

  // ─────────────────────────────────────
  // SEARCH LOGIC
  // ─────────────────────────────────────

  const searchPages = (query) => {
    if (!query || query.length < 2) return []

    const q = query.toLowerCase().trim()
    const pages =
      INTELREAP_REGISTRY.pages.filter(p =>
        p.category !== 'legal'
      )

    const scored = pages.map(page => {
      let score = 0

      // Title match — highest weight
      if (page.title.toLowerCase()
          .includes(q)) score += 10

      // Short title match
      if (page.shortTitle.toLowerCase()
          .includes(q)) score += 8

      // Description match
      if (page.description.toLowerCase()
          .includes(q)) score += 5

      // Keywords match
      if (page.keywords?.some(k =>
        k.toLowerCase().includes(q)
      )) score += 6

      return { page, score }
    })

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(s => s.page)
  }

  // ─────────────────────────────────────
  // RENDER RESULTS
  // ─────────────────────────────────────

  const renderResults = (pages, query) => {
    if (!searchResults) return

    if (pages.length === 0) {
      searchResults.innerHTML = `
        <div class="ndic-search-empty">
          No results for
          "<strong>${query}</strong>"
        </div>
      `
      return
    }

    const basePath =
      INTELREAP_CONFIG?.getBasePath() || './'

    searchResults.innerHTML = pages.map(
      (page, index) => `
        
          href="${basePath}${page.url.replace(/^\//, '')}"
          class="ndic-search-result"
          role="option"
          data-index="${index}"
          tabindex="-1"
        >
          <div class="ndic-result-title">
            ${page.title}
          </div>
          <div class="ndic-result-description">
            ${page.description.substring(0, 100)}...
          </div>
          <div class="ndic-result-category">
            ${page.category}
          </div>
        </a>
      `
    ).join('')
  }

  // ─────────────────────────────────────
  // OPEN / CLOSE MODAL
  // ─────────────────────────────────────

  const openModal = () => {
    const overlay = document.getElementById(
      'ndic-search-overlay'
    )
    if (!overlay) return

    overlay.classList.add(
      'ndic-search-overlay--open'
    )
    overlay.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    isOpen = true

    // Auto focus input
    setTimeout(() => {
      searchInput =
        document.getElementById('ndic-search-input')
      if (searchInput) searchInput.focus()
    }, 50)
  }

  const closeModal = () => {
    const overlay = document.getElementById(
      'ndic-search-overlay'
    )
    if (!overlay) return

    overlay.classList.remove(
      'ndic-search-overlay--open'
    )
    overlay.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    isOpen = false

    // Clear input
    if (searchInput) searchInput.value = ''
    if (searchResults) searchResults.innerHTML = ''
  }

  // ─────────────────────────────────────
  // KEYBOARD NAVIGATION
  // ─────────────────────────────────────

  const handleKeyDown = (e) => {
    if (!isOpen) return

    if (e.key === 'Escape') {
      closeModal()
      return
    }

    const results = searchResults
      ? Array.from(
          searchResults.querySelectorAll(
            '.ndic-search-result'
          )
        )
      : []

    if (results.length === 0) return

    const active = searchResults
      .querySelector(
        '.ndic-search-result--active'
      )
    const currentIndex = active
      ? parseInt(
          active.getAttribute('data-index')
        )
      : -1

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(
        currentIndex + 1,
        results.length - 1
      )
      results.forEach(r =>
        r.classList.remove(
          'ndic-search-result--active'
        )
      )
      results[next]?.classList.add(
        'ndic-search-result--active'
      )
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(currentIndex - 1, 0)
      results.forEach(r =>
        r.classList.remove(
          'ndic-search-result--active'
        )
      )
      results[prev]?.classList.add(
        'ndic-search-result--active'
      )
    }

    if (e.key === 'Enter') {
      const activeResult = searchResults
        .querySelector(
          '.ndic-search-result--active'
        )
      if (activeResult) {
        window.location.href = activeResult.href
      }
    }
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = () => {
    if (modalInjected) return
    if (
      typeof INTELREAP_REGISTRY === 'undefined'
    ) return

    // Inject modal into DOM
    const modal = buildModal()
    document.body.appendChild(modal)
    modalInjected = true

    searchInput =
      document.getElementById('ndic-search-input')
    searchResults =
      document.getElementById('ndic-search-results')

    // Wire up search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim()
        if (query.length >= 2) {
          const results = searchPages(query)
          renderResults(results, query)
        } else {
          searchResults.innerHTML = ''
        }
      })
    }

    // Wire up close button
    const closeBtn =
      document.getElementById('ndic-search-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal)
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal()
    })

    // Wire up all search triggers
    document.querySelectorAll(
      '.trigger-search'
    ).forEach(trigger => {
      trigger.addEventListener('click', openModal)
    })

    // Global keyboard handler
    document.addEventListener(
      'keydown',
      handleKeyDown
    )

    // Global keyboard shortcut (Ctrl+K / Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) &&
          e.key === 'k') {
        e.preventDefault()
        isOpen ? closeModal() : openModal()
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    )
  } else {
    init()
  }

  return { init, openModal, closeModal }

})()
