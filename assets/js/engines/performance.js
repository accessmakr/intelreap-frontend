// ─────────────────────────────────────────
// PERFORMANCE INTELLIGENCE ENGINE
// Powers Canvas 9 — Performance Intelligence
// Complete page load timing, resource
// analysis and performance scoring
// ─────────────────────────────────────────

const PerformanceEngine = (() => {

  // ───────────────────────────────────────
  // NAVIGATION TIMING COLLECTION
  // Uses Navigation Timing API Level 2
  // ───────────────────────────────────────

  const collectNavigationTiming = () => {
    const entries =
      performance.getEntriesByType('navigation')

    if (!entries || entries.length === 0) {
      // Fall back to deprecated API
      return collectLegacyTiming()
    }

    const nav = entries[0]

    // All values in milliseconds
    // Relative to navigation start
    const dnsLookup = Math.round(
      nav.domainLookupEnd -
      nav.domainLookupStart
    )

    const tcpConnection = Math.round(
      nav.connectEnd -
      nav.connectStart
    )

    // TLS handshake only on HTTPS
    const tlsHandshake =
      nav.secureConnectionStart > 0
        ? Math.round(
            nav.connectEnd -
            nav.secureConnectionStart
          )
        : 0

    const ttfb = Math.round(
      nav.responseStart -
      nav.requestStart
    )

    const requestTime = Math.round(
      nav.responseStart -
      nav.requestStart
    )

    const responseTime = Math.round(
      nav.responseEnd -
      nav.responseStart
    )

    const domProcessing = Math.round(
      nav.domComplete -
      nav.responseEnd
    )

    const domInteractive = Math.round(
      nav.domInteractive -
      nav.startTime
    )

    const domContentLoaded = Math.round(
      nav.domContentLoadedEventEnd -
      nav.startTime
    )

    const pageLoadTime = Math.round(
      nav.loadEventEnd -
      nav.startTime
    )

    const resourceFetchTime = Math.round(
      nav.responseEnd -
      nav.fetchStart
    )

    // Redirect time
    const redirectTime =
      nav.redirectEnd > 0
        ? Math.round(
            nav.redirectEnd -
            nav.redirectStart
          )
        : 0

    // Service worker time
    const serviceWorkerTime =
      nav.workerStart > 0
        ? Math.round(
            nav.fetchStart -
            nav.workerStart
          )
        : 0

    // Unload time
    const unloadTime =
      nav.unloadEventEnd > 0
        ? Math.round(
            nav.unloadEventEnd -
            nav.unloadEventStart
          )
        : 0

    return {
      dnsLookup:         Math.max(0, dnsLookup),
      tcpConnection:     Math.max(0, tcpConnection),
      tlsHandshake:      Math.max(0, tlsHandshake),
      ttfb:              Math.max(0, ttfb),
      requestTime:       Math.max(0, requestTime),
      responseTime:      Math.max(0, responseTime),
      domProcessing:     Math.max(0, domProcessing),
      domInteractive:    Math.max(0, domInteractive),
      domContentLoaded:  Math.max(0, domContentLoaded),
      pageLoadTime:      Math.max(0, pageLoadTime),
      resourceFetchTime: Math.max(0, resourceFetchTime),
      redirectTime:      Math.max(0, redirectTime),
      serviceWorkerTime: serviceWorkerTime,
      unloadTime:        unloadTime,
      transferSize:      nav.transferSize || 0,
      encodedBodySize:   nav.encodedBodySize || 0,
      decodedBodySize:   nav.decodedBodySize || 0,
      nextHopProtocol:   nav.nextHopProtocol || null,
      initiatorType:     nav.initiatorType || 'navigation',
      source:            'navigation-timing-2'
    }
  }

  // Legacy Navigation Timing API fallback
  const collectLegacyTiming = () => {
    const timing = performance.timing

    if (!timing) {
      return {
        dnsLookup: null,
        tcpConnection: null,
        tlsHandshake: null,
        ttfb: null,
        requestTime: null,
        responseTime: null,
        domProcessing: null,
        domInteractive: null,
        domContentLoaded: null,
        pageLoadTime: null,
        resourceFetchTime: null,
        source: 'unavailable'
      }
    }

    const start = timing.navigationStart

    return {
      dnsLookup: Math.max(0, Math.round(
        timing.domainLookupEnd -
        timing.domainLookupStart
      )),
      tcpConnection: Math.max(0, Math.round(
        timing.connectEnd -
        timing.connectStart
      )),
      tlsHandshake: timing.secureConnectionStart > 0
        ? Math.max(0, Math.round(
            timing.connectEnd -
            timing.secureConnectionStart
          ))
        : 0,
      ttfb: Math.max(0, Math.round(
        timing.responseStart -
        timing.requestStart
      )),
      requestTime: Math.max(0, Math.round(
        timing.responseStart -
        timing.requestStart
      )),
      responseTime: Math.max(0, Math.round(
        timing.responseEnd -
        timing.responseStart
      )),
      domProcessing: Math.max(0, Math.round(
        timing.domComplete -
        timing.responseEnd
      )),
      domInteractive: Math.max(0, Math.round(
        timing.domInteractive - start
      )),
      domContentLoaded: Math.max(0, Math.round(
        timing.domContentLoadedEventEnd - start
      )),
      pageLoadTime: Math.max(0, Math.round(
        timing.loadEventEnd - start
      )),
      resourceFetchTime: Math.max(0, Math.round(
        timing.responseEnd -
        timing.fetchStart
      )),
      source: 'navigation-timing-1'
    }
  }

  // ───────────────────────────────────────
  // RESOURCE ANALYSIS
  // Analyses all loaded resources
  // ───────────────────────────────────────

  const analyzeResources = () => {
    const resources =
      performance.getEntriesByType('resource')

    if (!resources || resources.length === 0) {
      return {
        resourceCount: 0,
        pageWeight: 0,
        scriptCount: 0,
        stylesheetCount: 0,
        imageCount: 0,
        fontCount: 0,
        fetchCount: 0,
        xhrCount: 0,
        otherCount: 0,
        cacheHitCount: 0,
        cacheHitRate: 0,
        slowestResource: null,
        largestResource: null,
        totalTransferSize: 0,
        totalDecodedSize: 0
      }
    }

    let scriptCount = 0
    let stylesheetCount = 0
    let imageCount = 0
    let fontCount = 0
    let fetchCount = 0
    let xhrCount = 0
    let otherCount = 0
    let cacheHitCount = 0
    let totalTransferSize = 0
    let totalDecodedSize = 0
    let slowestResource = null
    let largestResource = null
    let slowestDuration = 0
    let largestSize = 0

    for (const resource of resources) {
      // Count by type
      switch (resource.initiatorType) {
        case 'script':
          scriptCount++
          break
        case 'css':
        case 'link':
          if (
            resource.name.includes('.css') ||
            resource.initiatorType === 'css'
          ) {
            stylesheetCount++
          }
          break
        case 'img':
        case 'image':
          imageCount++
          break
        case 'font':
          fontCount++
          break
        case 'fetch':
          fetchCount++
          break
        case 'xmlhttprequest':
          xhrCount++
          break
        default:
          otherCount++
      }

      // Cache detection
      // transferSize 0 with decodedBodySize > 0
      // indicates cache hit
      if (
        resource.transferSize === 0 &&
        resource.decodedBodySize > 0
      ) {
        cacheHitCount++
      }

      // Size tracking
      totalTransferSize +=
        resource.transferSize || 0
      totalDecodedSize +=
        resource.decodedBodySize || 0

      // Slowest resource
      const duration =
        resource.responseEnd -
        resource.startTime
      if (duration > slowestDuration) {
        slowestDuration = duration
        slowestResource = {
          name: resource.name,
          duration: Math.round(duration),
          type: resource.initiatorType
        }
      }

      // Largest resource
      if (
        resource.decodedBodySize > largestSize
      ) {
        largestSize = resource.decodedBodySize
        largestResource = {
          name: resource.name,
          size: resource.decodedBodySize,
          type: resource.initiatorType
        }
      }
    }

    const cacheHitRate = resources.length > 0
      ? Math.round(
          (cacheHitCount / resources.length) * 100
        )
      : 0

    const pageWeight = totalDecodedSize > 0
      ? totalDecodedSize
      : totalTransferSize

    return {
      resourceCount: resources.length,
      pageWeight: pageWeight,
      pageWeightKB: Math.round(
        pageWeight / 1024
      ),
      scriptCount,
      stylesheetCount,
      imageCount,
      fontCount,
      fetchCount,
      xhrCount,
      otherCount,
      cacheHitCount,
      cacheHitRate,
      totalTransferSize,
      totalDecodedSize,
      slowestResource,
      largestResource
    }
  }

  // ───────────────────────────────────────
  // RUNTIME PERFORMANCE MEASUREMENT
  // Measures current JS thread responsiveness
  // ───────────────────────────────────────

  const measureRuntimePerformance = () => {
    return new Promise((resolve) => {
      const iterations = 100000
      const start = performance.now()

      // CPU bound operation
      let result = 0
      for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i)
      }

      const duration = performance.now() - start

      // Score: faster = higher score
      // Under 10ms = 100
      // Over 100ms = 0
      const score = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            100 - ((duration - 10) / 90) * 100
          )
        )
      )

      resolve({
        runtimeScore: score,
        runtimeDurationMs: Math.round(duration),
        result: result // Prevent optimization
      })
    })
  }

  // ───────────────────────────────────────
  // MEMORY USAGE DETECTION
  // Chrome only via performance.memory
  // ───────────────────────────────────────

  const detectMemoryUsage = () => {
    if (!performance.memory) {
      return {
        jsHeapUsed: null,
        jsHeapTotal: null,
        jsHeapLimit: null,
        memoryAvailable: false
      }
    }

    return {
      jsHeapUsed: Math.round(
        performance.memory.usedJSHeapSize /
        1024 / 1024
      ),
      jsHeapTotal: Math.round(
        performance.memory.totalJSHeapSize /
        1024 / 1024
      ),
      jsHeapLimit: Math.round(
        performance.memory.jsHeapSizeLimit /
        1024 / 1024
      ),
      memoryAvailable: true
    }
  }

  // ───────────────────────────────────────
  // PERFORMANCE SCORE COMPUTATION
  // ───────────────────────────────────────

  const computePerformanceScore = (timing) => {
    if (!timing.pageLoadTime) return 0

    const loadTime = timing.pageLoadTime
    const ttfb = timing.ttfb || 0
    const domReady = timing.domContentLoaded || 0

    // Load time score (40 points)
    let loadScore = 0
    if (loadTime <= 500) loadScore = 40
    else if (loadTime <= 1000) loadScore = 35
    else if (loadTime <= 2000) loadScore = 28
    else if (loadTime <= 3000) loadScore = 20
    else if (loadTime <= 5000) loadScore = 12
    else loadScore = 5

    // TTFB score (30 points)
    let ttfbScore = 0
    if (ttfb <= 100) ttfbScore = 30
    else if (ttfb <= 200) ttfbScore = 25
    else if (ttfb <= 400) ttfbScore = 18
    else if (ttfb <= 800) ttfbScore = 12
    else if (ttfb <= 1800) ttfbScore = 6
    else ttfbScore = 2

    // DOM ready score (30 points)
    let domScore = 0
    if (domReady <= 500) domScore = 30
    else if (domReady <= 1000) domScore = 25
    else if (domReady <= 2000) domScore = 18
    else if (domReady <= 3000) domScore = 12
    else if (domReady <= 5000) domScore = 6
    else domScore = 2

    return Math.min(
      100,
      loadScore + ttfbScore + domScore
    )
  }

  // ───────────────────────────────────────
  // PERFORMANCE PERCENTILE
  // ───────────────────────────────────────

  const computePerformancePercentile = (
    pageLoadTime
  ) => {
    return getPerformancePercentile(pageLoadTime)
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'Performance engine collecting'
    )

    // Wait for load event to complete
    // if page is still loading
    const waitForLoad = () => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve()
        } else {
          window.addEventListener(
            'load',
            resolve,
            { once: true }
          )
        }
      })
    }

    await waitForLoad()

    // Small delay to ensure all
    // timing data is available
    await sleep(100)

    // Collect all performance data
    const timingData = collectNavigationTiming()
    const resourceData = analyzeResources()
    const memoryData = detectMemoryUsage()
    const runtimeData =
      await measureRuntimePerformance()

    // Compute scores
    const performanceScore =
      computePerformanceScore(timingData)
    const percentileRating =
      computePerformancePercentile(
        timingData.pageLoadTime
      )

    const performanceData = {
      // Navigation timing
      pageLoadTime: timingData.pageLoadTime,
      domContentLoaded:
        timingData.domContentLoaded,
      domInteractive: timingData.domInteractive,
      ttfb: timingData.ttfb,
      dnsLookup: timingData.dnsLookup,
      tcpConnection: timingData.tcpConnection,
      tlsHandshake: timingData.tlsHandshake,
      requestTime: timingData.requestTime,
      responseTime: timingData.responseTime,
      domProcessing: timingData.domProcessing,
      resourceFetchTime:
        timingData.resourceFetchTime,
      redirectTime: timingData.redirectTime,
      serviceWorkerTime:
        timingData.serviceWorkerTime,
      unloadTime: timingData.unloadTime,
      nextHopProtocol: timingData.nextHopProtocol,
      transferSize: timingData.transferSize,
      encodedBodySize: timingData.encodedBodySize,
      decodedBodySize: timingData.decodedBodySize,
      timingSource: timingData.source,

      // Resource analysis
      resourceCount: resourceData.resourceCount,
      pageWeight: resourceData.pageWeight,
      pageWeightKB: resourceData.pageWeightKB,
      scriptCount: resourceData.scriptCount,
      stylesheetCount: resourceData.stylesheetCount,
      imageCount: resourceData.imageCount,
      fontCount: resourceData.fontCount,
      fetchCount: resourceData.fetchCount,
      xhrCount: resourceData.xhrCount,
      cacheHitCount: resourceData.cacheHitCount,
      cacheHitRate: resourceData.cacheHitRate,
      slowestResource: resourceData.slowestResource,
      largestResource: resourceData.largestResource,
      totalTransferSize:
        resourceData.totalTransferSize,

      // Memory
      jsHeapUsed: memoryData.jsHeapUsed,
      jsHeapTotal: memoryData.jsHeapTotal,
      jsHeapLimit: memoryData.jsHeapLimit,
      memoryAvailable: memoryData.memoryAvailable,

      // Runtime
      runtimeScore: runtimeData.runtimeScore,
      runtimeDurationMs:
        runtimeData.runtimeDurationMs,

      // Computed scores
      performanceScore: performanceScore,
      percentileRating: percentileRating
    }

    // Update STATE
    updatePerformance(performanceData)
    markEngineComplete('performance')

    logPerformance(
      'INFO',
      `Page loaded in ${performanceData.pageLoadTime}ms — ` +
      `TTFB: ${performanceData.ttfb}ms — ` +
      `Score: ${performanceScore} — ` +
      `${percentileRating}`
    )

    return performanceData
  }

  return {
    collect,
    collectNavigationTiming,
    analyzeResources,
    measureRuntimePerformance,
    computePerformanceScore,
    computePerformancePercentile
  }

})()
