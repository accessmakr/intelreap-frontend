// ─────────────────────────────────────────
// CANVAS 13 RENDERER
// Advanced Fingerprint & Leak Detection
// How Easily Can You Be Tracked?
// ─────────────────────────────────────────

const Canvas13 = (() => {

  const renderYesNo = (id, value, trueColor, falseColor) => {
    const element = el(id)
    if (!element) return
    element.textContent =
      value === true ? 'Yes' :
      value === false ? 'No' :
      '—'
    element.style.color =
      value === true
        ? (trueColor || 'var(--color-warning)')
        : value === false
        ? (falseColor || 'var(--color-success)')
        : 'var(--color-text-muted)'
  }

  const renderList = (id, list, emptyLabel) => {
    const element = el(id)
    if (!element) return
    if (!list || list.length === 0) {
      element.textContent = emptyLabel || 'None detected'
      element.style.color = 'var(--color-success)'
      return
    }
    element.textContent = list.join(' • ')
    element.style.color = 'var(--color-warning)'
  }

  const render = () => {
    const fp = STATE.fingerprinting

    // ─── FINGERPRINTING SURFACE ───────────

    setText('c13-audio-supported',
      fp.audioSupported === true ? 'Supported' :
      fp.audioSupported === false ? 'Not Supported' : '—'
    )
    setText('c13-audio-hash',
      fp.audioHash
        ? truncateString(fp.audioHash, 24)
        : '—'
    )
    setText('c13-audio-sample-rate',
      fp.audioSampleRate
        ? `${fp.audioSampleRate} Hz`
        : '—'
    )
    const entropyEl = el('c13-audio-entropy-score')
    if (entropyEl) {
      entropyEl.textContent = fp.audioEntropyScore || '—'
      entropyEl.style.color = {
        'High':   'var(--color-warning)',
        'Medium': 'var(--color-info)',
        'Low':    'var(--color-success)'
      }[fp.audioEntropyScore] || 'var(--color-text-muted)'
    }
    renderYesNo('c13-audio-hardware-variance',
      fp.audioHardwareVariance
    )

    setText('c13-canvas-supported',
      fp.canvasSupported === true ? 'Supported' :
      fp.canvasSupported === false ? 'Not Supported' : '—'
    )
    setText('c13-canvas-hash',
      fp.canvasHash
        ? truncateString(fp.canvasHash, 24)
        : '—'
    )
    renderYesNo('c13-canvas-anomaly',
      fp.canvasAnomalyDetected
    )

    setText('c13-font-count',
      fp.fontCount !== null
        ? `${fp.fontCount} of ${fp.fontTotalChecked || 20}`
        : '—'
    )
    const fontUniqEl = el('c13-font-uniqueness')
    if (fontUniqEl) {
      fontUniqEl.textContent =
        fp.fontUniquenessScore !== null
          ? `${fp.fontUniquenessScore}/100`
          : '—'
      fontUniqEl.style.color =
        getScoreColor(fp.fontUniquenessScore || 0)
    }
    setText('c13-font-method',
      fp.fontDetectionMethod || '—'
    )
    renderList('c13-font-notable',
      fp.fontsDetected,
      'No distinctive fonts found'
    )

    setText('c13-clientrects-supported',
      fp.clientRectsSupported === true ? 'Supported' :
      fp.clientRectsSupported === false ? 'Not Supported' : '—'
    )
    setText('c13-clientrects-hash',
      fp.clientRectsHash
        ? truncateString(fp.clientRectsHash, 24)
        : '—'
    )
    setText('c13-clientrects-variance',
      fp.clientRectsVariance || '—'
    )

    // ─── BOT & AUTOMATION ──────────────────

    renderYesNo('c13-webdriver-detected',
      fp.webdriverDetected,
      'var(--color-danger)',
      'var(--color-success)'
    )
    renderList('c13-bot-signals',
      fp.botSignals,
      'No automation signals found'
    )
    const botConfEl = el('c13-bot-confidence')
    if (botConfEl) {
      botConfEl.textContent = fp.botConfidence || '—'
      botConfEl.style.color = {
        'High':   'var(--color-danger)',
        'Medium': 'var(--color-warning)',
        'Low':    'var(--color-success)'
      }[fp.botConfidence] || 'var(--color-text-muted)'
    }

    renderYesNo('c13-incognito-detected',
      fp.incognitoDetected,
      'var(--color-info)',
      'var(--color-text-secondary)'
    )
    setText('c13-incognito-quota',
      fp.incognitoQuotaMB !== null &&
      fp.incognitoQuotaMB !== undefined
        ? `${fp.incognitoQuotaMB} MB`
        : '—'
    )
    setText('c13-incognito-method',
      fp.incognitoMethod || '—'
    )

    renderYesNo('c13-adblock-detected',
      fp.adBlockerDetected,
      'var(--color-info)',
      'var(--color-text-secondary)'
    )
    setText('c13-adblock-method',
      fp.adBlockerMethod || '—'
    )

    // ─── LEAK & NETWORK SIGNALS ────────────

    setText('c13-accept-language',
      fp.acceptLanguageHeader || '—'
    )
    setText('c13-accept-encoding',
      fp.acceptEncodingHeader || '—'
    )
    setText('c13-total-headers',
      fp.totalHeadersSent !== null
        ? String(fp.totalHeadersSent)
        : '—'
    )

    // Full header table
    const headerTable = el('c13-header-table')
    if (headerTable && fp.fullHeaders) {
      const rows = Object.entries(fp.fullHeaders)
      headerTable.innerHTML = rows.length > 0
        ? rows.map(([key, value]) => `
            <div class="ndic-param-row">
              <span class="ndic-param-label">${key}</span>
              <span class="ndic-param-value">${truncateString(String(value), 40)}</span>
            </div>
          `).join('')
        : '<div class="ndic-param-row"><span class="ndic-param-label">No headers available</span></div>'
    }

    const ipv6ConnEl = el('c13-ipv6-connectivity')
    if (ipv6ConnEl) {
      ipv6ConnEl.textContent = fp.ipv6Connectivity || '—'
      ipv6ConnEl.style.color =
        fp.ipv6Connectivity === 'IPv6 Active'
          ? 'var(--color-warning)'
          : fp.ipv6Connectivity === 'IPv4 Only'
          ? 'var(--color-success)'
          : 'var(--color-text-muted)'
    }
    renderYesNo('c13-ipv6-leak',
      fp.ipv6LeakDetected,
      'var(--color-danger)',
      'var(--color-success)'
    )
    setText('c13-ipv6-source',
      fp.ipv6Source || '—'
    )

    // ─── GEOLOCATION ────────────────────────

    const geoPermEl = el('c13-geo-permission')
    if (geoPermEl) {
      geoPermEl.textContent =
        capitalizeFirst(fp.geoPermission) || '—'
      geoPermEl.style.color =
        fp.geoPermission === 'granted'
          ? 'var(--color-warning)'
          : fp.geoPermission === 'denied'
          ? 'var(--color-success)'
          : 'var(--color-info)'
    }
    setText('c13-geo-latitude',
      fp.geoLatitude !== null &&
      fp.geoLatitude !== undefined
        ? fp.geoLatitude.toFixed(4)
        : '—'
    )
    setText('c13-geo-longitude',
      fp.geoLongitude !== null &&
      fp.geoLongitude !== undefined
        ? fp.geoLongitude.toFixed(4)
        : '—'
    )
    setText('c13-geo-accuracy',
      fp.geoAccuracy !== null &&
      fp.geoAccuracy !== undefined
        ? `±${Math.round(fp.geoAccuracy)}m`
        : '—'
    )
    renderYesNo('c13-geo-ip-match',
      fp.geoIpMatch,
      'var(--color-success)',
      'var(--color-danger)'
    )

    // ─── ENVIRONMENT SIGNALS ────────────────

    setText('c13-media-queries-tested',
      fp.mediaQueriesTested !== null
        ? String(fp.mediaQueriesTested)
        : '—'
    )
    setText('c13-media-queries-matched',
      fp.mediaQueriesMatched !== null
        ? String(fp.mediaQueriesMatched)
        : '—'
    )
    setText('c13-display-mode',
      capitalizeFirst(fp.displayMode) || '—'
    )
    setText('c13-color-scheme',
      capitalizeFirst(fp.colorSchemePreference) || '—'
    )
    renderYesNo('c13-reduced-motion',
      fp.reducedMotionPreference
    )

    setText('c13-extension-count',
      fp.extensionCount !== null
        ? String(fp.extensionCount)
        : '—'
    )
    renderList('c13-extension-names',
      fp.extensionNames,
      'None detected'
    )
    setText('c13-extension-method',
      fp.extensionDetectionMethod || '—'
    )

    setText('c13-voice-count',
      fp.voiceCount !== null
        ? String(fp.voiceCount)
        : '—'
    )
    setText('c13-voice-hash',
      fp.voiceListHash
        ? truncateString(fp.voiceListHash, 24)
        : '—'
    )
    setText('c13-default-voice',
      fp.defaultVoice || '—'
    )

    setText('c13-media-audio-inputs',
      fp.mediaAudioInputs !== null
        ? String(fp.mediaAudioInputs)
        : '—'
    )
    setText('c13-media-audio-outputs',
      fp.mediaAudioOutputs !== null
        ? String(fp.mediaAudioOutputs)
        : '—'
    )
    setText('c13-media-video-inputs',
      fp.mediaVideoInputs !== null
        ? String(fp.mediaVideoInputs)
        : '—'
    )

    setText('c13-math-engine-hash',
      fp.mathEngineHash
        ? truncateString(fp.mathEngineHash, 24)
        : '—'
    )
    renderYesNo('c13-math-engine-consistent',
      fp.mathEngineConsistent,
      'var(--color-success)',
      'var(--color-warning)'
    )

    // ─── COMPOSITE UNIQUENESS GAUGE ────────

    const gaugeBar = el('c13-uniqueness-bar')
    const gaugeLabel = el('c13-uniqueness-score')
    if (gaugeBar && fp.uniquenessScore !== null) {
      gaugeBar.style.width = `${fp.uniquenessScore}%`
      gaugeBar.style.backgroundColor =
        fp.uniquenessScore >= 60
          ? 'var(--color-danger)'
          : fp.uniquenessScore >= 30
          ? 'var(--color-warning)'
          : 'var(--color-success)'
    }
    if (gaugeLabel) {
      gaugeLabel.textContent =
        fp.uniquenessScore !== null
          ? `${fp.uniquenessScore}/100`
          : '—'
    }

    // ─── DUAL-PIN MAP — GPS VS IP LOCATION ──
    // Only attempt this once GPS permission
    // has actually been granted and a real
    // coordinate pair came back — otherwise
    // there is nothing meaningful to compare
    if (
      fp.geoPermission === 'granted' &&
      fp.geoLatitude !== null &&
      fp.geoLatitude !== undefined
    ) {
      const identity = STATE.identity
      if (
        typeof LeafletMapViz.initDualPinMap ===
        'function'
      ) {
        LeafletMapViz.initDualPinMap(
          fp.geoLatitude,
          fp.geoLongitude,
          identity.latitude,
          identity.longitude
        )
      }
    }

    // ─── DEEP DIVE LINK ─────────────────────

    const deepDiveLink = el('c13-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas13
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas13
    }

    // ─── CANVAS REVEAL ──────────────────────

    if (
      fp.audioSupported !== null ||
      fp.canvasSupported !== null
    ) {
      MonitoringEngine.revealCanvas('canvas-13')
    }
  }

  return { render }

})()
