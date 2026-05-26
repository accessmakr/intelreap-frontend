// ─────────────────────────────────────────
// PROXY INTELLIGENCE ENGINE
// Powers Canvas 3 — VPN, Proxy & Routing
// Calls backend proxy-intelligence API
// enriched with frontend browser signals
// ─────────────────────────────────────────

const ProxyEngine = (() => {

  // ───────────────────────────────────────
  // BUILD BROWSER SIGNALS
  // Collects frontend signals that the
  // backend cannot detect on its own
  // ───────────────────────────────────────

  const buildBrowserSignals = () => {
    return {
      // Browser timezone
      tz: getBrowserTimezone(),

      // Browser language
      lang: getBrowserLanguage(),

      // ASN from STATE (set by IP engine)
      asn: STATE.network.asnNumber
        ? String(STATE.network.asnNumber)
        : null,

      // Org name from STATE
      org: STATE.network.asnOwner ||
        STATE.identity.org ||
        null,

      // Country code from STATE
      cc: STATE.identity.countryCode || null
    }
  }

  // ───────────────────────────────────────
  // BUILD QUERY STRING
  // Passes browser signals to backend
  // as query parameters
  // ───────────────────────────────────────

  const buildQueryString = (signals) => {
    const params = new URLSearchParams()

    if (signals.tz) {
      params.append('tz', signals.tz)
    }
    if (signals.lang) {
      params.append('lang', signals.lang)
    }
    if (signals.asn) {
      params.append('asn', signals.asn)
    }
    if (signals.org) {
      params.append('org', signals.org)
    }
    if (signals.cc) {
      params.append('cc', signals.cc)
    }

    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }

  // ───────────────────────────────────────
  // WEBRTC MISMATCH CHECK
  // Compares WebRTC local IP subnet
  // with IP geolocation country
  // ───────────────────────────────────────

  const checkWebRTCMismatch = () => {
    const localIPs = STATE.security.localIp
    const publicCountry =
      STATE.identity.countryCode

    if (!localIPs || !publicCountry) {
      return {
        webrtcMatch: 'UNKNOWN',
        webrtcMismatchDetails: null
      }
    }

    // Local IP starting with 192.168 or 10.
    // is a standard private network
    // A VPN would typically assign
    // a different private range
    const isStandardPrivate =
      localIPs.startsWith('192.168.') ||
      localIPs.startsWith('10.') ||
      localIPs.startsWith('172.16.') ||
      localIPs.startsWith('172.17.') ||
      localIPs.startsWith('172.18.') ||
      localIPs.startsWith('172.19.') ||
      localIPs.startsWith('172.2') ||
      localIPs.startsWith('172.3')

    // We cannot do a true subnet-to-country
    // comparison from browser alone
    // Standard private range = likely no VPN
    return {
      webrtcMatch: isStandardPrivate
        ? 'PASS'
        : 'INCONCLUSIVE',
      webrtcMismatchDetails: {
        localIP: localIPs,
        isStandardPrivate: isStandardPrivate
      }
    }
  }

  // ───────────────────────────────────────
  // FETCH PROXY INTELLIGENCE
  // Calls backend with browser signals
  // ───────────────────────────────────────

  const fetchProxyIntelligence = async () => {
    logAPI(
      'INFO',
      'Fetching proxy intelligence from backend'
    )

    try {
      const signals = buildBrowserSignals()
      const queryString = buildQueryString(signals)

      const url =
        NDIC_CONFIG.BACKEND_URL +
        NDIC_CONFIG.ENDPOINTS.proxyIntelligence +
        queryString

      const controller = new AbortController()
      const timeout = setTimeout(
        () => controller.abort(),
        NDIC_CONFIG.LIMITS.apiTimeoutMs
      )

      STATE.meta.apiCallCount++

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(
          `Proxy intelligence error: ` +
          `${response.status}`
        )
      }

      const result = await response.json()

      if (!result.success || !result.data) {
        throw new Error(
          'Proxy intelligence response invalid'
        )
      }

      return result.data

    } catch (error) {
      STATE.meta.errorCount++
      logBackendError(
        'proxy-intelligence',
        error.message
      )
      return null
    }
  }

  // ───────────────────────────────────────
  // MERGE BACKEND AND FRONTEND DATA
  // Combines API response with
  // frontend browser signals
  // ───────────────────────────────────────

  const mergeProxyData = (apiData) => {
    const webrtcCheck = checkWebRTCMismatch()

    // Use API data as base
    // Fill gaps with our own signals
    return {
      // Core detection results
      vpnDetected: apiData?.vpnDetected ||
        'unknown',
      proxyDetected: apiData?.proxyDetected ||
        'unknown',
      torDetected: apiData?.torDetected ||
        'no',
      datacenterDetected:
        apiData?.datacenterDetected || 'no',
      ipClassification:
        apiData?.ipClassification ||
        'Unknown',

      // ASN ownership
      asnOwnershipType:
        apiData?.asnOwnershipType ||
        STATE.network.asnType ||
        'Unknown',

      // Mismatch signals
      // Backend provides timezone and language
      // Frontend provides WebRTC
      timezoneMatch: apiData?.timezoneMatch ||
        'UNKNOWN',
      languageMatch: apiData?.languageMatch ||
        'UNKNOWN',
      webrtcMatch: webrtcCheck.webrtcMatch,

      // Reverse DNS match
      // Cannot check from browser
      reverseDnsMatch: 'Not Checked',

      // Scores
      fraudScore: apiData?.fraudScore ?? null,
      abuseScore: apiData?.abuseScore ?? null,
      botDetected: apiData?.botDetected || 'no',
      trustScore: apiData?.trustScore ?? null,

      // Route classification
      routeClassification:
        apiData?.routeClassification ||
        'Unknown',

      // Detection flags
      detectionFlags: [
        ...(apiData?.detectionFlags || []),
        ...(webrtcCheck.webrtcMismatchDetails
          ?.isStandardPrivate === false
          ? ['non-standard WebRTC local IP']
          : [])
      ],

      // Confidence
      confidence: apiData?.confidence ||
        'low',

      // Sources
      primarySource: apiData?.primarySource ||
        'unknown',
      engineSource: apiData?.engineSource ||
        'unknown',

      // Org analysis
      orgAnalysis: apiData?.orgAnalysis || null,

      // Mismatch analysis from backend
      mismatchAnalysis:
        apiData?.mismatchAnalysis || null,

      // Whether paid API was consulted
      paidAPIConsulted:
        apiData?.paidAPIConsulted || false,

      // WebRTC details
      webrtcDetails:
        webrtcCheck.webrtcMismatchDetails
    }
  }

  // ───────────────────────────────────────
  // LOG VPN STATUS TO FEED
  // ───────────────────────────────────────

  const logVPNStatus = (vpnData) => {
    if (vpnData.torDetected === 'yes') {
      logVPNDetected('TOR network')
      logSecurity(
        'CRITICAL',
        'TOR exit node detected on connection'
      )
    } else if (vpnData.vpnDetected === 'yes') {
      logVPNDetected('VPN')
    } else if (
      vpnData.vpnDetected === 'maybe' ||
      vpnData.routeClassification === 'Suspect'
    ) {
      logVPN(
        'WARNING',
        `VPN suspicion — Trust score: ` +
        `${vpnData.trustScore}/100`
      )
    } else {
      logVPN(
        'INFO',
        `Route classification: ` +
        `${vpnData.routeClassification} — ` +
        `Trust: ${vpnData.trustScore}/100`
      )
    }

    // Log mismatch signals
    if (vpnData.timezoneMatch === 'FAIL') {
      logSecurity(
        'WARNING',
        'Timezone mismatch detected — ' +
        'IP location does not match ' +
        'browser timezone'
      )
    }

    if (vpnData.languageMatch === 'FAIL') {
      logSecurity(
        'WARNING',
        'Language mismatch detected — ' +
        'IP location does not match ' +
        'browser language'
      )
    }
  }

  // ───────────────────────────────────────
  // TRIGGER CANVAS RENDER
  // ───────────────────────────────────────

  const triggerRender = () => {
    if (typeof Canvas3 !== 'undefined') {
      Canvas3.render()
    }
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'Proxy intelligence engine collecting'
    )

    // Wait for IP engine to complete
    // We need country code and ASN
    // before calling proxy backend
    let waitAttempts = 0
    while (
      !STATE.meta.enginesComplete.ip &&
      waitAttempts < 20
    ) {
      await sleep(500)
      waitAttempts++
    }

    // Fetch from backend
    const apiData = await fetchProxyIntelligence()

    // Merge with frontend signals
    const proxyData = mergeProxyData(apiData)

    // Update STATE.vpn
    updateVPN(proxyData)

    // Mark engine complete
    markEngineComplete('proxy')

    // Log VPN status to feed
    logVPNStatus(proxyData)

    // Log backend response
    if (apiData) {
      logBackendResponse(
        'proxy-intelligence',
        apiData.responseTime,
        apiData.fromCache
      )
    }

    // Trigger canvas render
    triggerRender()

    logSystem(
      'INFO',
      `Proxy scan complete — ` +
      `VPN: ${proxyData.vpnDetected} — ` +
      `Trust: ${proxyData.trustScore} — ` +
      `Route: ${proxyData.routeClassification}`
    )

    return proxyData
  }

  return {
    collect,
    fetchProxyIntelligence,
    buildBrowserSignals,
    checkWebRTCMismatch,
    mergeProxyData
  }

})()
