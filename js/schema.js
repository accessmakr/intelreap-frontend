// ─────────────────────────────────────────
// INTELREAP SCHEMA INJECTION
// Dynamic JSON-LD structured data
// Per-page schema selection
// dateModified updates every Monday
// ─────────────────────────────────────────

const SchemaSystem = (() => {

  const BASE = 'https://intelreap.com'

  // ─────────────────────────────────────
  // ORGANIZATION SCHEMA
  // Always injected on every page
  // ─────────────────────────────────────

  const getOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'IntelReap',
    url: BASE,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE}/assets/images/icons/icon-512.png`,
      width: 200,
      height: 40
    },
    description: 'IntelReap provides free real-time network and device intelligence. No login required.',
    sameAs: [
      'https://twitter.com/intelreap',
      'https://github.com/accessmakr/intelreap-frontend'
    ]
  })

  // ─────────────────────────────────────
  // WEBSITE SCHEMA
  // With SearchAction
  // ─────────────────────────────────────

  const getWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: 'IntelReap',
    description: 'Real-time network and device intelligence.',
    publisher: {
      '@id': `${BASE}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE}/index.html?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  })

  // ─────────────────────────────────────
  // WEBPAGE SCHEMA
  // ─────────────────────────────────────

  const getWebPageSchema = (page, dateModified) => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${page.canonical}#webpage`,
    url: page.canonical,
    name: page.title,
    description: page.description,
    isPartOf: {
      '@id': `${BASE}/#website`
    },
    publisher: {
      '@id': `${BASE}/#organization`
    },
    dateModified: dateModified,
    inLanguage: 'en-US'
  })

  // ─────────────────────────────────────
  // TOOL / SOFTWARE APPLICATION SCHEMA
  // For the main intelligence page
  // ─────────────────────────────────────

  const getToolSchema = (page, dateModified) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${page.canonical}#tool`,
    name: 'Network and Device Intelligence Center (NDIC)',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    url: page.canonical,
    description: page.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    publisher: {
      '@id': `${BASE}/#organization`
    },
    featureList: [
      'IP address and ASN intelligence',
      'VPN and proxy detection',
      'WebRTC IP leak test',
      'Browser capability matrix',
      'Core Web Vitals measurement',
      'Device fingerprint analysis',
      'Security score assessment',
      'Real-time network monitoring',
      'GPU and graphics tier detection',
      'Global environment score'
    ],
    dateModified: dateModified,
    inLanguage: 'en-US'
  })

  // ─────────────────────────────────────
  // ARTICLE SCHEMA
  // For deep dive pages
  // ─────────────────────────────────────

  const getArticleSchema = (
    page, dateModified
  ) => ({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${page.canonical}#article`,
    headline: page.title,
    description: page.description,
    url: page.canonical,
    dateModified: dateModified,
    datePublished: '2026-01-01',
    author: {
      '@id': `${BASE}/#organization`
    },
    publisher: {
      '@id': `${BASE}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': page.canonical
    },
    inLanguage: 'en-US',
    keywords: page.keywords?.join(', ')
  })

  // ─────────────────────────────────────
  // FAQ SCHEMA
  // Injected when FAQ section exists
  // ─────────────────────────────────────

  const getFAQSchema = () => {
    const faqItems = document.querySelectorAll(
      '.ndic-faq-item'
    )
    if (!faqItems.length) return null

    const questions = Array.from(faqItems)
      .map(item => {
        const q = item.querySelector(
          '.ndic-faq-question'
        )
        const a = item.querySelector(
          '.ndic-faq-answer'
        )
        if (!q || !a) return null
        return {
          '@type': 'Question',
          name: q.textContent.trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: a.textContent.trim()
          }
        }
      })
      .filter(Boolean)

    if (!questions.length) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions
    }
  }

  // ─────────────────────────────────────
  // BREADCRUMB SCHEMA
  // ─────────────────────────────────────

  const getBreadcrumbSchema = (page) => {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE
      }
    ]

    if (page.category === 'deep-dive') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Intelligence Center',
        item: `${BASE}/index.html`
      })
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: page.shortTitle,
        item: page.canonical
      })
    } else if (page.id !== 'intelligence') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: page.shortTitle,
        item: page.canonical
      })
    }

    if (items.length <= 1) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    }
  }

  // ─────────────────────────────────────
  // INJECT SCHEMA
  // ─────────────────────────────────────

  const injectSchema = (schema, id) => {
    if (!schema) return

    // Remove existing
    const existing = document.getElementById(id)
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent =
      JSON.stringify(schema, null, 2)
    document.head.appendChild(script)
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = () => {
    if (
      typeof INTELREAP_REGISTRY === 'undefined' ||
      typeof INTELREAP_CONFIG === 'undefined'
    ) return

    const page = INTELREAP_REGISTRY
      .getCurrentPage()
    if (!page) return

    const dateModified =
      INTELREAP_CONFIG.getSchemaDateModified()

    // Always inject
    injectSchema(
      getOrganizationSchema(),
      'schema-organization'
    )
    injectSchema(
      getWebsiteSchema(),
      'schema-website'
    )
    injectSchema(
      getWebPageSchema(page, dateModified),
      'schema-webpage'
    )
    injectSchema(
      getBreadcrumbSchema(page),
      'schema-breadcrumb'
    )

    // Page type specific
    if (page.id === 'intelligence') {
      injectSchema(
        getToolSchema(page, dateModified),
        'schema-tool'
      )
    }

    if (page.schema === 'article' ||
        page.category === 'deep-dive') {
      injectSchema(
        getArticleSchema(page, dateModified),
        'schema-article'
      )
    }

    // FAQ schema after DOM ready
    // FAQs may not be in DOM yet
    setTimeout(() => {
      injectSchema(
        getFAQSchema(),
        'schema-faq'
      )
    }, 500)
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    )
  } else {
    init()
  }

  return { init, getFAQSchema }

})()
