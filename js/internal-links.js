// ─────────────────────────────────────────
// INTELREAP INTERNAL LINKS ENGINE
// Populates dynamic-internal-links div
// Contextual linking per page
// ─────────────────────────────────────────

const InternalLinksEngine = (() => {

  const buildLinksBlock = (
    currentPage,
    relatedPages,
    basePath
  ) => {
    const container =
      document.getElementById(
        'dynamic-internal-links'
      )
    if (!container) return

    const deepDivePages =
      INTELREAP_REGISTRY.getDeepDivePages()

    container.innerHTML = `
      <div class="ndic-internal-links">
        <div class="ndic-internal-links-header">
          <span>Explore Intelligence Panels</span>
        </div>
        <div class="ndic-internal-links-grid">
          ${deepDivePages.map(page => `
            
              href="${basePath}${page.url.replace(/^\//, '')}"
              class="ndic-internal-link ${
                currentPage?.id === page.id
                  ? 'ndic-internal-link--active'
                  : ''
              }"
            >
              <span class="ndic-link-title">
                ${page.shortTitle}
              </span>
              <span class="ndic-link-desc">
                ${page.description.substring(0, 70)}...
              </span>
            </a>
          `).join('')}
        </div>
        <div class="ndic-internal-links-footer">
          
            href="${basePath}index.html"
            class="ndic-back-to-main"
          >
            ← Back to Intelligence Center
          </a>
        </div>
      </div>
    `
  }

  const init = () => {
    if (
      typeof INTELREAP_REGISTRY === 'undefined' ||
      typeof INTELREAP_CONFIG === 'undefined'
    ) return

    const currentPage =
      INTELREAP_REGISTRY.getCurrentPage()
    const relatedPages =
      INTELREAP_REGISTRY.getRelatedPages(
        currentPage?.id
      )
    const basePath =
      INTELREAP_CONFIG.getBasePath()

    buildLinksBlock(
      currentPage,
      relatedPages,
      basePath
    )
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    )
  } else {
    init()
  }

  return { init }

})()
