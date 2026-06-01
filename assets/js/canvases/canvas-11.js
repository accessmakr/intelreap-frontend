// ─────────────────────────────────────────
// CANVAS 11 RENDERER
// Global Intelligence Scoreboard
// Your Overall Score
// ─────────────────────────────────────────

const Canvas11 = (() => {

  const render = () => {
    const s = STATE.scores

    // ─── GLOBAL SCORE — PROMINENT ─────────

    const globalEl = el('c11-global-score')
    if (globalEl) {
      globalEl.textContent =
        s.globalScore || 0
      globalEl.style.color =
        getScoreColor(s.globalScore || 0)
    }

    // Health badge
    const healthEl = el('c11-health-badge')
    if (healthEl) {
      healthEl.textContent =
        s.healthClassification || '—'
      healthEl.setAttribute(
        'data-health',
        (s.healthClassification || '')
          .toLowerCase()
      )
    }

    // ─── SUB SCORES ───────────────────────

    const subScores = [
      ['c11-network-score',     s.networkScore,     'Network'],
      ['c11-identity-score',    s.identityScore,    'Identity'],
      ['c11-privacy-score',     s.privacyScore,     'Privacy'],
      ['c11-device-score',      s.deviceScore,      'Device'],
      ['c11-graphics-score',    s.graphicsScore,    'Graphics'],
      ['c11-security-score',    s.securityScore,    'Security'],
      ['c11-capability-score',  s.capabilityScore,  'Capability'],
      ['c11-performance-score', s.performanceScore, 'Performance'],
      ['c11-speed-score',       s.speedScore,       'Speed']
    ]

    subScores.forEach(([id, score]) => {
      const element = el(id)
      if (!element) return
      element.textContent = score
        ? `${score}/100`
        : '—'
      element.style.color =
        getScoreColor(score || 0)
    })

    // Strongest and weakest areas
    setText('c11-strongest-area',
      s.strongestArea || '—'
    )
    setColor('c11-strongest-area',
      'var(--color-success)'
    )

    setText('c11-weakest-area',
      s.weakestArea || '—'
    )
    setColor('c11-weakest-area',
      'var(--color-warning)'
    )

    setText('c11-improvement-priority',
      s.improvementPriority || '—'
    )

    // Critical flags and warnings
    setText('c11-critical-flags',
      String(getCriticalCount())
    )
    setColor('c11-critical-flags',
      getCriticalCount() > 0
        ? 'var(--color-critical)'
        : 'var(--color-success)'
    )

    setText('c11-warnings',
      String(getWarningCount())
    )
    setColor('c11-warnings',
      getWarningCount() > 0
        ? 'var(--color-warning)'
        : 'var(--color-success)'
    )

    // ─── CHARTS ───────────────────────────
    ChartJSViz.updateCanvas11Charts()

    // ─── D3 RINGS ─────────────────────────
    D3DiagramsViz.initScoreRings()

    const deepDiveLink =
      el('c11-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas11
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas11
    }

    if (s.globalScore) {
      MonitoringEngine.revealCanvas('canvas-11')
    }
  }

  return { render }
})()
