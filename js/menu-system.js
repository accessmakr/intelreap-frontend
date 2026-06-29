// ─────────────────────────────────────────
// INTELREAP MENU SYSTEM — FIXED & HARDENED
// Robust against missing registry/config and path issues
// ─────────────────────────────────────────

const MenuSystem = (() => {

  // ─────────────────────────────────────
  // BUILD DESKTOP NAV (with fallback)
  // ─────────────────────────────────────
  const buildDesktopNav = (navPages = [], currentPage, basePath = './') => {
    const nav = document.createElement('nav');
    nav.className = 'ndic-nav-desktop';
    nav.setAttribute('aria-label', 'Main navigation');

    if (navPages.length === 0) {
      // Fallback links if registry fails
      const fallbackLinks = [
        { url: '/index.html', label: 'Intelligence Center' },
        { url: '/learn/does-a-vpn-change-your-mac-address.html', label: 'VPN Guide' }
      ];
      fallbackLinks.forEach(item => {
        const a = document.createElement('a');
        a.href = basePath === './' ? item.url : item.url;
        a.textContent = item.label;
        nav.appendChild(a);
      });
      return nav;
    }

    navPages.forEach(page => {
      const isActive = currentPage?.id === page.id;

      const link = document.createElement('a');
      link.href = basePath + page.url.replace(/^\//, '');
      link.textContent = page.navLabel || page.shortTitle || 'Page';
      
      link.className = isActive 
        ? 'ndic-nav-link ndic-nav-link--active' 
        : 'ndic-nav-link';

      if (isActive) link.setAttribute('aria-current', 'page');
      nav.appendChild(link);
    });

    return nav;
  };

  // ─────────────────────────────────────
  // BUILD MOBILE TOGGLE
  // ─────────────────────────────────────
  const buildMobileToggle = () => {
    const toggle = document.createElement('button');
    toggle.className = 'ndic-mobile-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = `
      <span class="ndic-hamburger">
        <span></span><span></span><span></span>
      </span>
    `;
    return toggle;
  };

  // ─────────────────────────────────────
  // BUILD MOBILE DRAWER
  // ─────────────────────────────────────
  const buildMobileDrawer = (navPages = [], currentPage, basePath = './') => {
    const drawer = document.createElement('div');
    drawer.className = 'ndic-mobile-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.id = 'ndic-mobile-drawer';

    const inner = document.createElement('div');
    inner.className = 'ndic-mobile-drawer-inner';

    // Logo
    const logo = document.createElement('div');
    logo.className = 'ndic-drawer-logo';
    logo.innerHTML = `<span class="ndic-drawer-site-name">INTEL<span>REAP</span></span>`;
    inner.appendChild(logo);

    // Nav links
    const drawerNav = document.createElement('nav');
    drawerNav.setAttribute('aria-label', 'Mobile navigation');

    const pagesToUse = navPages.length > 0 ? navPages : [
      { url: '/index.html', navLabel: 'Intelligence Center' },
      { url: '/learn/does-a-vpn-change-your-mac-address.html', navLabel: 'VPN Guide' }
    ];

    pagesToUse.forEach(page => {
      const isActive = currentPage?.id === page.id;
      const link = document.createElement('a');
      link.href = basePath + page.url.replace(/^\//, '');
      link.textContent = page.navLabel || page.shortTitle || 'Page';
      link.className = isActive 
        ? 'ndic-mobile-nav-link ndic-mobile-nav-link--active' 
        : 'ndic-mobile-nav-link';
      drawerNav.appendChild(link);
    });

    inner.appendChild(drawerNav);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ndic-drawer-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.textContent = '✕';
    inner.appendChild(closeBtn);

    drawer.appendChild(inner);
    return { drawer, closeBtn };
  };

  // ─────────────────────────────────────
  // TOGGLE DRAWER
  // ─────────────────────────────────────
  const toggleDrawer = (drawer, toggle, open) => {
    if (open) {
      drawer.classList.add('ndic-drawer--open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('ndic-toggle--active');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('ndic-drawer--open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('ndic-toggle--active');
      document.body.style.overflow = '';
    }
  };

  // ─────────────────────────────────────
  // LANGUAGE SWITCHER (kept simple)
  // ─────────────────────────────────────
  const buildLanguageSwitcher = () => {
    const switcher = document.createElement('div');
    switcher.className = 'ndic-lang-switcher';
    switcher.innerHTML = `<button class="ndic-lang-trigger">EN</button>`;
    return switcher;
  };

  // ─────────────────────────────────────
  // MAIN INIT — HARDENED
  // ─────────────────────────────────────
  const init = () => {
    const dock = document.getElementById('master-nav-dock');
    if (!dock) {
      console.error('MenuSystem: #master-nav-dock element not found');
      return;
    }

    let navPages = [];
    let currentPage = null;
    let basePath = './';

    // Safe access to registry and config
    try {
      if (typeof INTELREAP_REGISTRY !== 'undefined') {
        navPages = INTELREAP_REGISTRY.getNavPages?.() || [];
        currentPage = INTELREAP_REGISTRY.getCurrentPage?.();
      }
      if (typeof INTELREAP_CONFIG !== 'undefined') {
        basePath = INTELREAP_CONFIG.getBasePath?.() || './';
      }
    } catch (e) {
      console.warn('MenuSystem: Error accessing registry/config', e);
    }

    console.log(`MenuSystem: ${navPages.length} nav pages loaded`);

    // Build components
    const desktopNav = buildDesktopNav(navPages, currentPage, basePath);
    const langSwitcher = buildLanguageSwitcher();
    const mobileToggle = buildMobileToggle();
    const { drawer, closeBtn } = buildMobileDrawer(navPages, currentPage, basePath);

    // Append everything
    dock.appendChild(desktopNav);
    dock.appendChild(langSwitcher);
    dock.appendChild(mobileToggle);
    document.body.appendChild(drawer);

    // Mobile toggle logic
    let drawerOpen = false;

    mobileToggle.addEventListener('click', () => {
      drawerOpen = !drawerOpen;
      toggleDrawer(drawer, mobileToggle, drawerOpen);
    });

    closeBtn.addEventListener('click', () => {
      drawerOpen = false;
      toggleDrawer(drawer, mobileToggle, false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawerOpen) {
        drawerOpen = false;
        toggleDrawer(drawer, mobileToggle, false);
      }
    });

    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawerOpen = false;
        toggleDrawer(drawer, mobileToggle, false);
      }
    });

    console.log('%c✅ MenuSystem initialized successfully', 'color: lime; font-weight: bold');
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
