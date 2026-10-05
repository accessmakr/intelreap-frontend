// ─────────────────────────────────────────
// INTELREAP i18n ENGINE
// Complete internationalisation system
// 25 languages — RTL support
// Dynamic language switching
// No page reload required
// ─────────────────────────────────────────

const I18nEngine = (() => {

  // ─────────────────────────────────────
  // SUPPORTED LANGUAGES
  // ─────────────────────────────────────

  const SUPPORTED_LANGUAGES = {
    en: { name: 'English',            dir: 'ltr', noto: false },
    zh: { name: '中文',                dir: 'ltr', noto: true,  notoFont: 'Noto+Sans+SC' },
    hi: { name: 'हिंदी',              dir: 'ltr', noto: true,  notoFont: 'Noto+Sans+Devanagari' },
    es: { name: 'Español',            dir: 'ltr', noto: false },
    ar: { name: 'العربية',            dir: 'rtl', noto: true,  notoFont: 'Noto+Sans+Arabic' },
    bn: { name: 'বাংলা',              dir: 'ltr', noto: true,  notoFont: 'Noto+Sans+Bengali' },
    pt: { name: 'Português',          dir: 'ltr', noto: false },
    ru: { name: 'Русский',            dir: 'ltr', noto: true,  notoFont: 'Noto+Sans' },
    id: { name: 'Bahasa Indonesia',   dir: 'ltr', noto: false },
    ur: { name: 'اردو',               dir: 'rtl', noto: true,  notoFont: 'Noto+Nastaliq+Urdu' },
    fr: { name: 'Français',           dir: 'ltr', noto: false },
    de: { name: 'Deutsch',            dir: 'ltr', noto: false },
    ja: { name: '日本語',              dir: 'ltr', noto: true,  notoFont: 'Noto+Sans+JP' },
    tr: { name: 'Türkçe',             dir: 'ltr', noto: false },
    ko: { name: '한국어',              dir: 'ltr', noto: true,  notoFont: 'Noto+Sans+KR' },
    vi: { name: 'Tiếng Việt',         dir: 'ltr', noto: false },
    fa: { name: 'فارسی',              dir: 'rtl', noto: true,  notoFont: 'Noto+Sans+Arabic' },
    it: { name: 'Italiano',           dir: 'ltr', noto: false },
    th: { name: 'ภาษาไทย',           dir: 'ltr', noto: true,  notoFont: 'Noto+Sans+Thai' },
    sw: { name: 'Kiswahili',          dir: 'ltr', noto: false },
    ha: { name: 'Hausa',              dir: 'ltr', noto: false },
    yo: { name: 'Yorùbá',             dir: 'ltr', noto: false },
    pl: { name: 'Polski',             dir: 'ltr', noto: false },
    nl: { name: 'Nederlands',         dir: 'ltr', noto: false }
  }

  const RTL_LANGUAGES = ['ar', 'ur', 'fa']

  // ─────────────────────────────────────
  // INTERNAL STATE
  // ─────────────────────────────────────

  let currentLang = 'en'
  let currentTranslations = {}
  let fallbackTranslations = {}
  let isInitialized = false
  let loadedFonts = new Set()

  // ─────────────────────────────────────
  // LANGUAGE DETECTION
  // Priority: localStorage > URL param
  // > browser language > English
  // ─────────────────────────────────────

  const detectLanguage = () => {
    // 1. URL param ?lang=ar
    const urlParams = new URLSearchParams(
      window.location.search
    )
    const urlLang = urlParams.get('lang')
    if (urlLang && SUPPORTED_LANGUAGES[urlLang]) {
      return urlLang
    }

    // 2. localStorage saved preference
    const savedLang = localStorage.getItem(
      'ndic_lang'
    )
    if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
      return savedLang
    }

    // 3. Browser language
    const browserLangs = [
      navigator.language,
      ...(navigator.languages || [])
    ]

    for (const lang of browserLangs) {
      // Full match: en-US
      if (SUPPORTED_LANGUAGES[lang]) {
        return lang
      }
      // Short match: en
      const short = lang?.split('-')[0]
      if (short && SUPPORTED_LANGUAGES[short]) {
        return short
      }
    }

    return 'en'
  }

  // ─────────────────────────────────────
  // LOAD TRANSLATION FILE
  // Dynamic script loading per language
  // ─────────────────────────────────────

  const loadTranslations = (langCode) => {
    return new Promise((resolve, reject) => {
      // Check if already loaded in window
      const varName = `NDIC_TRANSLATIONS_${langCode.toUpperCase()}`
      if (window[varName]) {
        resolve(window[varName])
        return
      }

      // Determine base path
      const path = window.location.pathname
      const parts = path.split('/').filter(Boolean)
      const depth = path.endsWith('/')
        ? parts.length
        : parts.length - 1
      const base = depth <= 0 ? './' : '../'.repeat(depth)

      const script = document.createElement('script')
      script.src = `${base}assets/js/i18n/translations/${langCode}.js`
      script.async = true

      script.onload = () => {
        if (window[varName]) {
          resolve(window[varName])
        } else {
          reject(
            new Error(
              `Translation var ${varName} not found`
            )
          )
        }
      }

      script.onerror = () => {
        reject(
          new Error(
            `Failed to load translation: ${langCode}`
          )
        )
      }

      document.head.appendChild(script)
    })
  }

  // ─────────────────────────────────────
  // LOAD NON-LATIN FONT
  // Only loaded when needed
  // ─────────────────────────────────────

  const loadNotoFont = (langCode) => {
    const langConfig = SUPPORTED_LANGUAGES[langCode]
    if (!langConfig?.noto || !langConfig.notoFont) {
      return
    }

    const fontKey = langConfig.notoFont
    if (loadedFonts.has(fontKey)) return

    const existing = document.getElementById(
      `ndic-font-${langCode}`
    )
    if (existing) {
      loadedFonts.add(fontKey)
      return
    }

    const link = document.createElement('link')
    link.id = `ndic-font-${langCode}`
    link.rel = 'stylesheet'
    link.href =
      `https://fonts.googleapis.com/css2?` +
      `family=${fontKey}:wght@400;500;600;700&` +
      `display=swap`

    link.onload = () => {
      loadedFonts.add(fontKey)
    }

    document.head.appendChild(link)
  }

  // ─────────────────────────────────────
  // APPLY LANGUAGE TO DOCUMENT
  // Sets dir, lang, RTL stylesheet
  // ─────────────────────────────────────

  const applyLanguageToDocument = (langCode) => {
    const langConfig = SUPPORTED_LANGUAGES[langCode]
    if (!langConfig) return

    const html = document.documentElement

    // Set lang attribute
    html.setAttribute('lang', langCode)

    // Set dir attribute
    const dir = langConfig.dir || 'ltr'
    html.setAttribute('dir', dir)

    // Load RTL stylesheet if needed
    if (dir === 'rtl') {
      loadRTLStylesheet()
    } else {
      unloadRTLStylesheet()
    }

    // Load non-Latin font if needed
    loadNotoFont(langCode)

    // Update document title if translation exists
    const pageTitle = t('meta.title')
    if (pageTitle && pageTitle !== 'meta.title') {
      // Only update if translation found
    }
  }

  // ─────────────────────────────────────
  // RTL STYLESHEET MANAGEMENT
  // ─────────────────────────────────────

  const loadRTLStylesheet = () => {
    if (document.getElementById('ndic-rtl-css')) {
      return
    }

    const path = window.location.pathname
    const parts = path.split('/').filter(Boolean)
    const depth = path.endsWith('/')
      ? parts.length
      : parts.length - 1
    const base = depth <= 0 ? './' : '../'.repeat(depth)

    const link = document.createElement('link')
    link.id = 'ndic-rtl-css'
    link.rel = 'stylesheet'
    link.href = `${base}assets/css/ndic-rtl.css`
    document.head.appendChild(link)
  }

  const unloadRTLStylesheet = () => {
    const rtlLink = document.getElementById(
      'ndic-rtl-css'
    )
    if (rtlLink) rtlLink.remove()
  }

  // ─────────────────────────────────────
  // TRANSLATION FUNCTION
  // Primary interface for all translations
  // t('canvas1.heading_technical')
  // t('nav.intelligence_center')
  // ─────────────────────────────────────

  const t = (key, fallback = null) => {
    if (!key) return fallback || ''

    // Dot notation key resolution
    const resolve = (obj, keyPath) => {
      if (!obj) return null
      const parts = keyPath.split('.')
      let current = obj
      for (const part of parts) {
        if (
          current === null ||
          current === undefined ||
          typeof current !== 'object'
        ) {
          return null
        }
        current = current[part]
      }
      return current !== undefined ? current : null
    }

    // Try current language first
    const translated = resolve(
      currentTranslations,
      key
    )
    if (translated !== null) {
      return String(translated)
    }

    // Fall back to English
    const english = resolve(
      fallbackTranslations,
      key
    )
    if (english !== null) {
      return String(english)
    }

    // Return fallback or key itself
    return fallback !== null ? fallback : key
  }

  // Alias for template literals
  const __ = t

  // ─────────────────────────────────────
  // RENDER TRANSLATIONS TO DOM
  // Updates all [data-i18n] elements
  // ─────────────────────────────────────

  const renderToDOM = () => {
    // Text content translations
    document.querySelectorAll('[data-i18n]')
      .forEach(el => {
        const key = el.getAttribute('data-i18n')
        const translated = t(key)
        if (translated && translated !== key) {
          el.textContent = translated
        }
      })

    // Placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]')
      .forEach(el => {
        const key = el.getAttribute(
          'data-i18n-placeholder'
        )
        const translated = t(key)
        if (translated && translated !== key) {
          el.placeholder = translated
        }
      })

    // Aria-label translations
    document.querySelectorAll('[data-i18n-aria]')
      .forEach(el => {
        const key = el.getAttribute('data-i18n-aria')
        const translated = t(key)
        if (translated && translated !== key) {
          el.setAttribute('aria-label', translated)
        }
      })

    // Title attribute translations
    document.querySelectorAll('[data-i18n-title]')
      .forEach(el => {
        const key = el.getAttribute('data-i18n-title')
        const translated = t(key)
        if (translated && translated !== key) {
          el.title = translated
        }
      })

    // HTML content translations (safe subset)
    document.querySelectorAll('[data-i18n-html]')
      .forEach(el => {
        const key = el.getAttribute('data-i18n-html')
        const translated = t(key)
        if (translated && translated !== key) {
          el.innerHTML = translated
        }
      })
  }

  // ─────────────────────────────────────
  // RE-RENDER CANVAS LABELS
  // Called after language switch to update
  // all canvas parameter labels
  // ─────────────────────────────────────

  const rerenderCanvasLabels = () => {
    // All canvas renderers re-render
    // with translated labels
    const canvasRenderers = [
      'Canvas1', 'Canvas2', 'Canvas3',
      'Canvas4', 'Canvas5', 'Canvas6',
      'Canvas7', 'Canvas8', 'Canvas9',
      'Canvas10', 'Canvas11', 'Canvas12'
    ]

    canvasRenderers.forEach(name => {
      const renderer = window[name]
      if (renderer?.render) {
        try {
          renderer.render()
        } catch {
          // Continue if canvas not ready
        }
      }
    })

    // Re-render DOM i18n elements
    renderToDOM()

    // Update AI summaries for new language
    if (typeof AISummaryEngine !== 'undefined') {
      AISummaryEngine.requestAllCanvasSummaries()
        .catch(() => {})
    }
  }

  // ─────────────────────────────────────
  // SWITCH LANGUAGE
  // Primary public method
  // Called by menu-system.js
  // ─────────────────────────────────────

  const switchLanguage = async (langCode) => {
    if (!SUPPORTED_LANGUAGES[langCode]) {
      console.warn(
        `[i18n] Unsupported language: ${langCode}`
      )
      return
    }

    if (langCode === currentLang) return

    try {
      // Load the new translations
      const translations =
        await loadTranslations(langCode)

      currentLang = langCode
      currentTranslations = translations

      // Save preference
      localStorage.setItem('ndic_lang', langCode)

      // Apply to document
      applyLanguageToDocument(langCode)

      // Update all DOM elements
      rerenderCanvasLabels()

      console.log(`[i18n] Switched to: ${langCode}`)

      // Dispatch event for other systems
      window.dispatchEvent(
        new CustomEvent('ndic-language-changed', {
          detail: {
            language: langCode,
            dir: SUPPORTED_LANGUAGES[langCode].dir
          }
        })
      )

    } catch (error) {
      console.error(
        `[i18n] Failed to switch to ${langCode}:`,
        error
      )
    }
  }

  // ─────────────────────────────────────
  // GET LANGUAGE DIRECTION
  // ─────────────────────────────────────

  const getDir = (langCode) => {
    return SUPPORTED_LANGUAGES[langCode]?.dir ||
      'ltr'
  }

  const isRTL = () => {
    return getDir(currentLang) === 'rtl'
  }

  // ─────────────────────────────────────
  // GET CURRENT LANGUAGE
  // ─────────────────────────────────────

  const getLang = () => currentLang

  const getLangConfig = () => {
    return SUPPORTED_LANGUAGES[currentLang]
  }

  // ─────────────────────────────────────
  // PLURAL HELPER
  // Simple English-first pluralisation
  // ─────────────────────────────────────

  const plural = (count, singular, pluralStr) => {
    if (count === 1) return `${count} ${singular}`
    return `${count} ${pluralStr || singular + 's'}`
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = async () => {
    if (isInitialized) return

    currentLang = detectLanguage()

    try {
      // Always load English as fallback first
      fallbackTranslations =
        await loadTranslations('en')

      // Load current language
      if (currentLang !== 'en') {
        try {
          currentTranslations =
            await loadTranslations(currentLang)
        } catch {
          // Fall back to English
          currentLang = 'en'
          currentTranslations = fallbackTranslations
        }
      } else {
        currentTranslations = fallbackTranslations
      }

      // Apply language to document
      applyLanguageToDocument(currentLang)

      // Render translations to DOM
      renderToDOM()

      isInitialized = true
      window.dispatchEvent(
        new CustomEvent('ndic-i18n-ready', {
          detail: { language: currentLang }
        })
      )

      console.log(
        `[i18n] Initialized: ${currentLang}`
      )

    } catch (error) {
      console.error(
        '[i18n] Initialization failed:',
        error
      )
      // Ensure English always works
      currentLang = 'en'
      currentTranslations = {}
      fallbackTranslations = {}
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    )
  } else {
    init()
  }

  // ─────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────

  return {
    t,
    __,
    init,
    switchLanguage,
    getLang,
    getLangConfig,
    getDir,
    isRTL,
    plural,
    renderToDOM,
    SUPPORTED_LANGUAGES
  }

})()

// Global shorthand
const t = (key, fallback) =>
  I18nEngine.t(key, fallback)
