// ─────────────────────────────────────────
// INTELREAP ROOT CONFIGURATION
// Global site constants
// Dynamic year and date utilities
// ─────────────────────────────────────────

const INTELREAP_CONFIG = {

  // ─────────────────────────────────────
  // SITE IDENTITY
  // ─────────────────────────────────────

  siteName: 'IntelReap',
  siteTagline: 'Real-time network and device intelligence.',
  siteDescription: 'IntelReap reveals your network infrastructure, device fingerprint, security posture and browser capabilities in real time. Free. No login required.',
  baseUrl: 'https://intelreap.com',
  toolName: 'NDIC',
  toolFullName: 'Network and Device Intelligence Center',
  reportName: 'Network and Device Intelligence Report',
  version: '1.0.0',

  // ─────────────────────────────────────
  // SOCIAL LINKS
  // ─────────────────────────────────────

  social: {
    twitter: 'https://twitter.com/intelreap'
  },

  // ─────────────────────────────────────
  // CONTACT
  // ─────────────────────────────────────

  contact: {
    email: 'stmakarios@gmail.com',
    formName: 'Request And Contact'
  },

  // ─────────────────────────────────────
  // DYNAMIC DATE UTILITIES
  // ─────────────────────────────────────

  getCurrentYear() {
    return new Date().getFullYear()
  },

  getCurrentDate() {
    return new Date().toISOString().split('T')[0]
  },

  // Date of the last real content update.
  // Change this only when site content changes.
  siteLastModified: '2026-10-02',

  getSchemaDateModified() {
    return this.siteLastModified
  },

  // ─────────────────────────────────────
  // SEASONAL BANNER
  // ─────────────────────────────────────

  getSeason() {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) {
      return {
        label: 'Spring Edition',
        emoji: '🌱',
        color: '#48bb78'
      }
    }
    if (month >= 5 && month <= 7) {
      return {
        label: 'Summer Edition',
        emoji: '☀️',
        color: '#ecc94b'
      }
    }
    if (month >= 8 && month <= 10) {
      return {
        label: 'Fall Edition',
        emoji: '🍂',
        color: '#ed8936'
      }
    }
    return {
      label: 'Winter Edition',
      emoji: '❄️',
      color: '#76e4f7'
    }
  },

  // ─────────────────────────────────────
  // CTA ROTATION
  // ─────────────────────────────────────

  ctaVariants: [
    'Run Intelligence Scan',
    'Analyse My Connection',
    'Reveal My Network',
    'Start Free Scan',
    'Inspect My Device',
    'Run Full Diagnostic'
  ],

  getRandomCTA() {
    const variants = this.ctaVariants
    return variants[
      Math.floor(Math.random() * variants.length)
    ]
  },

  // ─────────────────────────────────────
  // TRUST STATS
  // ─────────────────────────────────────

  trust: {
    stat1: '285 data points',
    stat1Label: 'per scan',
    stat2: '13 intelligence panels',
    stat2Label: 'per report',
    stat3: 'No account needed',
    stat3Label: 'free to use'
  },

  // ─────────────────────────────────────
  // FRESHNESS BADGE
  // ─────────────────────────────────────

  getFreshnessBadge() {
    const modified = new Date(
      this.siteLastModified + 'T00:00:00Z'
    )
    const label = modified.toLocaleDateString(
      'en-GB',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }
    )
    return `Last updated ${label}`
  },

  // ─────────────────────────────────────
  // PATHS
  // Resolves correct relative paths
  // based on current page depth
  // ─────────────────────────────────────

  getBasePath() {
    const path = window.location.pathname
    const parts = path.split('/').filter(Boolean)
    const depth = path.endsWith('/')
      ? parts.length
      : parts.length - 1

    if (depth <= 0) return './'
    return '../'.repeat(depth)
  },

  getJsPath() {
    return this.getBasePath() + 'js/'
  },

  getAssetsPath() {
    return this.getBasePath() + 'assets/'
  }
}

// ─────────────────────────────────────────
// DYNAMIC YEAR INJECTION
// Replaces all .dynamic-year elements
// ─────────────────────────────────────────

const injectDynamicYears = () => {
  const year = INTELREAP_CONFIG.getCurrentYear()
  const elements = document.querySelectorAll(
    '.dynamic-year'
  )
  elements.forEach(el => {
    el.textContent = year
  })

  // Also update copyright
  const copyrightEls = document.querySelectorAll(
    '.copyright-year'
  )
  copyrightEls.forEach(el => {
    el.textContent = `© ${year} IntelReap`
  })
}

// ─────────────────────────────────────────
// SEASONAL BANNER INJECTION
// ─────────────────────────────────────────

const injectSeasonalBanner = () => {
  const banner = document.getElementById(
    'seasonal-banner'
  )
  if (!banner) return

  const season = INTELREAP_CONFIG.getSeason()
  banner.textContent =
    `${season.emoji} ${season.label}`
  banner.style.setProperty(
    '--season-color',
    season.color
  )
  banner.style.color =
    `color-mix(in srgb, ${season.color} 60%, var(--color-text-primary))`
}

// ─────────────────────────────────────────
// CTA ROTATION INJECTION
// ─────────────────────────────────────────

const injectCTARotation = () => {
  const ctaButtons = document.querySelectorAll(
    '.cta-rotate'
  )

  ctaButtons.forEach(btn => {
    btn.textContent =
      INTELREAP_CONFIG.getRandomCTA()
  })

  // Rotate every 4 seconds
  setInterval(() => {
    ctaButtons.forEach(btn => {
      btn.style.opacity = '0'
      setTimeout(() => {
        btn.textContent =
          INTELREAP_CONFIG.getRandomCTA()
        btn.style.opacity = '1'
      }, 300)
    })
  }, 4000)
}

// ─────────────────────────────────────────
// FRESHNESS BADGE INJECTION
// ─────────────────────────────────────────

const injectFreshnessBadge = () => {
  const badge = document.getElementById(
    'freshness-badge'
  )
  if (!badge) return

  badge.textContent =
    INTELREAP_CONFIG.getFreshnessBadge()
}

// ─────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────

const initScrollProgressBar = () => {
  const bar = document.getElementById(
    'scroll-progress-bar'
  )
  if (!bar) return

  const updateBar = () => {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop

    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight

    const progress = docHeight > 0
      ? (scrollTop / docHeight) * 100
      : 0

    bar.style.width = `${progress}%`
  }

  window.addEventListener(
    'scroll',
    updateBar,
    { passive: true }
  )

  updateBar()
}

// ─────────────────────────────────────────
// THEME
// Light is the default. With no saved choice the
// site follows the visitor's system setting, and
// falls back to light when the system gives none.
// The toggle saves an explicit "light" or "dark"
// choice. The inline <head> script applies the
// theme before first paint to avoid a flash.
// ─────────────────────────────────────────

const THEME_KEY = 'ndic_theme'
const THEME_COLORS = { light: '#fafbfc', dark: '#10141b' }
const THEME_SYSTEM_QUERY = window.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null

const getSavedTheme = () => {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch (e) {
    return null
  }
}

const getSystemTheme = () => {
  return THEME_SYSTEM_QUERY && THEME_SYSTEM_QUERY.matches
    ? 'dark'
    : 'light'
}

const getCurrentTheme = () => {
  return document.documentElement
    .getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light'
}

const syncThemeButtons = (theme) => {
  const next = theme === 'dark' ? 'light' : 'dark'
  document.querySelectorAll('.theme-toggle-btn')
    .forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${next} theme`)
      btn.setAttribute('title', `Switch to ${next} theme`)
      btn.setAttribute(
        'aria-pressed',
        theme === 'dark' ? 'true' : 'false'
      )
    })
}

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)

  let meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', THEME_COLORS[theme])

  syncThemeButtons(theme)
  window.dispatchEvent(
    new CustomEvent('ndic-theme-changed', { detail: { theme } })
  )
  // Charts and diagrams draw with fixed colours: redraw them
  for (let i = 1; i <= 13; i++) {
    try {
      const c = window['Canvas' + i]
      if (c && typeof c.render === 'function') c.render()
    } catch (e) { /* canvas not ready */ }
  }
}

const setTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    // storage unavailable: choice applies to this page only
  }
  applyTheme(theme)
}

const toggleTheme = () => {
  setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark')
}

const ensureThemeButton = () => {
  if (document.getElementById('theme-toggle-btn')) return
  const inner = document.querySelector('.ndic-site-header-inner')
  if (!inner) return

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'theme-toggle-btn'
  btn.id = 'theme-toggle-btn'
  btn.innerHTML =
    '<svg class="icon-sun" width="16" height="16" fill="none" ' +
    'stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<path stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 ' +
    '1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 ' +
    '6.34l1.41-1.41"/></svg>' +
    '<svg class="icon-moon" width="16" height="16" fill="none" ' +
    'stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path stroke-linecap="round" stroke-linejoin="round" ' +
    'd="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
  inner.insertBefore(btn, inner.querySelector('#master-nav-dock'))
}

const initThemeToggle = () => {
  // Make sure the attribute exists even if the head script was missing
  if (!document.documentElement.hasAttribute('data-theme')) {
    applyTheme(getSavedTheme() || getSystemTheme())
  } else {
    syncThemeButtons(getCurrentTheme())
  }

  ensureThemeButton()
  syncThemeButtons(getCurrentTheme())

  document.querySelectorAll('.theme-toggle-btn')
    .forEach(btn => btn.addEventListener('click', toggleTheme))

  // Follow the system setting until the visitor picks a theme
  if (THEME_SYSTEM_QUERY) {
    const onSystemChange = (e) => {
      if (!getSavedTheme()) applyTheme(e.matches ? 'dark' : 'light')
    }
    if (THEME_SYSTEM_QUERY.addEventListener) {
      THEME_SYSTEM_QUERY.addEventListener('change', onSystemChange)
    } else if (THEME_SYSTEM_QUERY.addListener) {
      THEME_SYSTEM_QUERY.addListener(onSystemChange)
    }
  }
}

// ─────────────────────────────────────────
// RUN ON DOM READY
// ─────────────────────────────────────────

const runRootConfig = () => {
  injectDynamicYears()
  injectSeasonalBanner()
  injectCTARotation()
  injectFreshnessBadge()
  initScrollProgressBar()
  initThemeToggle()
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    runRootConfig
  )
} else {
  runRootConfig()
}
