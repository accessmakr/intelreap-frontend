// ─────────────────────────────────────────
// CANVAS 5 RENDERER
// Device Intelligence Panel
// What Device Are You Using?
// ─────────────────────────────────────────

const Canvas5 = (() => {

  const render = () => {
    const d = STATE.device
    const s = STATE.scores

    // ─── PARAMETERS ───────────────────────

    // OS with version
    setText('c5-os',
      d.osVersion
        ? `${d.os} ${d.osVersion}`
        : d.os || '—'
    )

    setText('c5-os-version', d.osVersion || '—')

    // Browser with version
    setText('c5-browser',
      d.browserVersion
        ? `${d.browser} ${d.browserVersion}`
        : d.browser || '—'
    )

    setText('c5-browser-version',
      d.browserVersion || '—'
    )

    // Browser engine badge
    const engineEl = el('c5-browser-engine')
    if (engineEl) {
      engineEl.textContent =
        d.browserEngine || '—'
      engineEl.setAttribute(
        'data-engine',
        (d.browserEngine || '').toLowerCase()
      )
    }

    // Device type badge
    const typeEl = el('c5-device-type')
    if (typeEl) {
      typeEl.textContent = d.deviceType || '—'
      typeEl.setAttribute(
        'data-type',
        (d.deviceType || '').toLowerCase()
      )
    }

    setText('c5-device-brand',
      d.deviceBrand || '—'
    )

    // CPU cores
    const cpuEl = el('c5-cpu-cores')
    if (cpuEl) {
      cpuEl.textContent = d.cpuCores
        ? `${d.cpuCores} cores`
        : '—'
    }

    // RAM estimate
    const ramEl = el('c5-ram-estimate')
    if (ramEl) {
      ramEl.textContent = d.ram
        ? `${d.ram} GB`
        : '—'
    }

    // Screen dimensions
    setText('c5-screen-width',
      d.screenWidth ? `${d.screenWidth}px` : '—'
    )
    setText('c5-screen-height',
      d.screenHeight
        ? `${d.screenHeight}px`
        : '—'
    )

    // Viewport dimensions
    setText('c5-viewport-width',
      d.viewportWidth
        ? `${d.viewportWidth}px`
        : '—'
    )
    setText('c5-viewport-height',
      d.viewportHeight
        ? `${d.viewportHeight}px`
        : '—'
    )

    // Pixel ratio
    setText('c5-pixel-ratio',
      d.pixelRatio
        ? `${d.pixelRatio}x`
        : '—'
    )

    // Color depth
    setText('c5-color-depth',
      d.colorDepth
        ? `${d.colorDepth}-bit`
        : '—'
    )

    // Color gamut
    setText('c5-color-gamut',
      (d.colorGamut || '—').toUpperCase()
    )

    // HDR
    setBooleanIndicator(
      'c5-hdr-support',
      d.hdrSupport,
      'Supported', 'Not Supported'
    )

    // Touch support
    setBooleanIndicator(
      'c5-touch-support',
      d.touchSupport,
      'Yes', 'No'
    )

    setText('c5-max-touch-points',
      d.maxTouchPoints !== null
        ? String(d.maxTouchPoints)
        : '—'
    )

    // Orientation support
    setBooleanIndicator(
      'c5-orientation-support',
      d.orientationSupport,
      'Yes', 'No'
    )

    // Screen orientation
    setText('c5-orientation',
      d.orientation
        ? capitalizeFirst(d.orientation)
        : '—'
    )

    // Pointer support
    setBooleanIndicator(
      'c5-pointer-support',
      d.pointerSupport,
      'Yes', 'No'
    )

    // Vibration
    setBooleanIndicator(
      'c5-vibration-support',
      d.vibrationSupport,
      'Yes', 'No'
    )

    // Architecture
    setText('c5-architecture',
      d.architecture || '—'
    )

    setText('c5-bitness',
      d.bitness
        ? `${d.bitness}-bit`
        : '—'
    )

    // Detection source
    setText('c5-detection-source',
      d.detectionSource === 'client-hints'
        ? 'Client Hints API'
        : 'UA String Parsing'
    )

    // Capability tier — prominent badge
    const tierEl = el('c5-capability-tier')
    if (tierEl) {
      tierEl.textContent =
        d.capabilityTier || '—'
      tierEl.setAttribute(
        'data-tier',
        (d.capabilityTier || '').toLowerCase()
      )
      const tierColors = {
        'Flagship': 'var(--color-score-excellent)',
        'High':     'var(--color-score-good)',
        'Mid':      'var(--color-score-fair)',
        'Low':      'var(--color-score-poor)'
      }
      tierEl.style.color =
        tierColors[d.capabilityTier] ||
        'var(--color-text-muted)'
    }

    // Canvas score
    setText('c5-score',
      s.deviceScore
        ? `${s.deviceScore}/100`
        : '—'
    )
    setColor('c5-score',
      getScoreColor(s.deviceScore || 0)
    )

    // ─── DEEP DIVE LINK ───────────────────
    const deepDiveLink = el('c5-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas5
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas5
    }

    // ─── CANVAS REVEAL ────────────────────
    if (d.os || d.browser) {
      MonitoringEngine.revealCanvas('canvas-5')
    }
  }

  return { render }

})()
