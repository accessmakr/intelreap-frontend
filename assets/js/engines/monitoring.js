// ─────────────────────────────────────────
// LIVE MONITORING ENGINE
// Orchestrates all real-time update cycles
// Manages intervals, event listeners and
// system health across the entire platform
// ─────────────────────────────────────────

const MonitoringEngine = (() => {

  // ───────────────────────────────────────
  // INTERNAL STATE
  // ───────────────────────────────────────

  let uiRefreshInterval = null
  let countdownInterval = null
  let ipRefreshInterval = null
  let countdownSeconds = 60
  let isInitialized = false
  let lastScoreSnapshot = null

  // ───────────────────────────────────────
  // UI REFRESH CYCLE
  // Runs every 5 seconds
  // Recomputes scores and updates all
  // score-based UI elements
  // ───────────────────────────────────────

  const runUIRefresh = () => {
    try {
      // Recompute all scores
      const newScores = ScoringEngine.compute()

      // Detect score changes
      if (lastScoreSnapshot) {
        detectScoreChanges(
          lastScoreSnapshot,
          newScores
        )
      }

      lastScoreSnapshot = { ...newScores }

      // Update all canvas score displays
      updateAllScoreDisplays(newScores)

      // Update header
      updateHeader()

    } catch (error) {
      logError(
        'UI refresh error: ' + error.message
      )
    }
  }

  // ───────────────────────────────────────
  // SCORE CHANGE DETECTION
  // Logs significant score changes
  // to Canvas 12 feed
  // ───────────────────────────────────────

  const detectScoreChanges = (
    previous,
    current
  ) => {
    const areas = [
      {
        key: 'networkScore',
        label: 'Network'
      },
      {
        key: 'privacyScore',
        label: 'Privacy'
      },
      {
        key: 'securityScore',
        label: 'Security'
      },
      {
        key: 'performanceScore',
        label: 'Performance'
      },
      {
        key: 'globalScore',
        label: 'Global'
      }
    ]

    for (const { key, label } of areas) {
      const prev = previous[key] || 0
      const curr = current[key] || 0
      const diff = Math.abs(curr - prev)

      // Only log changes of 5+ points
      if (diff >= 5) {
        logScoreUpdate(label, prev, curr)
      }
    }

    // Log global health classification change
    if (
      previous.healthClassification !==
      current.healthClassification &&
      current.healthClassification
    ) {
      logScore(
        'INFO',
        `Health classification changed: ` +
        `${previous.healthClassification} → ` +
        `${current.healthClassification}`
      )
    }
  }

  // ───────────────────────────────────────
  // UPDATE ALL SCORE DISPLAYS
  // Updates score UI across all canvases
  // ───────────────────────────────────────

  const updateAllScoreDisplays = (scores) => {
    const scoreElements = {
      'canvas1-score': scores.networkScore,
      'canvas2-score': scores.identityScore,
      'canvas3-score': scores.privacyScore,
      'canvas4-score': scores.networkScore,
      'canvas5-score': scores.deviceScore,
      'canvas6-score': scores.graphicsScore,
      'canvas7-score': scores.securityScore,
      'canvas8-score': scores.capabilityScore,
      'canvas9-score': scores.performanceScore,
      'canvas10-score': scores.speedScore,
      'canvas11-global': scores.globalScore,
      'full-summary-score': scores.globalScore
    }

    for (const [id, score] of
      Object.entries(scoreElements)
    ) {
      const element = el(id)
      if (!element) continue

      element.textContent = score || 0
      element.style.color = getScoreColor(
        score || 0
      )
    }

    // Update health badge
    const healthBadge = el('health-badge')
    if (healthBadge) {
      healthBadge.textContent =
        scores.healthClassification || '—'
      healthBadge.setAttribute(
        'data-health',
        (scores.healthClassification || '')
          .toLowerCase()
      )
    }

    // Update critical flags count
    const criticalCount = el('critical-flags-count')
    if (criticalCount) {
      const count = getCriticalCount()
      criticalCount.textContent = count
      criticalCount.style.color = count > 0
        ? 'var(--color-critical)'
        : 'var(--color-success)'
    }

    // Update warnings count
    const warningsCount = el('warnings-count')
    if (warningsCount) {
      const count = getWarningCount()
      warningsCount.textContent = count
      warningsCount.style.color = count > 0
        ? 'var(--color-warning)'
        : 'var(--color-success)'
    }

    // Update strongest and weakest
    const strongestEl = el('strongest-area')
    if (strongestEl) {
      strongestEl.textContent =
        scores.strongestArea || '—'
    }

    const weakestEl = el('weakest-area')
    if (weakestEl) {
      weakestEl.textContent =
        scores.weakestArea || '—'
    }

    const priorityEl = el('improvement-priority')
    if (priorityEl) {
      priorityEl.textContent =
        scores.improvementPriority || '—'
    }
  }

  // ───────────────────────────────────────
  // UPDATE HEADER
  // Refreshes scan status, timer,
  // online status in page header
  // ───────────────────────────────────────

  const updateHeader = () => {
    // Online/offline status indicator
    const statusDot = el('scan-status-dot')
    const statusText = el('scan-status-text')

    if (statusDot && statusText) {
      if (!STATE.meta.isOnline) {
        statusDot.setAttribute(
          'data-status', 'offline'
        )
        statusText.textContent = 'OFFLINE'
      } else if (!STATE.meta.backendHealthy) {
        statusDot.setAttribute(
          'data-status', 'degraded'
        )
        statusText.textContent = 'DEGRADED'
      } else {
        statusDot.setAttribute(
          'data-status', 'active'
        )
        statusText.textContent = 'LIVE'
      }
    }

    // Last scan timestamp
    const lastScanEl = el('last-scan-time')
    if (lastScanEl && STATE.meta.lastFullScan) {
      lastScanEl.textContent =
        formatTimestamp(STATE.meta.lastFullScan)
    }

    // API call count
    const apiCountEl = el('api-call-count')
    if (apiCountEl) {
      apiCountEl.textContent =
        STATE.meta.apiCallCount
    }
  }

  // ───────────────────────────────────────
  // COUNTDOWN TIMER
  // Shows time until next AI refresh
  // ───────────────────────────────────────

  const startCountdownTimer = () => {
    countdownSeconds = 60

    countdownInterval = setInterval(() => {
      countdownSeconds--

      const countdownEl = el('next-scan-countdown')
      if (countdownEl) {
        countdownEl.textContent =
          `${countdownSeconds}s`
      }

      if (countdownSeconds <= 0) {
        countdownSeconds = 60
      }
    }, 1000)
  }

  // ───────────────────────────────────────
  // IP REFRESH CYCLE
  // Checks for IP changes every 5 minutes
  // Detects VPN toggles in near-real-time
  // ───────────────────────────────────────

  const startIPRefreshCycle = () => {
    // 5 minute interval
    ipRefreshInterval = setInterval(
      async () => {
        if (!STATE.meta.isOnline) return

        logAPI(
          'INFO',
          'Periodic IP refresh check'
        )

        try {
          await IPEngine.refresh()
        } catch (error) {
          logError(
            'IP refresh error: ' +
            error.message
          )
        }
      },
      300000 // 5 minutes
    )
  }

  // ───────────────────────────────────────
  // BACKEND HEALTH CHECK
  // Verifies backend is still responsive
  // ───────────────────────────────────────

  const checkBackendHealth = async () => {
    try {
      const response = await fetchWithTimeout(
        NDIC_CONFIG.BACKEND_URL +
        NDIC_CONFIG.ENDPOINTS.health,
        { method: 'GET' },
        5000
      )

      const healthy = response.ok
      const wasHealthy = STATE.meta.backendHealthy

      updateMeta({ backendHealthy: healthy })

      if (!wasHealthy && healthy) {
        logSystem(
          'INFO',
          'Backend connection restored'
        )
      } else if (wasHealthy && !healthy) {
        logSystem(
          'WARNING',
          'Backend connection degraded'
        )
      }

      return healthy

    } catch {
      updateMeta({ backendHealthy: false })
      return false
    }
  }

  // ───────────────────────────────────────
  // PERMISSION CHANGE MONITORING
  // Watches for permission status changes
  // ───────────────────────────────────────

  const initPermissionMonitoring = async () => {
    if (!navigator.permissions) return

    const permissionsToWatch = [
      'camera',
      'microphone',
      'geolocation',
      'notifications'
    ]

    for (const name of permissionsToWatch) {
      try {
        const status =
          await navigator.permissions.query({
            name: name
          })

        status.addEventListener('change', () => {
          logPermissionChange(
            name,
            status.state
          )

          // Re-run security engine
          // on permission change
          SecurityEngine.collect()
            .then(() => {
              ScoringEngine.compute()
            })
            .catch(() => {})
        })

      } catch {
        // Permission not watchable
      }
    }
  }

  // ───────────────────────────────────────
  // RESIZE HANDLER
  // Updates viewport data on resize
  // ───────────────────────────────────────

  const initResizeHandler = () => {
    DeviceEngine.initResizeListener()

    // Also update chart sizes
    window.addEventListener(
      'resize',
      debounce(() => {
        // Charts auto-resize via Chart.js
        // responsive: true option
        // D3 diagrams need manual resize
        if (
          typeof D3DiagramsViz !== 'undefined'
        ) {
          D3DiagramsViz.resize()
        }
      }, 300)
    )
  }

  // ───────────────────────────────────────
  // PAGE UNLOAD HANDLER
  // Cleans up all intervals and observers
  // ───────────────────────────────────────

  const initUnloadHandler = () => {
    window.addEventListener(
      'beforeunload',
      () => {
        // Stop all intervals
        if (uiRefreshInterval) {
          clearInterval(uiRefreshInterval)
        }
        if (countdownInterval) {
          clearInterval(countdownInterval)
        }
        if (ipRefreshInterval) {
          clearInterval(ipRefreshInterval)
        }

        // Stop network monitoring
        NetworkEngine.stopMonitoring()

        // Stop AI refresh
        AISummaryEngine.stopRefreshCycle()

        // Clean up speed observers
        SpeedEngine.cleanup()

        logSystem(
          'INFO',
          'Monitoring engine stopped — page unload'
        )
      }
    )
  }

  // ───────────────────────────────────────
  // DOCUMENT VISIBILITY HANDLER
  // Already handled by NetworkEngine
  // Here we add additional logic for
  // AI summaries and score refreshes
  // ───────────────────────────────────────

  const initDocumentVisibilityHandler = () => {
    document.addEventListener(
      'visibilitychange',
      () => {
        if (
          document.visibilityState === 'visible'
        ) {
          // Tab became visible
          // Run immediate refresh
          runUIRefresh()

          // Check if we need AI refresh
          const timeSinceAI =
            Date.now() -
            (new Date(
              STATE.summaries.lastUpdated || 0
            ).getTime())

          if (timeSinceAI > 60000) {
            AISummaryEngine
              .requestFullSummary()
              .catch(() => {})
          }

          logSystem(
            'INFO',
            'Tab visible — refreshing intelligence'
          )
        }
      }
    )
  }

  // ───────────────────────────────────────
  // NETWORK STATUS MONITOR
  // Extended online/offline handling
  // beyond what NetworkEngine provides
  // ───────────────────────────────────────

  const initNetworkStatusMonitor = () => {
    // Watch navigator.onLine
    const checkOnlineStatus = () => {
      const isOnline = navigator.onLine
      updateMeta({ isOnline: isOnline })
    }

    window.addEventListener(
      'online',
      checkOnlineStatus
    )
    window.addEventListener(
      'offline',
      checkOnlineStatus
    )

    // Initial check
    checkOnlineStatus()
  }

  // ───────────────────────────────────────
  // SCAN STATUS INDICATOR
  // Updates the header scan status
  // during active data collection
  // ───────────────────────────────────────

  const setScanStatus = (status) => {
    const statusDot = el('scan-status-dot')
    const statusText = el('scan-status-text')

    if (!statusDot || !statusText) return

    switch (status) {
      case 'scanning':
        statusDot.setAttribute(
          'data-status', 'scanning'
        )
        statusText.textContent = 'SCANNING'
        break
      case 'updating':
        statusDot.setAttribute(
          'data-status', 'updating'
        )
        statusText.textContent = 'UPDATING'
        break
      case 'live':
        statusDot.setAttribute(
          'data-status', 'active'
        )
        statusText.textContent = 'LIVE'
        break
      case 'offline':
        statusDot.setAttribute(
          'data-status', 'offline'
        )
        statusText.textContent = 'OFFLINE'
        break
      case 'degraded':
        statusDot.setAttribute(
          'data-status', 'degraded'
        )
        statusText.textContent = 'DEGRADED'
        break
    }
  }

  // ───────────────────────────────────────
  // LOADING SKELETON MANAGEMENT
  // Shows and hides loading states
  // per canvas as data arrives
  // ───────────────────────────────────────

  const showCanvasLoading = (canvasId) => {
    const canvas = el(canvasId)
    if (canvas) {
      canvas.classList.add('ndic-canvas-loading')
      canvas.classList.remove('ndic-canvas-loaded')
    }
  }

  const showCanvasLoaded = (canvasId) => {
    const canvas = el(canvasId)
    if (!canvas) return

    canvas.classList.add('ndic-canvas-loading')

    // Small delay then fade in
    setTimeout(() => {
      canvas.classList.remove(
        'ndic-canvas-loading'
      )
      canvas.classList.add('ndic-canvas-loaded')
    }, 300)
  }

  const initCanvasLoadingStates = () => {
    const canvases = [
      'canvas-1', 'canvas-2', 'canvas-3',
      'canvas-4', 'canvas-5', 'canvas-6',
      'canvas-7', 'canvas-8', 'canvas-9',
      'canvas-10', 'canvas-11', 'canvas-12'
    ]

    // Show loading on all canvases initially
    canvases.forEach(id => showCanvasLoading(id))
  }

  // ───────────────────────────────────────
  // STAGGERED CANVAS REVEAL
  // Reveals canvases as data arrives
  // Creates impression of live intelligence
  // being gathered in real time
  // ───────────────────────────────────────

  const revealCanvas = (canvasId) => {
    showCanvasLoaded(canvasId)
  }

  // ───────────────────────────────────────
  // MAIN INITIALIZATION
  // Called by core engine after all
  // other engines have started
  // ───────────────────────────────────────

  const initialize = async () => {
    if (isInitialized) return

    logSystem(
      'INFO',
      'Monitoring engine initializing'
    )

    // Show all canvases as loading
    initCanvasLoadingStates()

    // Set scanning status
    setScanStatus('scanning')

    // Initialize all event listeners
    initNetworkStatusMonitor()
    initResizeHandler()
    initUnloadHandler()
    initDocumentVisibilityHandler()

    // Initialize permission monitoring
    // async — does not block startup
    initPermissionMonitoring().catch(() => {})

    // Check backend health
    await checkBackendHealth()

    // Start UI refresh cycle
    uiRefreshInterval = setInterval(
      runUIRefresh,
      NDIC_CONFIG.INTERVALS.uiRefresh
    )

    // Start countdown timer
    startCountdownTimer()

    // Start IP refresh cycle
    startIPRefreshCycle()

    // Schedule backend health check
    // every 2 minutes
    setInterval(
      checkBackendHealth,
      120000
    )

    isInitialized = true

    logSystem(
      'INFO',
      'Monitoring engine initialized — ' +
      'all cycles active'
    )
  }

  // ───────────────────────────────────────
  // ENGINE COMPLETION CALLBACKS
  // Called by each engine when done
  // Triggers canvas reveal and rescoring
  // ───────────────────────────────────────

  const onEngineComplete = (engineName) => {
    logSystem(
      'INFO',
      `${engineName} engine data ready`
    )

    // Map engines to their canvases
    const engineCanvasMap = {
      device:      ['canvas-5'],
      graphics:    ['canvas-6'],
      capability:  ['canvas-8'],
      security:    ['canvas-7'],
      performance: ['canvas-9'],
      speed:       ['canvas-10'],
      network:     ['canvas-4'],
      ip:          ['canvas-1', 'canvas-2'],
      proxy:       ['canvas-3'],
      scoring:     ['canvas-11']
    }

    const canvases =
      engineCanvasMap[engineName] || []

    canvases.forEach(canvasId => {
      revealCanvas(canvasId)
    })

    // Canvas 12 live feed always visible
    revealCanvas('canvas-12')

    // Recompute scores when any
    // data engine completes
    const dataEngines = [
      'device', 'graphics', 'capability',
      'security', 'performance', 'speed',
      'network', 'ip', 'proxy'
    ]

    if (dataEngines.includes(engineName)) {
      ScoringEngine.compute()
    }

    // Check if all engines complete
    if (areAllEnginesComplete()) {
      setScanStatus('live')
      updateMeta({
        lastFullScan: new Date().toISOString()
      })

      logSystem(
        'INFO',
        'All engines complete — system live'
      )

      // Reveal scoreboard
      revealCanvas('canvas-11')
    }
  }

  return {
    initialize,
    onEngineComplete,
    runUIRefresh,
    setScanStatus,
    showCanvasLoading,
    showCanvasLoaded,
    revealCanvas,
    checkBackendHealth,
    updateAllScoreDisplays,
    updateHeader
  }

})()
