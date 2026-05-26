// ─────────────────────────────────────────
// NETWORK INTELLIGENCE ENGINE
// Powers Canvas 4 — Live Network Monitor
// Real-time connection monitoring,
// latency measurement and quality analysis
// ─────────────────────────────────────────

const NetworkEngine = (() => {

  // ───────────────────────────────────────
  // INTERNAL STATE
  // ───────────────────────────────────────

  let tickInterval = null
  let uptimeInterval = null
  let uptimeSeconds = 0
  let isMonitoring = false
  let lastConnectionType = null
  let rttHistory = []
  let bandwidthHistory = []
  const RTT_HISTORY_MAX =
    NDIC_CONFIG.LIMITS.rttHistoryLength

  // ───────────────────────────────────────
  // NAVIGATOR.CONNECTION API
  // Chromium only — degrades gracefully
  // ───────────────────────────────────────

  const readConnectionAPI = () => {
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    if (!conn) {
      return {
        effectiveType: null,
        downlink: null,
        rtt: null,
        saveData: null,
        connectionAPIAvailable: false
      }
    }

    return {
      effectiveType: conn.effectiveType || null,
      downlink: conn.downlink || null,
      rtt: conn.rtt || null,
      saveData: conn.saveData || false,
      downlinkMax: conn.downlinkMax || null,
      type: conn.type || null,
      connectionAPIAvailable: true
    }
  }

  // ───────────────────────────────────────
  // RTT MEASUREMENT
  // Measures real round trip time
  // via fetch timing
  // ───────────────────────────────────────

  const measureRTT = async () => {
    const endpoints = [
      NDIC_CONFIG.BACKEND_URL +
        NDIC_CONFIG.ENDPOINTS.health,
      'https://www.cloudflare.com/cdn-cgi/trace',
      'https://api.ipify.org?format=json'
    ]

    for (const endpoint of endpoints) {
      try {
        const start = performance.now()
        const controller = new AbortController()
        const timeout = setTimeout(
          () => controller.abort(),
          5000
        )

        await fetch(endpoint, {
          method: 'HEAD',
          signal: controller.signal,
          cache: 'no-store',
          mode: 'no-cors'
        })

        clearTimeout(timeout)
        const rtt = Math.round(
          performance.now() - start
        )

        // Sanity check
        if (rtt > 0 && rtt < 10000) {
          return rtt
        }

      } catch {
        // Try next endpoint
      }
    }

    // Fall back to connection API RTT
    const conn = readConnectionAPI()
    return conn.rtt || null
  }

  // ───────────────────────────────────────
  // BANDWIDTH ESTIMATION
  // Uses connection API downlink
  // or resource timing analysis
  // ───────────────────────────────────────

  const estimateBandwidth = () => {
    const conn = readConnectionAPI()

    if (conn.downlink) {
      return conn.downlink
    }

    // Estimate from resource timing
    // Look at large resources loaded
    try {
      const resources =
        performance.getEntriesByType('resource')

      if (!resources || resources.length === 0) {
        return null
      }

      // Find resources with transfer size data
      const measured = resources
        .filter(r =>
          r.transferSize > 10000 &&
          r.duration > 0
        )
        .map(r => ({
          size: r.transferSize,
          duration: r.duration,
          // Mbps
          bandwidth:
            (r.transferSize * 8) /
            (r.duration / 1000) /
            1000000
        }))

      if (measured.length === 0) return null

      // Return median bandwidth estimate
      measured.sort(
        (a, b) => a.bandwidth - b.bandwidth
      )
      const mid = Math.floor(
        measured.length / 2
      )
      return parseFloat(
        measured[mid].bandwidth.toFixed(2)
      )

    } catch {
      return null
    }
  }

  // ───────────────────────────────────────
  // CONNECTION QUALITY CLASSIFICATION
  // ───────────────────────────────────────

  const classifyConnectionQuality = (
    rtt,
    bandwidth,
    effectiveType
  ) => {
    // Use effectiveType if available
    if (effectiveType) {
      switch (effectiveType) {
        case '4g':
          return rtt < 100
            ? 'Excellent'
            : rtt < 200
            ? 'Good'
            : 'Fair'
        case '3g':
          return 'Fair'
        case '2g':
          return 'Poor'
        case 'slow-2g':
          return 'Poor'
        default:
          break
      }
    }

    // Fall back to RTT and bandwidth analysis
    return getConnectionQuality(rtt, bandwidth)
  }

  // ───────────────────────────────────────
  // PACKET LOSS ESTIMATION
  // Inferred from RTT spikes
  // Not a true packet loss measurement
  // ───────────────────────────────────────

  const estimatePacketLoss = (rttHistory) => {
    if (!rttHistory || rttHistory.length < 5) {
      return null
    }

    const values = rttHistory.filter(
      v => v !== null
    )

    if (values.length < 5) return null

    const mean = average(values)

    // Count spikes more than 3x the mean
    // as probable packet loss events
    const spikes = values.filter(
      v => v > mean * 3
    ).length

    const spikeRate =
      (spikes / values.length) * 100

    // Convert spike rate to estimated loss
    const estimatedLoss =
      Math.min(
        100,
        Math.round(spikeRate * 0.5)
      )

    return estimatedLoss
  }

  // ───────────────────────────────────────
  // NETWORK TICK
  // Runs every 3 seconds
  // Updates all live network metrics
  // ───────────────────────────────────────

  const tick = async () => {
    const connData = readConnectionAPI()

    // Measure current RTT
    const currentRtt = await measureRTT()

    // Get bandwidth estimate
    const bandwidth = connData.downlink ||
      estimateBandwidth()

    // Update RTT history
    if (currentRtt !== null) {
      rttHistory.push(currentRtt)
      if (rttHistory.length > RTT_HISTORY_MAX) {
        rttHistory.shift()
      }
    }

    // Update bandwidth history
    if (bandwidth !== null) {
      bandwidthHistory.push(bandwidth)
      if (bandwidthHistory.length > 30) {
        bandwidthHistory.shift()
      }
    }

    // Compute rolling averages
    const validRTTs = rttHistory.filter(
      v => v !== null
    )

    const averageRtt = validRTTs.length > 0
      ? Math.round(average(validRTTs))
      : null

    const peakRtt = validRTTs.length > 0
      ? Math.max(...validRTTs)
      : null

    const lowestRtt = validRTTs.length > 0
      ? Math.min(...validRTTs)
      : null

    // Stability index from RTT variance
    const stabilityIndex =
      computeStabilityIndex(rttHistory)

    // Jitter from RTT differences
    const jitterEstimate =
      computeJitter(rttHistory)

    // Packet loss estimate
    const packetLossEstimate =
      estimatePacketLoss(rttHistory)

    // Quality rating
    const qualityRating =
      classifyConnectionQuality(
        currentRtt,
        bandwidth,
        connData.effectiveType
      )

    // Check for connection type change
    const currentType =
      connData.effectiveType ||
      connData.type

    if (
      lastConnectionType !== null &&
      lastConnectionType !== currentType &&
      currentType !== null
    ) {
      logNetworkChange(
        lastConnectionType,
        currentType
      )
      updateMeta({
        lastNetworkChange: new Date()
          .toISOString()
      })
      STATE.liveNetwork.connectionChangeCount++
    }

    lastConnectionType = currentType

    // Update STATE
    updateLiveNetwork({
      currentRtt: currentRtt,
      averageRtt: averageRtt,
      peakRtt: peakRtt,
      lowestRtt: lowestRtt,
      bandwidth: bandwidth,
      effectiveType: connData.effectiveType,
      saveData: connData.saveData,
      stabilityIndex: stabilityIndex,
      packetLossEstimate: packetLossEstimate,
      qualityRating: qualityRating,
      jitterEstimate: jitterEstimate,
      rttHistory: [...rttHistory],
      bandwidthHistory: [...bandwidthHistory]
    })
  }

  // ───────────────────────────────────────
  // UPTIME COUNTER
  // Tracks time since page load
  // ───────────────────────────────────────

  const startUptimeCounter = () => {
    uptimeInterval = setInterval(() => {
      uptimeSeconds++
      updateLiveNetwork({
        uptimeSinceLoad: uptimeSeconds
      })
    }, 1000)
  }

  // ───────────────────────────────────────
  // CONNECTION CHANGE LISTENER
  // navigator.connection.onchange
  // ───────────────────────────────────────

  const initConnectionChangeListener = () => {
    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    if (!conn) return

    conn.addEventListener('change', async () => {
      logNetwork(
        'WARNING',
        'Network connection changed — rescanning'
      )

      // Immediate tick on connection change
      await tick()

      // Update AI summary after change
      if (
        typeof AISummaryEngine !== 'undefined'
      ) {
        AISummaryEngine.requestCanvasSummary(
          'canvas4'
        )
      }
    })
  }

  // ───────────────────────────────────────
  // ONLINE / OFFLINE LISTENERS
  // ───────────────────────────────────────

  const initOnlineOfflineListeners = () => {
    window.addEventListener('online', () => {
      updateMeta({ isOnline: true })
      logOnline()

      // Resume monitoring
      if (!isMonitoring) {
        startMonitoring()
      }

      // Immediate tick
      tick()
    })

    window.addEventListener('offline', () => {
      updateMeta({ isOnline: false })
      logOffline()

      updateLiveNetwork({
        currentRtt: null,
        qualityRating: 'Offline',
        stabilityIndex: 0
      })
    })
  }

  // ───────────────────────────────────────
  // VISIBILITY CHANGE HANDLER
  // Pauses monitoring when tab is hidden
  // Resumes when tab is visible
  // ───────────────────────────────────────

  const initVisibilityHandler = () => {
    document.addEventListener(
      'visibilitychange',
      () => {
        if (
          document.visibilityState === 'hidden'
        ) {
          // Pause network tick to save resources
          if (tickInterval) {
            clearInterval(tickInterval)
            tickInterval = null
          }
        } else {
          // Resume monitoring
          if (!tickInterval) {
            startMonitoring()
          }
          // Immediate tick on resume
          tick()
        }
      }
    )
  }

  // ───────────────────────────────────────
  // START MONITORING
  // ───────────────────────────────────────

  const startMonitoring = () => {
    if (tickInterval) return

    tickInterval = setInterval(
      tick,
      NDIC_CONFIG.INTERVALS.networkTick
    )

    isMonitoring = true

    logNetwork(
      'INFO',
      'Live network monitoring started'
    )
  }

  // ───────────────────────────────────────
  // STOP MONITORING
  // ───────────────────────────────────────

  const stopMonitoring = () => {
    if (tickInterval) {
      clearInterval(tickInterval)
      tickInterval = null
    }
    if (uptimeInterval) {
      clearInterval(uptimeInterval)
      uptimeInterval = null
    }
    isMonitoring = false
  }

  // ───────────────────────────────────────
  // INITIAL COLLECTION
  // Runs once on startup
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'Network engine collecting'
    )

    const connData = readConnectionAPI()
    const bandwidth = connData.downlink ||
      estimateBandwidth()

    // Initial RTT measurement
    const currentRtt = await measureRTT()

    if (currentRtt !== null) {
      rttHistory.push(currentRtt)
    }

    const qualityRating =
      classifyConnectionQuality(
        currentRtt,
        bandwidth,
        connData.effectiveType
      )

    const initialData = {
      currentRtt: currentRtt,
      averageRtt: currentRtt,
      peakRtt: currentRtt,
      lowestRtt: currentRtt,
      bandwidth: bandwidth,
      effectiveType: connData.effectiveType,
      saveData: connData.saveData,
      stabilityIndex: 100,
      packetLossEstimate: 0,
      qualityRating: qualityRating,
      jitterEstimate: 0,
      uptimeSinceLoad: 0,
      rttHistory: [...rttHistory],
      bandwidthHistory:
        bandwidth ? [bandwidth] : [],
      connectionChangeCount: 0
    }

    // Update STATE
    updateLiveNetwork(initialData)
    markEngineComplete('network')

    // Set initial connection type
    lastConnectionType =
      connData.effectiveType ||
      connData.type

    logNetwork(
      'INFO',
      `Network: ${connData.effectiveType || 'Unknown'} — ` +
      `RTT: ${currentRtt}ms — ` +
      `Quality: ${qualityRating}`
    )

    // Initialize all listeners
    initConnectionChangeListener()
    initOnlineOfflineListeners()
    initVisibilityHandler()

    // Start uptime counter
    startUptimeCounter()

    // Start live monitoring loop
    startMonitoring()

    return initialData
  }

  return {
    collect,
    tick,
    startMonitoring,
    stopMonitoring,
    readConnectionAPI,
    measureRTT,
    estimateBandwidth,
    classifyConnectionQuality
  }

})()
