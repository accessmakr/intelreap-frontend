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
  banner.style.color = season.color
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
// THEME TOGGLE
// Light is the default theme. Dark is an
// opt-in choice persisted to localStorage.
// The <head> inline script already applies
// the saved theme before paint to avoid a
// flash — this just wires up the button and
// keeps it in sync with the current state.
// ─────────────────────────────────────────

const getCurrentTheme = () => {
  return document.documentElement
    .getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light'
}

const setTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute(
      'data-theme',
      'dark'
    )
  } else {
    document.documentElement.removeAttribute(
      'data-theme'
    )
  }
  localStorage.setItem('ndic_theme', theme)
}

const toggleTheme = () => {
  const next = getCurrentTheme() === 'dark'
    ? 'light'
    : 'dark'
  setTheme(next)
}

const initThemeToggle = () => {
  const btn = document.getElementById(
    'theme-toggle-btn'
  )
  if (!btn) return

  btn.addEventListener('click', toggleTheme)

  btn.setAttribute(
    'aria-label',
    getCurrentTheme() === 'dark'
      ? 'Switch to light theme'
      : 'Switch to dark theme'
  )

  btn.addEventListener('click', () => {
    btn.setAttribute(
      'aria-label',
      getCurrentTheme() === 'dark'
        ? 'Switch to light theme'
        : 'Switch to dark theme'
    )
  })
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
