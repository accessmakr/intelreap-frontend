// ─────────────────────────────────────────
// CANVAS 2 RENDERER
// Network Identity Panel
// Who Are You On The Internet?
// ─────────────────────────────────────────

const Canvas2 = (() => {

  const render = () => {
    const i = STATE.identity
    const s = STATE.scores

    // ─── PARAMETERS ───────────────────────

    setText('c2-public-ip',
      i.ip || '—'
    )

    // IP version with color badge
    const ipVersionEl = el('c2-ip-version')
    if (ipVersionEl) {
      ipVersionEl.textContent =
        i.ipVersion || '—'
      ipVersionEl.setAttribute(
        'data-version',
        (i.ipVersion || '').toLowerCase()
      )
    }

    setText('c2-isp', i.isp || '—')
    setText('c2-organization', i.org || '—')
    setText('c2-country', i.country || '—')

    // Country code flag
    setText('c2-country-code',
      i.countryCode || '—'
    )

    setText('c2-region', i.region || '—')
    setText('c2-city', i.city || '—')
    setText('c2-postal', i.postal || '—')

    // Coordinates
    setText('c2-coordinates',
      formatCoordinates(
        i.latitude,
        i.longitude
      )
    )

    setText('c2-latitude',
      i.latitude !== null
        ? i.latitude.toFixed(4)
        : '—'
    )

    setText('c2-longitude',
      i.longitude !== null
        ? i.longitude.toFixed(4)
        : '—'
    )

    setText('c2-timezone', i.timezone || '—')
    setText('c2-utc-offset', i.utcOffset || '—')

    // Connection type with badge
    const connTypeEl = el('c2-connection-type')
    if (connTypeEl) {
      connTypeEl.textContent =
        capitalizeFirst(i.connectionType) || '—'
      connTypeEl.setAttribute(
        'data-type',
        (i.connectionType || '').toLowerCase()
      )
    }

    // Mobile / Proxy / Hosting flags
    setBooleanIndicator(
      'c2-mobile-flag',
      i.mobile,
      'Mobile', 'Fixed'
    )
    setBooleanIndicator(
      'c2-proxy-flag',
      i.proxy,
      'Yes', 'No'
    )
    setBooleanIndicator(
      'c2-hosting-flag',
      i.hosting,
      'Yes', 'No'
    )

    // Continent
    setText('c2-continent', i.continent || '—')

    // Data source
    setText('c2-data-source', i.source || '—')

    // Canvas score
    setText('c2-score',
      s.identityScore
        ? `${s.identityScore}/100`
        : '—'
    )
    setColor(
      'c2-score',
      getScoreColor(s.identityScore || 0)
    )

    // ─── VISUALIZATION — LEAFLET MAP ──────
    if (i.latitude && i.longitude) {
      if (LeafletMapViz.isReady()) {
        LeafletMapViz.update(
          i.latitude,
          i.longitude,
          i.city,
          i.isp
        )
      } else {
        LeafletMapViz.initialize(
          i.latitude,
          i.longitude,
          i.city,
          i.isp
        )
      }
    }

    // ─── DEEP DIVE LINK ───────────────────
    const deepDiveLink = el('c2-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas2
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas2
    }

    // ─── CANVAS REVEAL ────────────────────
    if (i.ip) {
      MonitoringEngine.revealCanvas('canvas-2')
    }
  }

  return { render }

})()
