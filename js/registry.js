// ─────────────────────────────────────────
// INTELREAP SITE REGISTRY
// Master registry of all pages
// Used by menu-system.js,
// search-system.js and
// internal-links.js
// ─────────────────────────────────────────

const INTELREAP_REGISTRY = {

  site: {
    name: 'IntelReap',
    tagline: 'Real-time network and device intelligence.',
    baseUrl: 'https://intelreap.com',
    logo: '/assets/images/icons/icon-512.png',
    twitter: 'https://twitter.com/intelreap',
    github: 'https://github.com/accessmakr/intelreap-frontend'
  },

  // ─────────────────────────────────────
  // ALL PAGES
  // ─────────────────────────────────────

  pages: [

    // ── MAIN TOOL PAGE ─────────────────
    {
      id: 'intelligence',
      title: 'Network and Device Intelligence Center',
      shortTitle: 'NDIC',
      description: 'Instantly reveal your network infrastructure, device fingerprint, security posture, and browser capabilities in real time. Free. No login.',
      url: '/index.html',
      canonical: 'https://intelreap.com',
      category: 'tool',
      priority: 1.0,
      keywords: [
        'network intelligence',
        'device intelligence',
        'IP address lookup',
        'ASN lookup',
        'browser fingerprint',
        'security scan',
        'WebRTC leak test',
        'VPN detection',
        'connection speed test'
      ],
      nav: true,
      navLabel: 'Intelligence Center',
      navOrder: 1,
      inFooter: true,
      inSitemap: true,
      schema: 'tool'
    },

    // ── DEEP DIVE PAGES ─────────────────

    {
      id: 'network-route',
      title: 'ASN and Network Route Intelligence',
      shortTitle: 'Network Route',
      description: 'Analyze your Autonomous System Number, network tier, BGP routing status, peering count, upstream provider and allocation registry in real time.',
      url: '/intelligence/network-route.html',
      canonical: 'https://intelreap.com/intelligence/network-route.html',
      category: 'deep-dive',
      priority: 0.9,
      keywords: [
        'ASN lookup',
        'autonomous system number',
        'BGP routing',
        'network tier',
        'peering analysis',
        'network infrastructure',
        'IP range',
        'upstream provider'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'network-identity',
      title: 'Network Identity and IP Geolocation',
      shortTitle: 'Network Identity',
      description: 'Discover your public IP address, ISP, geolocation coordinates, timezone, connection type and regional identity as seen by the internet.',
      url: '/intelligence/network-identity.html',
      canonical: 'https://intelreap.com/intelligence/network-identity.html',
      category: 'deep-dive',
      priority: 0.9,
      keywords: [
        'IP address lookup',
        'IP geolocation',
        'ISP detection',
        'public IP',
        'internet identity',
        'network location',
        'timezone detection'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'vpn-proxy',
      title: 'VPN, Proxy and Routing Intelligence',
      shortTitle: 'VPN and Proxy',
      description: 'Detect active VPNs, proxies, TOR exit nodes and datacenter routing. Analyze your trust score, fraud score and route classification instantly.',
      url: '/intelligence/vpn-proxy.html',
      canonical: 'https://intelreap.com/intelligence/vpn-proxy.html',
      category: 'deep-dive',
      priority: 0.9,
      keywords: [
        'VPN detection',
        'proxy detection',
        'TOR detection',
        'WebRTC leak',
        'anonymity test',
        'trust score',
        'fraud score',
        'routing intelligence'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'live-network',
      title: 'Live Network Monitor and Connection Speed',
      shortTitle: 'Live Network',
      description: 'Monitor your real-time connection latency, bandwidth, stability index, jitter and packet loss estimate. Live RTT history updated every three seconds.',
      url: '/intelligence/live-network.html',
      canonical: 'https://intelreap.com/intelligence/live-network.html',
      category: 'deep-dive',
      priority: 0.8,
      keywords: [
        'live network monitor',
        'connection speed test',
        'latency test',
        'RTT measurement',
        'bandwidth test',
        'network stability',
        'jitter test',
        'packet loss'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'device',
      title: 'Device Intelligence and Hardware Analysis',
      shortTitle: 'Device Intelligence',
      description: 'Identify your operating system, browser engine, device type, CPU cores, RAM, screen resolution, color gamut and device capability tier.',
      url: '/intelligence/device.html',
      canonical: 'https://intelreap.com/intelligence/device.html',
      category: 'deep-dive',
      priority: 0.8,
      keywords: [
        'device detection',
        'browser detection',
        'OS detection',
        'hardware fingerprint',
        'CPU cores',
        'device memory',
        'screen resolution',
        'device capability'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'graphics',
      title: 'Graphics Engine and GPU Capability Analysis',
      shortTitle: 'Graphics Engine',
      description: 'Detect your GPU vendor, WebGL version, shader precision, hardware acceleration status, extension count and graphics tier classification.',
      url: '/intelligence/graphics.html',
      canonical: 'https://intelreap.com/intelligence/graphics.html',
      category: 'deep-dive',
      priority: 0.8,
      keywords: [
        'GPU detection',
        'WebGL detection',
        'WebGPU support',
        'hardware acceleration',
        'graphics tier',
        'shader precision',
        'GPU vendor',
        'renderer info'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'security',
      title: 'Browser Security and Privacy Analysis',
      shortTitle: 'Security Analysis',
      description: 'Analyze your HTTPS status, WebRTC IP exposure, browser permissions, storage access, fingerprint surface and security score in real time.',
      url: '/intelligence/security.html',
      canonical: 'https://intelreap.com/intelligence/security.html',
      category: 'deep-dive',
      priority: 0.9,
      keywords: [
        'browser security test',
        'WebRTC leak test',
        'privacy analysis',
        'HTTPS test',
        'browser permissions',
        'fingerprint test',
        'security score',
        'privacy score'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'capability',
      title: 'Browser Capability Matrix and Feature Detection',
      shortTitle: 'Capability Matrix',
      description: 'Test 56 browser capabilities across AI and compute, communication, storage, rendering and system categories. See your capability score instantly.',
      url: '/intelligence/capability.html',
      canonical: 'https://intelreap.com/intelligence/capability.html',
      category: 'deep-dive',
      priority: 0.8,
      keywords: [
        'browser capabilities',
        'WebAssembly support',
        'WebGPU support',
        'WebRTC support',
        'service worker',
        'IndexedDB',
        'browser feature detection',
        'PWA capabilities'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'performance',
      title: 'Page Performance Intelligence and Load Analysis',
      shortTitle: 'Performance',
      description: 'Measure your page load time, TTFB, DNS lookup, TCP connection, DOM processing and resource analysis with Navigation Timing API Level 2.',
      url: '/intelligence/performance.html',
      canonical: 'https://intelreap.com/intelligence/performance.html',
      category: 'deep-dive',
      priority: 0.8,
      keywords: [
        'page performance test',
        'TTFB test',
        'page load time',
        'DNS lookup time',
        'TCP connection time',
        'performance percentile',
        'resource analysis',
        'cache hit rate'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'rendering-speed',
      title: 'Core Web Vitals and Rendering Speed Intelligence',
      shortTitle: 'Rendering Speed',
      description: 'Measure your Core Web Vitals including LCP, FCP, CLS, INP and TTFB. Browser benchmark scores for JS execution, DOM manipulation and canvas rendering.',
      url: '/intelligence/rendering-speed.html',
      canonical: 'https://intelreap.com/intelligence/rendering-speed.html',
      category: 'deep-dive',
      priority: 0.8,
      keywords: [
        'Core Web Vitals test',
        'LCP test',
        'FCP test',
        'CLS test',
        'INP test',
        'browser benchmark',
        'rendering speed',
        'JavaScript performance'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'scoreboard',
      title: 'Global Intelligence Score and Environment Report',
      shortTitle: 'Global Scoreboard',
      description: 'Your complete environment score across nine intelligence dimensions. Network, security, device, performance and speed scored and weighted globally.',
      url: '/intelligence/scoreboard.html',
      canonical: 'https://intelreap.com/intelligence/scoreboard.html',
      category: 'deep-dive',
      priority: 0.9,
      keywords: [
        'intelligence score',
        'network score',
        'security score',
        'device score',
        'performance score',
        'global score',
        'environment report',
        'digital footprint score'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    {
      id: 'live-feed',
      title: 'Live Intelligence Feed and System Events',
      shortTitle: 'Live Feed',
      description: 'Real-time system event log showing network changes, security flags, API calls, score updates and browser events as they happen.',
      url: '/intelligence/live-feed.html',
      canonical: 'https://intelreap.com/intelligence/live-feed.html',
      category: 'deep-dive',
      priority: 0.7,
      keywords: [
        'live network events',
        'real-time monitoring',
        'security events',
        'network change detection',
        'system log',
        'intelligence feed'
      ],
      nav: false,
      inFooter: false,
      inSitemap: true,
      parentId: 'intelligence',
      schema: 'article'
    },

    // ── LEGAL AND UTILITY PAGES ─────────

    {
      id: 'about',
      title: 'About IntelReap',
      shortTitle: 'About',
      description: 'IntelReap provides free, real-time network and device intelligence. No login. No data stored. Everything runs in your browser.',
      url: '/about.html',
      canonical: 'https://intelreap.com/about.html',
      category: 'utility',
      priority: 0.6,
      keywords: ['about IntelReap', 'network intelligence tool'],
      nav: true,
      navLabel: 'About',
      navOrder: 2,
      inFooter: true,
      inSitemap: true,
      schema: 'article'
    },

    {
      id: 'contact',
      title: 'Contact IntelReap',
      shortTitle: 'Contact',
      description: 'Get in touch with the IntelReap team.',
      url: '/contact.html',
      canonical: 'https://intelreap.com/contact.html',
      category: 'utility',
      priority: 0.5,
      keywords: ['contact IntelReap'],
      nav: false,
      inFooter: true,
      inSitemap: true,
      schema: 'contact'
    },

    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      shortTitle: 'Privacy Policy',
      description: 'IntelReap privacy policy. No data stored. No tracking.',
      url: '/privacy-policy.html',
      canonical: 'https://intelreap.com/privacy-policy.html',
      category: 'legal',
      priority: 0.3,
      keywords: ['IntelReap privacy policy'],
      nav: false,
      inFooter: true,
      inSitemap: true,
      schema: 'article'
    },

    {
      id: 'cookies-policy',
      title: 'Cookies Policy',
      shortTitle: 'Cookies Policy',
      description: 'IntelReap cookies policy.',
      url: '/cookies-policy.html',
      canonical: 'https://intelreap.com/cookies-policy.html',
      category: 'legal',
      priority: 0.3,
      keywords: ['IntelReap cookies policy'],
      nav: false,
      inFooter: true,
      inSitemap: true,
      schema: 'article'
    },

    {
      id: 'terms-of-use',
      title: 'Terms of Use',
      shortTitle: 'Terms of Use',
      description: 'IntelReap terms of use.',
      url: '/terms-of-use.html',
      canonical: 'https://intelreap.com/terms-of-use.html',
      category: 'legal',
      priority: 0.3,
      keywords: ['IntelReap terms of use'],
      nav: false,
      inFooter: true,
      inSitemap: true,
      schema: 'article'
    }

  ],

  // ─────────────────────────────────────
  // HELPER METHODS
  // ─────────────────────────────────────

  getPageById(id) {
    return this.pages.find(p => p.id === id)
  },

  getPageByUrl(url) {
    return this.pages.find(p =>
      p.url === url ||
      url.endsWith(p.url.replace(/^\//, ''))
    )
  },

  getNavPages() {
    return this.pages
      .filter(p => p.nav)
      .sort((a, b) =>
        (a.navOrder || 99) - (b.navOrder || 99)
      )
  },

  getFooterPages() {
    return this.pages.filter(p => p.inFooter)
  },

  getLegalPages() {
    return this.pages.filter(
      p => p.category === 'legal'
    )
  },

  getDeepDivePages() {
    return this.pages.filter(
      p => p.category === 'deep-dive'
    )
  },

  getCurrentPage() {
    const path = window.location.pathname
    return this.pages.find(p => {
      const pagePath = p.url.replace(/^\//, '')
      const currentPath = path.replace(/^\//, '')
      return currentPath === pagePath ||
        currentPath === pagePath.replace(
          '.html', ''
        )
    }) || this.pages[0]
  },

  // Get related pages for internal linking
  getRelatedPages(pageId, limit = 5) {
    const page = this.getPageById(pageId)
    if (!page) return []

    return this.pages
      .filter(p =>
        p.id !== pageId &&
        p.category !== 'legal' &&
        p.inSitemap
      )
      .slice(0, limit)
  }
}

// Freeze registry
Object.freeze(INTELREAP_REGISTRY)
