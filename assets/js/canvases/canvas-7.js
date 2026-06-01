// ─────────────────────────────────────────
// CANVAS 7 RENDERER
// Security & Privacy Panel
// How Safe Are You Right Now?
// ─────────────────────────────────────────

const Canvas7 = (() => {

  const renderSecurityItem = (
    id, value, goodValue, badValue
  ) => {
    const element = el(id)
    if (!element) return
    element.textContent = value || '—'
    const isGood = value === goodValue ||
      value === 'Available' ||
      value === 'Enabled' ||
      value === 'Secure' ||
      value === 'Yes'
    element.style.color = isGood
      ? 'var(--color-success)'
      : value === badValue ||
        value === 'Exposed' ||
        value === 'Blocked' ||
        value === 'Not Secure'
      ? 'var(--color-danger)'
      : 'var(--color-text-secondary)'
  }

  const render = () => {
    const sec = STATE.security
    const s = STATE.scores

    // HTTPS Status
    renderSecurityItem(
      'c7-https-status',
      sec.httpsStatus,
      'Secure', 'Not Secure'
    )

    renderSecurityItem(
      'c7-secure-context',
      sec.secureContext,
      'Yes', 'No'
    )

    setText('c7-mixed-content',
      sec.mixedContent || '—'
    )

    // WebRTC exposure — critical
    const webrtcEl = el('c7-webrtc-exposure')
    if (webrtcEl) {
      webrtcEl.textContent =
        sec.webrtcExposure || '—'
      webrtcEl.style.color =
        sec.webrtcExposure === 'Exposed'
          ? 'var(--color-critical)'
          : 'var(--color-success)'
    }

    setText('c7-local-ip',
      sec.localIp || 'Not Exposed'
    )
    setColor('c7-local-ip',
      sec.localIp
        ? 'var(--color-warning)'
        : 'var(--color-success)'
    )

    setText('c7-webrtc-ip-match',
      sec.webrtcIpMatch || '—'
    )

    // Storage access
    renderSecurityItem(
      'c7-cookie-access',
      sec.cookieAccess,
      'Available', 'Blocked'
    )
    renderSecurityItem(
      'c7-localstorage-access',
      sec.localStorageAccess,
      'Available', 'Blocked'
    )
    renderSecurityItem(
      'c7-sessionstorage-access',
      sec.sessionStorageAccess,
      'Available', 'Blocked'
    )
    renderSecurityItem(
      'c7-indexeddb-access',
      sec.indexedDbAccess,
      'Available', 'Blocked'
    )

    // Permissions
    const permissionColor = (p) => {
      if (p === 'granted') {
        return 'var(--color-warning)'
      }
      if (p === 'denied') {
        return 'var(--color-success)'
      }
      if (p === 'prompt') {
        return 'var(--color-info)'
      }
      return 'var(--color-text-muted)'
    }

    const permissions = [
      ['c7-camera-permission', sec.cameraPermission],
      ['c7-microphone-permission', sec.microphonePermission],
      ['c7-location-permission', sec.locationPermission],
      ['c7-notification-permission', sec.notificationPermission],
      ['c7-clipboard-read', sec.clipboardReadPermission],
      ['c7-clipboard-write', sec.clipboardWritePermission]
    ]

    permissions.forEach(([id, value]) => {
      const el_ = el(id)
      if (!el_) return
      el_.textContent = capitalizeFirst(value) || '—'
      el_.style.color = permissionColor(value)
    })

    // Privacy settings
    renderSecurityItem(
      'c7-do-not-track',
      sec.doNotTrack,
      'Enabled', 'Disabled'
    )

    setText('c7-third-party-cookies',
      sec.thirdPartyCookies || '—'
    )
    setText('c7-referrer-policy',
      sec.referrerPolicy || '—'
    )
    setText('c7-csp-presence',
      sec.cspPresence || '—'
    )

    // Fingerprint surface
    setText('c7-fingerprint-surfaces',
      sec.fingerprintSurfaceCount !== null
        ? String(sec.fingerprintSurfaceCount)
        : '—'
    )

    // Security flags
    const flagsEl = el('c7-security-flags')
    if (flagsEl && sec.securityFlags) {
      if (sec.securityFlags.length > 0) {
        flagsEl.textContent =
          sec.securityFlags.join(' • ')
        flagsEl.style.color =
          'var(--color-danger)'
      } else {
        flagsEl.textContent = 'None detected'
        flagsEl.style.color =
          'var(--color-success)'
      }
    }

    // Security warnings
    const warningsEl = el('c7-security-warnings')
    if (warningsEl && sec.securityWarnings) {
      warningsEl.textContent =
        sec.securityWarnings.length > 0
          ? sec.securityWarnings.join(' • ')
          : 'None'
      warningsEl.style.color =
        sec.securityWarnings.length > 0
          ? 'var(--color-warning)'
          : 'var(--color-success)'
    }

    // Security score
    const scoreEl = el('c7-security-score')
    if (scoreEl) {
      scoreEl.textContent =
        sec.securityScore !== null
          ? `${sec.securityScore}/100`
          : '—'
      scoreEl.style.color =
        getScoreColor(sec.securityScore || 0)
    }

    // Risk level badge
    const riskEl = el('c7-risk-level')
    if (riskEl) {
      riskEl.textContent = sec.riskLevel || '—'
      riskEl.style.color =
        getRiskColor(sec.riskLevel)
    }

    setText('c7-score',
      s.securityScore
        ? `${s.securityScore}/100`
        : '—'
    )
    setColor('c7-score',
      getScoreColor(s.securityScore || 0)
    )

    const deepDiveLink = el('c7-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas7
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas7
    }

    if (sec.httpsStatus !== null) {
      MonitoringEngine.revealCanvas('canvas-7')
    }
  }

  return { render }
})()
