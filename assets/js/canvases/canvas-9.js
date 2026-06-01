// ─────────────────────────────────────────
// CANVAS 9 RENDERER
// Performance Intelligence Panel
// How Fast Is Your Browser?
// ─────────────────────────────────────────

const Canvas9 = (() => {

  const render = () => {
    const p = STATE.performance
    const s = STATE.scores

    // Page load time — prominent
    const loadEl = el('c9-page-load-time')
    if (loadEl) {
      loadEl.textContent = p.pageLoadTime
        ? formatTime(p.pageLoadTime)
        : '—'
      loadEl.style.color =
        p.pageLoadTime <= 1000
          ? 'var(--color-score-excellent)'
          : p.pageLoadTime <= 2000
          ? 'var(--color-score-good)'
          : p.pageLoadTime <= 3000
          ? 'var(--color-score-fair)'
          : 'var(--color-score-poor)'
    }

    setText('c9-dom-content-loaded',
      p.domContentLoaded
        ? formatTime(p.domContentLoaded)
        : '—'
    )
    setText('c9-dom-interactive',
      p.domInteractive
        ? formatTime(p.domInteractive)
        : '—'
    )

    // TTFB with color
    const ttfbEl = el('c9-ttfb')
    if (ttfbEl) {
      ttfbEl.textContent = p.ttfb
        ? formatTime(p.ttfb)
        : '—'
      ttfbEl.style.color = p.ttfb
        ? getVitalColor(
            getVitalRating('ttfb', p.ttfb)
          )
        : 'var(--color-text-muted)'
    }

    setText('c9-dns-lookup',
      p.dnsLookup !== null
        ? formatTime(p.dnsLookup)
        : '—'
    )
    setText('c9-tcp-connection',
      p.tcpConnection !== null
        ? formatTime(p.tcpConnection)
        : '—'
    )
    setText('c9-tls-handshake',
      p.tlsHandshake !== null
        ? (p.tlsHandshake > 0
            ? formatTime(p.tlsHandshake)
            : 'N/A (HTTP)')
        : '—'
    )
    setText('c9-request-time',
      p.requestTime !== null
        ? formatTime(p.requestTime)
        : '—'
    )
    setText('c9-response-time',
      p.responseTime !== null
        ? formatTime(p.responseTime)
        : '—'
    )
    setText('c9-dom-processing',
      p.domProcessing !== null
        ? formatTime(p.domProcessing)
        : '—'
    )
    setText('c9-resource-fetch-time',
      p.resourceFetchTime !== null
        ? formatTime(p.resourceFetchTime)
        : '—'
    )

    // Resource counts
    setText('c9-resource-count',
      p.resourceCount !== null
        ? String(p.resourceCount)
        : '—'
    )
    setText('c9-page-weight',
      p.pageWeightKB !== null
        ? `${p.pageWeightKB} KB`
        : '—'
    )
    setText('c9-script-count',
      p.scriptCount !== null
        ? String(p.scriptCount)
        : '—'
    )
    setText('c9-stylesheet-count',
      p.stylesheetCount !== null
        ? String(p.stylesheetCount)
        : '—'
    )
    setText('c9-image-count',
      p.imageCount !== null
        ? String(p.imageCount)
        : '—'
    )
    setText('c9-font-count',
      p.fontCount !== null
        ? String(p.fontCount)
        : '—'
    )

    // Cache hit rate
    const cacheEl = el('c9-cache-hit-rate')
    if (cacheEl) {
      cacheEl.textContent =
        p.cacheHitRate !== null
          ? `${p.cacheHitRate}%`
          : '—'
      cacheEl.style.color =
        p.cacheHitRate >= 50
          ? 'var(--color-success)'
          : 'var(--color-text-muted)'
    }

    // Memory usage
    if (p.jsHeapUsed !== null) {
      setText('c9-heap-used',
        `${p.jsHeapUsed} MB`
      )
      setText('c9-heap-total',
        `${p.jsHeapTotal} MB`
      )
      setText('c9-heap-limit',
        `${p.jsHeapLimit} MB`
      )
    }

    // Next hop protocol
    setText('c9-protocol',
      p.nextHopProtocol || '—'
    )

    // Runtime score
    const runtimeEl = el('c9-runtime-score')
    if (runtimeEl) {
      runtimeEl.textContent =
        p.runtimeScore !== null
          ? `${p.runtimeScore}/100`
          : '—'
      runtimeEl.style.color =
        getScoreColor(p.runtimeScore || 0)
    }

    // Percentile rating
    const percentileEl =
      el('c9-percentile-rating')
    if (percentileEl) {
      percentileEl.textContent =
        p.percentileRating || '—'
      percentileEl.style.color =
        p.percentileRating?.includes('Top 10')
          ? 'var(--color-score-excellent)'
          : p.percentileRating?.includes('Top 30')
          ? 'var(--color-score-good)'
          : 'var(--color-text-secondary)'
    }

    // Timing source
    setText('c9-timing-source',
      p.timingSource === 'navigation-timing-2'
        ? 'Navigation Timing API Level 2'
        : p.timingSource === 'navigation-timing-1'
        ? 'Navigation Timing API Level 1'
        : '—'
    )

    // Canvas score
    setText('c9-score',
      s.performanceScore
        ? `${s.performanceScore}/100`
        : '—'
    )
    setColor('c9-score',
      getScoreColor(s.performanceScore || 0)
    )

    // ─── CHARTS ───────────────────────────
    ChartJSViz.updateCanvas9Charts()

    const deepDiveLink = el('c9-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas9
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas9
    }

    if (p.pageLoadTime) {
      MonitoringEngine.revealCanvas('canvas-9')
    }
  }

  return { render }
})()
