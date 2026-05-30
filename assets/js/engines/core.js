// ─────────────────────────────────────────
// CORE ENGINE
// The master orchestrator of the entire
// Intelreap intelligence system
// Initializes all engines in correct order
// Manages the full scan lifecycle
// ─────────────────────────────────────────

const CoreEngine = (() => {

  // ───────────────────────────────────────
  // INITIALIZATION GUARD
  // Prevents double initialization
  // ───────────────────────────────────────

  let initialized = false

  // ───────────────────────────────────────
  // PRE-FLIGHT CHECKS
  // Verifies critical dependencies
  // before starting the system
  // ───────────────────────────────────────

  const runPreFlightChecks = () => {
    const checks = []

    // Check NDIC_CONFIG loaded
    if (typeof NDIC_CONFIG === 'undefined') {
      checks.push('NDIC_CONFIG not loaded')
    }

    // Check STATE loaded
    if (typeof STATE === 'undefined') {
      checks.push('STATE not loaded')
    }

    // Check helper functions loaded
    if (typeof el === 'undefined') {
      checks.push('helpers.js not loaded')
    }

    // Check logger loaded
    if (typeof log === 'undefined') {
      checks.push('logger.js not loaded')
    }

    // Check engines loaded
    const engines = [
      'DeviceEngine',
      'GraphicsEngine',
      'CapabilityEngine',
      'SecurityEngine',
      'PerformanceEngine',
      'SpeedEngine',
      'NetworkEngine',
      'IPEngine',
      'ProxyEngine',
      'ScoringEngine',
      'AISummaryEngine',
      'MonitoringEngine'
    ]

    engines.forEach(engine => {
      if (typeof window[engine] === 'undefined') {
        checks.push(`${engine} not loaded`)
      }
    })

    return checks
  }

  // ───────────────────────────────────────
  // SET SCAN START TIME
  // ───────────────────────────────────────

  const setScanStartTime = () => {
    const now = new Date().toISOString()
    updateMeta({
      scanStartTime: now,
      initialized: true,
      backendUrl: NDIC_CONFIG.BACKEND_URL
    })
    logScanStart()
  }

  // ───────────────────────────────────────
  // PHASE 1 — INSTANT BROWSER ENGINES
  // These run synchronously or near
  // instantly using only browser APIs
  // No network calls required
  // All complete within milliseconds
  // ───────────────────────────────────────

  const runPhase1 = async () => {
    logSystem(
      'INFO',
      'Phase 1 starting — browser intelligence'
    )

    // Run all instant engines in parallel
    // Order does not matter here
    // All are independent of each other
    const phase1Results = await Promise.allSettled([

      // Device intelligence
      DeviceEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('device')
      }),

      // Graphics engine
      GraphicsEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('graphics')
      }),

      // Capability matrix
      CapabilityEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('capability')
      }),

      // Security and privacy
      SecurityEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('security')
      }),

      // Performance intelligence
      PerformanceEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('performance')
      }),

      // Speed and Core Web Vitals
      // Started but not awaited fully
      // Vitals collect over time
      SpeedEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('speed')
      }),

      // Network monitoring
      NetworkEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('network')
      })
    ])

    // Log any phase 1 failures
    phase1Results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logError(
          `Phase 1 engine ${index} failed: ` +
          result.reason?.message
        )
      }
    })

    logSystem(
      'INFO',
      'Phase 1 complete — browser intelligence ready'
    )

    return phase1Results
  }

  // ───────────────────────────────────────
  // PHASE 2 — INITIAL SCORING
  // Compute scores from Phase 1 data
  // Shows user partial scores immediately
  // while backend data loads
  // ───────────────────────────────────────

  const runPhase2 = () => {
    logSystem(
      'INFO',
      'Phase 2 starting — initial scoring'
    )

    ScoringEngine.compute()

    logSystem(
      'INFO',
      'Phase 2 complete — initial scores computed'
    )
  }

  // ───────────────────────────────────────
  // PHASE 3 — BACKEND ENRICHMENT
  // IP identity and deep intelligence
  // Proxy and VPN detection
  // These require network calls
  // Run in parallel for speed
  // ───────────────────────────────────────

  const runPhase3 = async () => {
    logSystem(
      'INFO',
      'Phase 3 starting — backend enrichment'
    )

    const phase3Results = await Promise.allSettled([

      // IP identity and deep intel
      // Both called inside IPEngine.collect()
      IPEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('ip')

        // Recompute scores with IP data
        ScoringEngine.compute()
      }),

      // Proxy and VPN detection
      // ProxyEngine waits for IP engine
      // internally before calling backend
      ProxyEngine.collect().then(() => {
        MonitoringEngine.onEngineComplete('proxy')

        // Recompute scores with proxy data
        ScoringEngine.compute()
      })
    ])

    phase3Results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logError(
          `Phase 3 engine ${index} failed: ` +
          result.reason?.message
        )
      }
    })

    logSystem(
      'INFO',
      'Phase 3 complete — backend enrichment done'
    )
  }

  // ───────────────────────────────────────
  // PHASE 4 — FINAL SCORING
  // Recompute with all data available
  // ───────────────────────────────────────

  const runPhase4 = () => {
    logSystem(
      'INFO',
      'Phase 4 starting — final scoring'
    )

    const scores = ScoringEngine.compute()
    MonitoringEngine.onEngineComplete('scoring')

    logSystem(
      'INFO',
      `Phase 4 complete — ` +
      `Global score: ${scores.globalScore}/100 — ` +
      `${scores.healthClassification}`
    )
  }

  // ───────────────────────────────────────
  // PHASE 5 — AI SUMMARIES
  // Generate all canvas summaries
  // Script summaries instant
  // AI summaries in background
  // ───────────────────────────────────────

  const runPhase5 = async () => {
    logSystem(
      'INFO',
      'Phase 5 starting — AI summaries'
    )

    // This is non-blocking
    // Script summaries appear instantly
    // AI summaries replace them as they arrive
    AISummaryEngine.collect()
      .catch(error => {
        logError(
          'AI summary collection error: ' +
          error.message
        )
      })

    logSystem(
      'INFO',
      'Phase 5 initiated — summaries generating'
    )
  }

  // ───────────────────────────────────────
  // PHASE 6 — CANVAS RENDERS
  // Trigger full render of all canvases
  // After all data is available
  // ───────────────────────────────────────

  const runPhase6 = () => {
    logSystem(
      'INFO',
      'Phase 6 starting — canvas renders'
    )

    const canvasRenderers = [
      'Canvas1', 'Canvas2', 'Canvas3',
      'Canvas4', 'Canvas5', 'Canvas6',
      'Canvas7', 'Canvas8', 'Canvas9',
      'Canvas10', 'Canvas11', 'Canvas12'
    ]

    canvasRenderers.forEach(rendererName => {
      const renderer = window[rendererName]
      if (
        renderer &&
        typeof renderer.render === 'function'
      ) {
        try {
          renderer.render()
        } catch (error) {
          logError(
            `${rendererName} render failed: ` +
            error.message
          )
        }
      }
    })

    logSystem(
      'INFO',
      'Phase 6 complete — all canvases rendered'
    )
  }

  // ───────────────────────────────────────
  // MAIN INITIALIZATION SEQUENCE
  // ───────────────────────────────────────

  const initialize = async () => {
    if (initialized) return

    // Run pre-flight checks
    const failures = runPreFlightChecks()
    if (failures.length > 0) {
      console.error(
        'Intelreap pre-flight failures:',
        failures
      )
      // Continue anyway with what we have
    }

    initialized = true

    // Set scan start time
    setScanStartTime()

    logSystem(
      'INFO',
      `Intelreap v${NDIC_CONFIG.VERSION} ` +
      `initializing...`
    )

    try {
      // Initialize monitoring engine first
      // Sets up all event listeners and
      // loading states before data arrives
      await MonitoringEngine.initialize()

      // PHASE 1 — Browser intelligence
      // Fast, no network required
      await runPhase1()

      // PHASE 2 — Initial scoring
      // Shows partial scores immediately
      runPhase2()

      // PHASE 3 — Backend enrichment
      // IP, ASN, proxy detection
      // Runs in parallel with Phase 4/5
      // via non-blocking approach below
      const phase3Promise = runPhase3()

      // PHASE 6 — Render what we have now
      // Canvases show browser data immediately
      // Will re-render when backend data arrives
      runPhase6()

      // Wait for backend enrichment
      await phase3Promise

      // PHASE 4 — Final scoring with all data
      runPhase4()

      // PHASE 5 — AI summaries
      // Non-blocking background process
      runPhase5()

      // Final full render with all data
      runPhase6()

      // Update meta
      updateMeta({
        lastFullScan: new Date().toISOString()
      })

      // Set status to live
      MonitoringEngine.setScanStatus('live')

      logSystem(
        'INFO',
        `Intelreap fully initialized — ` +
        `${STATE.meta.apiCallCount} API calls — ` +
        `${STATE.meta.errorCount} errors`
      )

    } catch (error) {
      logError(
        'Core engine initialization failed: ' +
        error.message
      )

      // Still try to show what we have
      MonitoringEngine.setScanStatus('degraded')
      runPhase6()
    }
  }

  // ───────────────────────────────────────
  // DOM READY HANDLER
  // Waits for DOM before initializing
  // ───────────────────────────────────────

  const onDOMReady = () => {
    if (
      document.readyState === 'loading'
    ) {
      document.addEventListener(
        'DOMContentLoaded',
        initialize
      )
    } else {
      // DOM already ready
      initialize()
    }
  }

  // ───────────────────────────────────────
  // AUTO START
  // Core engine starts automatically
  // when the script loads
  // ───────────────────────────────────────

  onDOMReady()

  return {
    initialize,
    runPhase1,
    runPhase2,
    runPhase3,
    runPhase4,
    runPhase5,
    runPhase6,
    runPreFlightChecks
  }

})()
