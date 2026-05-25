// ─────────────────────────────────────────
// SECURITY INTELLIGENCE ENGINE
// Powers Canvas 7 — Security & Privacy Panel
// Complete browser security, privacy and
// exposure detection
// ─────────────────────────────────────────

const SecurityEngine = (() => {

  // ───────────────────────────────────────
  // HTTPS AND SECURE CONTEXT
  // ───────────────────────────────────────

  const detectHTTPS = () => {
    const protocol = window.location.protocol
    const isHTTPS = protocol === 'https:'
    const isSecureContext =
      window.isSecureContext === true
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '::1'

    return {
      httpsStatus: isHTTPS
        ? 'Secure'
        : 'Not Secure',
      protocol: protocol,
      secureContext: isSecureContext
        ? 'Yes'
        : 'No',
      isSecureContext: isSecureContext,
      isLocalhost: isLocalhost
    }
  }

  // ───────────────────────────────────────
  // MIXED CONTENT DETECTION
  // ───────────────────────────────────────

  const detectMixedContent = () => {
    const isHTTPS =
      window.location.protocol === 'https:'

    if (!isHTTPS) {
      return {
        mixedContent: 'N/A — Not on HTTPS',
        mixedContentRisk: 'none'
      }
    }

    // Check for HTTP resources loaded
    // on HTTPS page
    const resources =
      performance.getEntriesByType('resource')

    const httpResources = resources.filter(r =>
      r.name.startsWith('http://')
    )

    return {
      mixedContent: httpResources.length > 0
        ? `${httpResources.length} HTTP resources detected`
        : 'None detected',
      mixedContentRisk: httpResources.length > 0
        ? 'medium'
        : 'none',
      httpResourceCount: httpResources.length
    }
  }

  // ───────────────────────────────────────
  // WEBRTC IP EXPOSURE DETECTION
  // Attempts to extract local IP via WebRTC
  // This is the most important privacy leak
  // ───────────────────────────────────────

  const detectWebRTCExposure = () => {
    return new Promise((resolve) => {
      const result = {
        webrtcExposure: 'Safe',
        localIp: null,
        publicIpViaWebRTC: null,
        webrtcIpMatch: 'Unknown',
        localIPs: [],
        publicIPs: []
      }

      // Check if WebRTC is available
      const RTCPeer =
        window.RTCPeerConnection ||
        window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection

      if (!RTCPeer) {
        result.webrtcExposure = 'Safe'
        result.webrtcIpMatch = 'N/A'
        resolve(result)
        return
      }

      let pc = null
      const timeout = setTimeout(() => {
        try { pc?.close() } catch {}
        resolve(result)
      }, 5000)

      try {
        pc = new RTCPeer({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302'
            }
          ]
        })

        pc.createDataChannel('')

        pc.onicecandidate = (event) => {
          if (!event || !event.candidate) {
            clearTimeout(timeout)
            try { pc?.close() } catch {}

            // Analyze found IPs
            if (result.localIPs.length > 0) {
              result.localIp = result.localIPs[0]
              result.webrtcExposure = 'Exposed'
            }

            resolve(result)
            return
          }

          const candidate =
            event.candidate.candidate

          // Extract IP addresses from
          // ICE candidate string
          const ipRegex =
            /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

          const matches =
            candidate.match(ipRegex) || []

          for (const ip of matches) {
            // Classify the IP
            if (isPrivateIP(ip)) {
              if (!result.localIPs.includes(ip)) {
                result.localIPs.push(ip)
              }
            } else if (
              !ip.startsWith('0.') &&
              !ip.startsWith('127.')
            ) {
              if (!result.publicIPs.includes(ip)) {
                result.publicIPs.push(ip)
              }
            }
          }
        }

        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(() => {
            clearTimeout(timeout)
            resolve(result)
          })

      } catch {
        clearTimeout(timeout)
        try { pc?.close() } catch {}
        resolve(result)
      }
    })
  }

  // ───────────────────────────────────────
  // STORAGE ACCESS DETECTION
  // ───────────────────────────────────────

  const detectStorageAccess = () => {
    // localStorage
    let localStorageAccess = 'Unavailable'
    try {
      const testKey = '__ndic_ls_test'
      localStorage.setItem(testKey, '1')
      localStorage.removeItem(testKey)
      localStorageAccess = 'Available'
    } catch {
      localStorageAccess = 'Blocked'
    }

    // sessionStorage
    let sessionStorageAccess = 'Unavailable'
    try {
      const testKey = '__ndic_ss_test'
      sessionStorage.setItem(testKey, '1')
      sessionStorage.removeItem(testKey)
      sessionStorageAccess = 'Available'
    } catch {
      sessionStorageAccess = 'Blocked'
    }

    // IndexedDB
    let indexedDbAccess = 'Unavailable'
    try {
      if ('indexedDB' in window) {
        indexedDbAccess = 'Available'
      }
    } catch {
      indexedDbAccess = 'Blocked'
    }

    // Cookie access
    let cookieAccess = 'Unavailable'
    try {
      document.cookie =
        '__ndic_test=1; SameSite=Strict'
      if (
        document.cookie.includes('__ndic_test')
      ) {
        cookieAccess = 'Available'
        // Clean up
        document.cookie =
          '__ndic_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      } else {
        cookieAccess = 'Blocked'
      }
    } catch {
      cookieAccess = 'Blocked'
    }

    // Third-party cookie support
    // Cannot directly test without
    // cross-origin iframe
    // We infer from browser/context
    const thirdPartyCookies =
      navigator.cookieEnabled
        ? 'Likely Enabled'
        : 'Blocked'

    return {
      localStorageAccess,
      sessionStorageAccess,
      indexedDbAccess,
      cookieAccess,
      thirdPartyCookies
    }
  }

  // ───────────────────────────────────────
  // PERMISSIONS DETECTION
  // ───────────────────────────────────────

  const detectPermissions = async () => {
    const permissionNames = [
      'camera',
      'microphone',
      'geolocation',
      'notifications',
      'push',
      'midi',
      'ambient-light-sensor',
      'accelerometer',
      'gyroscope',
      'magnetometer',
      'clipboard-read',
      'clipboard-write',
      'payment-handler',
      'idle-detection',
      'periodic-background-sync',
      'screen-wake-lock',
      'nfc',
      'bluetooth'
    ]

    const permissions = {}

    if (!navigator.permissions) {
      return {
        cameraPermission: 'API Unavailable',
        microphonePermission: 'API Unavailable',
        locationPermission: 'API Unavailable',
        notificationPermission:
          'Notification' in window
            ? Notification.permission
            : 'API Unavailable',
        allPermissions: {}
      }
    }

    for (const name of permissionNames) {
      try {
        const status =
          await navigator.permissions.query({
            name: name
          })
        permissions[name] = status.state
      } catch {
        permissions[name] = 'unavailable'
      }
    }

    return {
      cameraPermission:
        permissions['camera'] || 'Unknown',
      microphonePermission:
        permissions['microphone'] || 'Unknown',
      locationPermission:
        permissions['geolocation'] || 'Unknown',
      notificationPermission:
        permissions['notifications'] ||
        ('Notification' in window
          ? Notification.permission
          : 'Unknown'),
      clipboardReadPermission:
        permissions['clipboard-read'] ||
        'Unknown',
      clipboardWritePermission:
        permissions['clipboard-write'] ||
        'Unknown',
      pushPermission:
        permissions['push'] || 'Unknown',
      allPermissions: permissions
    }
  }

  // ───────────────────────────────────────
  // DO NOT TRACK DETECTION
  // ───────────────────────────────────────

  const detectDoNotTrack = () => {
    const dnt =
      navigator.doNotTrack ||
      window.doNotTrack ||
      navigator.msDoNotTrack

    let status = 'Not Set'
    if (dnt === '1' || dnt === 'yes') {
      status = 'Enabled'
    } else if (dnt === '0' || dnt === 'no') {
      status = 'Disabled'
    }

    return { doNotTrack: status }
  }

  // ───────────────────────────────────────
  // REFERRER POLICY DETECTION
  // ───────────────────────────────────────

  const detectReferrerPolicy = () => {
    // Check meta tag
    const metaReferrer = document.querySelector(
      'meta[name="referrer"]'
    )

    if (metaReferrer) {
      return {
        referrerPolicy: metaReferrer.content ||
          'Set but empty'
      }
    }

    // Check document referrerPolicy
    if (document.referrerPolicy) {
      return {
        referrerPolicy: document.referrerPolicy
      }
    }

    return {
      referrerPolicy: 'Not Set'
    }
  }

  // ───────────────────────────────────────
  // CSP DETECTION
  // ───────────────────────────────────────

  const detectCSP = () => {
    // Check meta tag CSP
    const metaCSP = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    )

    if (metaCSP) {
      return {
        cspPresence: 'Present (Meta Tag)',
        cspType: 'meta'
      }
    }

    // Cannot read CSP headers from JavaScript
    // We can only check meta tag
    return {
      cspPresence: 'Not Detectable via JS',
      cspType: null
    }
  }

  // ───────────────────────────────────────
  // FINGERPRINTING SURFACE DETECTION
  // Measures how much data browser exposes
  // ───────────────────────────────────────

  const detectFingerprintSurface = () => {
    const surfaces = []

    if (navigator.hardwareConcurrency) {
      surfaces.push('CPU cores exposed')
    }
    if (navigator.deviceMemory) {
      surfaces.push('RAM estimate exposed')
    }
    if (window.devicePixelRatio > 1) {
      surfaces.push('High DPI screen exposed')
    }
    if (navigator.plugins?.length > 0) {
      surfaces.push(
        `${navigator.plugins.length} plugins exposed`
      )
    }
    if (navigator.languages?.length > 1) {
      surfaces.push(
        `${navigator.languages.length} languages exposed`
      )
    }
    if (screen.colorDepth) {
      surfaces.push('Color depth exposed')
    }

    return {
      fingerprintSurfaces: surfaces,
      fingerprintSurfaceCount: surfaces.length
    }
  }

  // ───────────────────────────────────────
  // SECURITY SCORE COMPUTATION
  // ───────────────────────────────────────

  const computeSecurityScore = (data) => {
    let score = 0
    const flags = []
    const warnings = []

    // HTTPS (20 points)
    if (data.isSecureContext) {
      score += 20
    } else {
      flags.push('Connection is not secure')
    }

    // Secure Context (10 points)
    if (data.isSecureContext) {
      score += 10
    }

    // WebRTC not exposed (20 points)
    if (data.webrtcExposure === 'Safe') {
      score += 20
    } else if (data.webrtcExposure === 'Exposed') {
      flags.push(
        'Local IP exposed via WebRTC'
      )
    }

    // No mixed content (10 points)
    if (data.mixedContentRisk === 'none') {
      score += 10
    } else {
      warnings.push('Mixed content detected')
    }

    // Do Not Track (5 points)
    if (data.doNotTrack === 'Enabled') {
      score += 5
    }

    // Storage access controlled (10 points)
    // Full access is expected and fine
    // Blocked suggests privacy mode
    if (data.localStorageAccess === 'Available') {
      score += 5
    }
    if (data.cookieAccess === 'Available') {
      score += 5
    }

    // Camera not granted (5 points)
    if (
      data.cameraPermission === 'denied' ||
      data.cameraPermission === 'prompt'
    ) {
      score += 5
    } else if (
      data.cameraPermission === 'granted'
    ) {
      warnings.push('Camera access granted')
    }

    // Microphone not granted (5 points)
    if (
      data.microphonePermission === 'denied' ||
      data.microphonePermission === 'prompt'
    ) {
      score += 5
    } else if (
      data.microphonePermission === 'granted'
    ) {
      warnings.push('Microphone access granted')
    }

    // Location not granted (5 points)
    if (
      data.locationPermission === 'denied' ||
      data.locationPermission === 'prompt'
    ) {
      score += 5
    } else if (
      data.locationPermission === 'granted'
    ) {
      warnings.push('Location access granted')
    }

    // Low fingerprint surface (5 points)
    if (data.fingerprintSurfaceCount <= 3) {
      score += 5
    }

    // Determine risk level
    let riskLevel = 'Low'
    if (score < 40) riskLevel = 'Critical'
    else if (score < 60) riskLevel = 'High'
    else if (score < 75) riskLevel = 'Medium'

    return {
      securityScore: Math.min(100, score),
      riskLevel: riskLevel,
      securityFlags: flags,
      securityWarnings: warnings
    }
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'Security engine collecting'
    )

    // Run synchronous checks immediately
    const httpsData = detectHTTPS()
    const mixedContentData = detectMixedContent()
    const storageData = detectStorageAccess()
    const dntData = detectDoNotTrack()
    const referrerData = detectReferrerPolicy()
    const cspData = detectCSP()
    const fingerprintData =
      detectFingerprintSurface()

    // Run async checks in parallel
    const [webrtcData, permissionsData] =
      await Promise.all([
        detectWebRTCExposure(),
        detectPermissions()
      ])

    // Flatten all data
    const allData = {
      ...httpsData,
      ...mixedContentData,
      ...webrtcData,
      ...storageData,
      ...permissionsData,
      ...dntData,
      ...referrerData,
      ...cspData,
      ...fingerprintData
    }

    // Compute security score
    const scoreData = computeSecurityScore({
      isSecureContext: httpsData.isSecureContext,
      webrtcExposure: webrtcData.webrtcExposure,
      mixedContentRisk:
        mixedContentData.mixedContentRisk,
      doNotTrack: dntData.doNotTrack,
      localStorageAccess:
        storageData.localStorageAccess,
      cookieAccess: storageData.cookieAccess,
      cameraPermission:
        permissionsData.cameraPermission,
      microphonePermission:
        permissionsData.microphonePermission,
      locationPermission:
        permissionsData.locationPermission,
      fingerprintSurfaceCount:
        fingerprintData.fingerprintSurfaceCount
    })

    const securityData = {
      ...allData,
      ...scoreData
    }

    // Update STATE
    updateSecurity(securityData)
    markEngineComplete('security')

    // Log any security flags
    if (
      webrtcData.webrtcExposure === 'Exposed'
    ) {
      logWebRTCExposure(
        webrtcData.localIp || 'unknown'
      )
    }

    if (scoreData.securityFlags.length > 0) {
      scoreData.securityFlags.forEach(flag => {
        logSecurityFlag(flag)
      })
    }

    logSystem(
      'INFO',
      `Security scan complete — ` +
      `Score: ${scoreData.securityScore} — ` +
      `Risk: ${scoreData.riskLevel} — ` +
      `Flags: ${scoreData.securityFlags.length}`
    )

    return securityData
  }

  return {
    collect,
    detectHTTPS,
    detectWebRTCExposure,
    detectStorageAccess,
    detectPermissions,
    detectMixedContent,
    detectDoNotTrack,
    computeSecurityScore
  }

})()
