// ─────────────────────────────────────────
// INTELREAP MENU SYSTEM
// Populates master-nav-dock dynamically
// Handles desktop and mobile navigation
// ─────────────────────────────────────────

const MenuSystem = (() => {

  // ─────────────────────────────────────
  // BUILD DESKTOP NAV
  // ─────────────────────────────────────

  const buildDesktopNav = (
    navPages,
    currentPage,
    basePath
  ) => {
    const nav = document.createElement('nav')
    nav.className = 'ndic-nav-desktop'
    nav.setAttribute('aria-label', 'Main navigation')

    navPages.forEach(page => {
      const isActive =
        currentPage?.id === page.id

      const link = document.createElement('a')
      link.href = basePath + page.url.replace(/^\//, '')
      link.textContent = page.navLabel || page.shortTitle
      if (page.navKey) link.setAttribute('data-i18n', page.navKey)
      link.className = isActive
        ? 'ndic-nav-link ndic-nav-link--active'
        : 'ndic-nav-link'

      if (isActive) {
        link.setAttribute('aria-current', 'page')
      }

      nav.appendChild(link)
    })

    return nav
  }

  // ─────────────────────────────────────
  // BUILD MOBILE HAMBURGER
  // ─────────────────────────────────────

  const buildMobileToggle = () => {
    const toggle = document.createElement('button')
    toggle.className = 'ndic-mobile-toggle'
    toggle.setAttribute('aria-label', 'Toggle menu')
    toggle.setAttribute('data-i18n-aria', 'nav.toggle_menu')
    toggle.setAttribute('aria-expanded', 'false')
    toggle.innerHTML = `
      <span class="ndic-hamburger">
        <span></span>
        <span></span>
        <span></span>
      </span>
    `
    return toggle
  }

  // ─────────────────────────────────────
  // BUILD MOBILE DRAWER
  // ─────────────────────────────────────

  const buildMobileDrawer = (
    navPages,
    currentPage,
    basePath
  ) => {
    const drawer = document.createElement('div')
    drawer.className = 'ndic-mobile-drawer'
    drawer.setAttribute('aria-hidden', 'true')
    drawer.id = 'ndic-mobile-drawer'

    const inner = document.createElement('div')
    inner.className = 'ndic-mobile-drawer-inner'

    // Logo in drawer
    const drawerLogo = document.createElement('div')
    drawerLogo.className = 'ndic-drawer-logo'
    drawerLogo.innerHTML = `
      <span class="ndic-drawer-site-name">
        INTEL<span>REAP</span>
      </span>
    `
    inner.appendChild(drawerLogo)

    // Nav links
    const drawerNav = document.createElement('nav')
    drawerNav.setAttribute(
      'aria-label',
      'Mobile navigation'
    )

    navPages.forEach(page => {
      const isActive =
        currentPage?.id === page.id

      const link = document.createElement('a')
      link.href = basePath +
        page.url.replace(/^\//, '')
      link.textContent =
        page.navLabel || page.shortTitle
      if (page.navKey) link.setAttribute('data-i18n', page.navKey)
      link.className = isActive
        ? 'ndic-mobile-nav-link ndic-mobile-nav-link--active'
        : 'ndic-mobile-nav-link'

      drawerNav.appendChild(link)
    })

    inner.appendChild(drawerNav)

    // Close button
    const closeBtn = document.createElement('button')
    closeBtn.className = 'ndic-drawer-close'
    closeBtn.setAttribute('aria-label', 'Close menu')
    closeBtn.setAttribute('data-i18n-aria', 'nav.close_menu')
    closeBtn.textContent = '✕'
    inner.appendChild(closeBtn)

    drawer.appendChild(inner)
    return { drawer, closeBtn }
  }

  // ─────────────────────────────────────
  // TOGGLE MOBILE DRAWER
  // ─────────────────────────────────────

  const toggleDrawer = (
    drawer,
    toggle,
    open
  ) => {
    if (open) {
      drawer.classList.add('ndic-drawer--open')
      drawer.setAttribute('aria-hidden', 'false')
      toggle.setAttribute('aria-expanded', 'true')
      toggle.classList.add('ndic-toggle--active')
      document.body.style.overflow = 'hidden'
    } else {
      drawer.classList.remove('ndic-drawer--open')
      drawer.setAttribute('aria-hidden', 'true')
      toggle.setAttribute('aria-expanded', 'false')
      toggle.classList.remove('ndic-toggle--active')
      document.body.style.overflow = ''
    }
  }

  // ─────────────────────────────────────
  // LANGUAGE SWITCHER
  // ─────────────────────────────────────

  const buildLanguageSwitcher = () => {
    const switcher = document.createElement('div')
    switcher.className = 'ndic-lang-switcher'
    switcher.id = 'ndic-lang-switcher'

    const currentLang = localStorage.getItem(
      'ndic_lang'
    ) || navigator.language?.split('-')[0] || 'en'

    const langLabels = {
      en: 'EN', zh: 'ZH', hi: 'HI',
      es: 'ES', ar: 'AR', bn: 'BN',
      pt: 'PT', ru: 'RU', id: 'ID',
      ur: 'UR', fr: 'FR', de: 'DE',
      ja: 'JA', tr: 'TR', ko: 'KO',
      vi: 'VI', fa: 'FA', it: 'IT',
      th: 'TH', sw: 'SW', ha: 'HA',
      yo: 'YO', pl: 'PL', nl: 'NL'
    }

    const trigger = document.createElement('button')
    trigger.className = 'ndic-lang-trigger'
    trigger.setAttribute(
      'aria-label',
      'Switch language'
    )
    trigger.setAttribute('data-i18n-aria', 'nav.switch_language')
    trigger.textContent =
      (langLabels[currentLang] || 'EN').toUpperCase()

    const dropdown = document.createElement('div')
    dropdown.className = 'ndic-lang-dropdown'
    dropdown.setAttribute('aria-hidden', 'true')

    const languages = [
      { code: 'en', label: 'English' },
      { code: 'zh', label: '中文' },
      { code: 'hi', label: 'हिंदी' },
      { code: 'es', label: 'Español' },
      { code: 'ar', label: 'العربية' },
      { code: 'bn', label: 'বাংলা' },
      { code: 'pt', label: 'Português' },
      { code: 'ru', label: 'Русский' },
      { code: 'id', label: 'Bahasa Indonesia' },
      { code: 'ur', label: 'اردو' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
      { code: 'ja', label: '日本語' },
      { code: 'tr', label: 'Türkçe' },
      { code: 'ko', label: '한국어' },
      { code: 'vi', label: 'Tiếng Việt' },
      { code: 'fa', label: 'فارسی' },
      { code: 'it', label: 'Italiano' },
      { code: 'th', label: 'ภาษาไทย' },
      { code: 'sw', label: 'Kiswahili' },
      { code: 'ha', label: 'Hausa' },
      { code: 'yo', label: 'Yorùbá' },
      { code: 'pl', label: 'Polski' },
      { code: 'nl', label: 'Nederlands' }
    ]

    languages.forEach(lang => {
      const option =
        document.createElement('button')
      option.className = 'ndic-lang-option'
      option.setAttribute('data-lang', lang.code)
      option.textContent = lang.label

      if (lang.code === currentLang) {
        option.classList.add(
          'ndic-lang-option--active'
        )
      }

      option.addEventListener('click', () => {
        localStorage.setItem(
          'ndic_lang',
          lang.code
        )
        trigger.textContent =
          (langLabels[lang.code] || 'EN')
            .toUpperCase()

        // Update active state
        dropdown
          .querySelectorAll('.ndic-lang-option')
          .forEach(o => o.classList.remove(
            'ndic-lang-option--active'
          ))
        option.classList.add(
          'ndic-lang-option--active'
        )

        dropdown.classList.remove(
          'ndic-lang-dropdown--open'
        )

        // Trigger i18n reload
        if (
          typeof I18nEngine !== 'undefined'
        ) {
          I18nEngine.switchLanguage(lang.code)
        }
      })

      dropdown.appendChild(option)
    })

    // Toggle dropdown
    trigger.addEventListener('click', () => {
      const isOpen = dropdown.classList.contains(
        'ndic-lang-dropdown--open'
      )
      dropdown.classList.toggle(
        'ndic-lang-dropdown--open'
      )
      dropdown.setAttribute(
        'aria-hidden',
        String(isOpen)
      )
    })

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        dropdown.classList.remove(
          'ndic-lang-dropdown--open'
        )
        dropdown.setAttribute('aria-hidden', 'true')
      }
    })

    switcher.appendChild(trigger)
    switcher.appendChild(dropdown)
    return switcher
  }

  // ─────────────────────────────────────
  // MAIN INIT
  // ─────────────────────────────────────

  const init = () => {
    const dock = document.getElementById(
      'master-nav-dock'
    )
    if (!dock) return

    if (
      typeof INTELREAP_REGISTRY === 'undefined' ||
      typeof INTELREAP_CONFIG === 'undefined'
    ) {
      console.warn(
        'MenuSystem: registry or config not loaded'
      )
      return
    }

    const navPages = INTELREAP_REGISTRY
      .getNavPages()
    const currentPage = INTELREAP_REGISTRY
      .getCurrentPage()
    const basePath = INTELREAP_CONFIG
      .getBasePath()

    // Build desktop nav
    const desktopNav = buildDesktopNav(
      navPages,
      currentPage,
      basePath
    )

    // Build language switcher
    const langSwitcher = buildLanguageSwitcher()

    // Build mobile toggle
    const mobileToggle = buildMobileToggle()

    // Build mobile drawer
    const {
      drawer,
      closeBtn
    } = buildMobileDrawer(
      navPages,
      currentPage,
      basePath
    )

    // Append to dock
    dock.appendChild(desktopNav)
    dock.appendChild(langSwitcher)
    dock.appendChild(mobileToggle)

    // Append drawer to body
    document.body.appendChild(drawer)

    // Translate the freshly built menu if a language is active
    if (typeof I18nEngine !== 'undefined' && I18nEngine.renderToDOM) {
      I18nEngine.renderToDOM()
    }

    // Toggle events
    let drawerOpen = false

    mobileToggle.addEventListener('click', () => {
      drawerOpen = !drawerOpen
      toggleDrawer(drawer, mobileToggle, drawerOpen)
    })

    closeBtn.addEventListener('click', () => {
      drawerOpen = false
      toggleDrawer(drawer, mobileToggle, false)
    })

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawerOpen) {
        drawerOpen = false
        toggleDrawer(drawer, mobileToggle, false)
      }
    })

    // Close on backdrop click
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawerOpen = false
        toggleDrawer(drawer, mobileToggle, false)
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

  return { init }

})()
