// ─────────────────────────────────────────
// CANVAS 3 RENDERER
// VPN, Proxy & Routing Intelligence
// Are You Hidden Online?
// ─────────────────────────────────────────

const Canvas3 = (() => {

  const renderDetectionBadge = (
    elementId,
    value
  ) => {
    const element = el(elementId)
    if (!element) return

    const labels = {
      'yes':   'YES',
      'no':    'NO',
      'maybe': 'MAYBE',
      'unknown': '—'
    }

    element.textContent =
      labels[value] || value || '—'
    element.style.color =
      getDetectionBadgeColor(value)
    element.setAttribute(
      'data-detection',
      value || 'unknown'
    )
  }

  const renderPassFail = (elementId, value) => {
    const element = el(elementId)
    if (!element) return

    element.textContent = value || '—'
    element.style.color =
      getPassFailColor(value)
    element.setAttribute(
      'data-result',
      (value || '').toLowerCase()
    )
  }

  const render = () => {
    const v = STATE.vpn
    const s = STATE.scores

    // ─── PARAMETERS ───────────────────────

    // Core detection results
    renderDetectionBadge(
      'c3-vpn-detected',
      v.vpnDetected
    )
    renderDetectionBadge(
      'c3-proxy-detected',
      v.proxyDetected
    )
    renderDetectionBadge(
      'c3-tor-detected',
      v.torDetected
    )
    renderDetectionBadge(
      'c3-datacenter-detected',
      v.datacenterDetected
    )

    // IP Classification
    const classEl = el('c3-ip-classification')
    if (classEl) {
      classEl.textContent =
        v.ipClassification || '—'
      classEl.setAttribute(
        'data-classification',
        (v.ipClassification || '')
          .toLowerCase()
          .replace(/\//g, '-')
      )
    }

    // ASN ownership type
    setText('c3-asn-ownership-type',
      v.asnOwnershipType || '—'
    )

    // Mismatch signals
    renderPassFail(
      'c3-timezone-match',
      v.timezoneMatch
    )
    renderPassFail(
      'c3-language-match',
      v.languageMatch
    )
    renderPassFail(
      'c3-webrtc-match',
      v.webrtcMatch
    )

    // Reverse DNS match
    setText('c3-reverse-dns-match',
      v.reverseDnsMatch || '—'
    )

    // Scores
    const fraudScore = v.fraudScore
    setText('c3-fraud-score',
      fraudScore !== null
        ? `${fraudScore}/100`
        : '—'
    )
    setColor(
      'c3-fraud-score',
      fraudScore !== null
        ? getScoreColor(100 - fraudScore)
        : 'var(--color-text-muted)'
    )

    const abuseScore = v.abuseScore
    setText('c3-abuse-score',
      abuseScore !== null
        ? `${abuseScore}/100`
        : '—'
    )

    // Bot detection
    setBooleanIndicator(
      'c3-bot-detected',
      v.botDetected === 'yes',
      'Detected', 'Not Detected'
    )

    // Trust score — larger prominent display
    const trustScore = v.trustScore
    setText('c3-trust-score',
      trustScore !== null
        ? `${trustScore}/100`
        : '—'
    )
    setColor(
      'c3-trust-score',
      getScoreColor(trustScore || 0)
    )

    // Route classification badge
    const routeEl = el('c3-route-classification')
    if (routeEl) {
      routeEl.textContent =
        v.routeClassification || '—'
      routeEl.setAttribute(
        'data-route',
        (v.routeClassification || '')
          .toLowerCase()
          .replace(' ', '-')
      )
      // Color based on risk
      const routeColors = {
        'Clean':     'var(--color-success)',
        'Suspect':   'var(--color-warning)',
        'High Risk': 'var(--color-danger)'
      }
      routeEl.style.color =
        routeColors[v.routeClassification] ||
        'var(--color-text-muted)'
    }

    // Detection flags
    const flagsEl = el('c3-detection-flags')
    if (flagsEl && v.detectionFlags) {
      if (v.detectionFlags.length > 0) {
        flagsEl.textContent =
          v.detectionFlags.join(' • ')
        flagsEl.style.color =
          'var(--color-warning)'
      } else {
        flagsEl.textContent = 'None detected'
        flagsEl.style.color =
          'var(--color-success)'
      }
    }

    // Detection source and confidence
    setText('c3-primary-source',
      v.primarySource || '—'
    )
    setText('c3-confidence',
      v.confidence || '—'
    )

    // Paid API consulted indicator
    setBooleanIndicator(
      'c3-paid-api-consulted',
      v.paidAPIConsulted,
      'Yes', 'No'
    )

    // Risk heat bar
    const riskBar = el('c3-risk-heat-bar')
    if (riskBar) {
      const riskValue = 100 - (trustScore || 0)
      riskBar.style.width = `${riskValue}%`
      riskBar.style.backgroundColor =
        riskValue >= 60
          ? 'var(--color-danger)'
          : riskValue >= 30
          ? 'var(--color-warning)'
          : 'var(--color-success)'
    }

    // Canvas privacy score
    setText('c3-score',
      s.privacyScore
        ? `${s.privacyScore}/100`
        : '—'
    )
    setColor(
      'c3-score',
      getScoreColor(s.privacyScore || 0)
    )

    // ─── DEEP DIVE LINK ───────────────────
    const deepDiveLink = el('c3-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas3
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas3
    }

    // ─── CANVAS REVEAL ────────────────────
    if (v.vpnDetected !== null) {
      MonitoringEngine.revealCanvas('canvas-3')
    }
  }

  return { render }

})()
