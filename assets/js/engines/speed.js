// ─────────────────────────────────────────
// SPEED INTELLIGENCE ENGINE
// Powers Canvas 10 — Browser & Rendering
// Speed Intelligence
// Complete Core Web Vitals collection,
// browser benchmarking and device comparison
// ─────────────────────────────────────────

const SpeedEngine = (() => {

  // ───────────────────────────────────────
  // CORE WEB VITALS COLLECTION
  // Uses PerformanceObserver API
  // Official Google metrics
  // ───────────────────────────────────────

  // Collected vitals storage
  const vitals = {
    lcp: null,
    fcp: null,
    cls: null,
    inp: null,
    ttfb: null,
    fid: null
  }

  // Observers storage for cleanup
  const observers = []

  // Observe LCP — Largest Contentful Paint
  const observeLCP = () => {
    return new Promise((resolve) => {
      if (!PerformanceObserver) {
        resolve(null)
        return
      }

      let lcpValue = null
      const timeout = setTimeout(
        () => resolve(lcpValue),
        10000
      )

      try {
        const observer = new PerformanceObserver(
          (list) => {
            const entries = list.getEntries()
            const last =
              entries[entries.length - 1]
            if (last) {
              lcpValue = Math.round(
                last.startTime
              )
            }
          }
        )

        observer.observe({
          type: 'largest-contentful-paint',
          buffered: true
        })

        observers.push(observer)

        // LCP finalizes on user interaction
        // or page hidden
        const finalize = () => {
          clearTimeout(timeout)
          observer.disconnect()
          resolve(lcpValue)
        }

        document.addEventListener(
          'visibilitychange',
          () => {
            if (document.visibilityState ===
              'hidden') finalize()
          },
          { once: true }
        )

        // Also resolve after 5 seconds
        // if no interaction
        setTimeout(() => {
          if (lcpValue !== null) finalize()
        }, 5000)

      } catch {
        clearTimeout(timeout)
        resolve(null)
      }
    })
  }

  // Observe FCP — First Contentful Paint
  const observeFCP = () => {
    return new Promise((resolve) => {
      if (!PerformanceObserver) {
        // Try performance.getEntriesByName
        const fcpEntry =
          performance.getEntriesByName(
            'first-contentful-paint'
          )
        if (fcpEntry.length > 0) {
          resolve(Math.round(
            fcpEntry[0].startTime
          ))
        } else {
          resolve(null)
        }
        return
      }

      try {
        const observer = new PerformanceObserver(
          (list) => {
            const entries = list.getEntries()
            for (const entry of entries) {
              if (entry.name ===
                'first-contentful-paint') {
                observer.disconnect()
                resolve(Math.round(
                  entry.startTime
                ))
                return
              }
            }
          }
        )

        observer.observe({
          type: 'paint',
          buffered: true
        })

        observers.push(observer)

        setTimeout(() => resolve(null), 10000)

      } catch {
        resolve(null)
      }
    })
  }

  // Observe CLS — Cumulative Layout Shift
  const observeCLS = () => {
    return new Promise((resolve) => {
      if (!PerformanceObserver) {
        resolve(null)
        return
      }

      let clsValue = 0
      let sessionValue = 0
      let sessionEntries = []

      try {
        const observer = new PerformanceObserver(
          (list) => {
            for (const entry of list.getEntries()) {
              // Only count unexpected shifts
              if (!entry.hadRecentInput) {
                const firstSessionEntry =
                  sessionEntries[0]
                const lastSessionEntry =
                  sessionEntries[
                    sessionEntries.length - 1
                  ]

                if (
                  sessionValue &&
                  entry.startTime -
                  lastSessionEntry.startTime < 1000 &&
                  entry.startTime -
                  firstSessionEntry.startTime < 5000
                ) {
                  sessionValue += entry.value
                  sessionEntries.push(entry)
                } else {
                  sessionValue = entry.value
                  sessionEntries = [entry]
                }

                if (sessionValue > clsValue) {
                  clsValue = sessionValue
                }
              }
            }
          }
        )

        observer.observe({
          type: 'layout-shift',
          buffered: true
        })

        observers.push(observer)

        // CLS is measured at page hide
        document.addEventListener(
          'visibilitychange',
          () => {
            if (
              document.visibilityState === 'hidden'
            ) {
              observer.disconnect()
              resolve(
                parseFloat(clsValue.toFixed(4))
              )
            }
          },
          { once: true }
        )

        // Resolve after 10 seconds
        setTimeout(() => {
          observer.disconnect()
          resolve(
            parseFloat(clsValue.toFixed(4))
          )
        }, 10000)

      } catch {
        resolve(null)
      }
    })
  }

  // Observe INP — Interaction to Next Paint
  const observeINP = () => {
    return new Promise((resolve) => {
      if (!PerformanceObserver) {
        resolve(null)
        return
      }

      let inpValue = 0

      try {
        const observer = new PerformanceObserver(
          (list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > inpValue) {
                inpValue = entry.duration
              }
            }
          }
        )

        observer.observe({
          type: 'event',
          buffered: true,
          durationThreshold: 16
        })

        observers.push(observer)

        // Resolve after 10 seconds
        setTimeout(() => {
          observer.disconnect()
          resolve(
            inpValue > 0
              ? Math.round(inpValue)
              : null
          )
        }, 10000)

      } catch {
        resolve(null)
      }
    })
  }

  // Observe FID — First Input Delay
  const observeFID = () => {
    return new Promise((resolve) => {
      if (!PerformanceObserver) {
        resolve(null)
        return
      }

      try {
        const observer = new PerformanceObserver(
          (list) => {
            const entries = list.getEntries()
            if (entries.length > 0) {
              const fid = entries[0]
              observer.disconnect()
              resolve(Math.round(
                fid.processingStart -
                fid.startTime
              ))
            }
          }
        )

        observer.observe({
          type: 'first-input',
          buffered: true
        })

        observers.push(observer)

        setTimeout(() => resolve(null), 15000)

      } catch {
        resolve(null)
      }
    })
  }

  // Get TTFB from navigation timing
  const getTTFB = () => {
    try {
      const entries =
        performance.getEntriesByType('navigation')
      if (entries.length > 0) {
        const nav = entries[0]
        return Math.round(
          nav.responseStart - nav.requestStart
        )
      }
      // Legacy fallback
      if (performance.timing) {
        return Math.round(
          performance.timing.responseStart -
          performance.timing.requestStart
        )
      }
    } catch {
      // Continue
    }
    return null
  }

  // ───────────────────────────────────────
  // VITAL RATING
  // Based on Google official thresholds
  // ───────────────────────────────────────

  const rateVital = (metric, value) => {
    if (value === null || value === undefined) {
      return 'Unknown'
    }
    return getVitalRating(metric, value)
  }

  // ───────────────────────────────────────
  // BROWSER BENCHMARKS
  // ───────────────────────────────────────

  // JavaScript execution speed
  const benchmarkJSExecution = () => {
    const start = performance.now()
    const iterations = 1000000

    let result = 0
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) *
        Math.sin(i) *
        Math.cos(i)
    }

    const duration = performance.now() - start

    // Score: under 50ms = 100, over 500ms = 0
    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 - ((duration - 50) / 450) * 100
        )
      )
    )

    return {
      jsExecutionScore: score,
      jsExecutionMs: Math.round(duration),
      _prevent: result
    }
  }

  // DOM manipulation speed
  const benchmarkDOMManipulation = () => {
    const start = performance.now()
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    const count = 1000

    // Create elements
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      el.className = `ndic-bench-${i}`
      el.textContent = `item-${i}`
      el.setAttribute('data-index', i)
      container.appendChild(el)
    }

    // Read and modify
    for (let i = 0; i < count; i++) {
      const el = container.children[i]
      if (el) {
        el.style.color = `rgb(${i % 255}, 0, 0)`
        const _ = el.offsetHeight
      }
    }

    // Remove all
    container.innerHTML = ''
    document.body.removeChild(container)

    const duration = performance.now() - start

    // Score: under 20ms = 100, over 200ms = 0
    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 - ((duration - 20) / 180) * 100
        )
      )
    )

    return {
      domManipulationScore: score,
      domManipulationMs: Math.round(duration)
    }
  }

  // Canvas rendering speed
  const benchmarkCanvasRender = () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 500
      canvas.height = 500
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        return {
          canvasRenderScore: null,
          canvasRenderMs: null
        }
      }

      const start = performance.now()
      const shapes = 1000

      // Draw complex shapes
      for (let i = 0; i < shapes; i++) {
        const x = Math.random() * 500
        const y = Math.random() * 500
        const r = Math.random() * 30 + 5

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${i % 360},` +
          `70%,50%,0.7)`
        ctx.fill()

        // Also draw some rectangles
        ctx.fillStyle = `rgba(${i % 255},` +
          `${(i * 2) % 255},128,0.5)`
        ctx.fillRect(
          Math.random() * 470,
          Math.random() * 470,
          30, 30
        )
      }

      // Text rendering
      ctx.font = '14px sans-serif'
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < 50; i++) {
        ctx.fillText(
          'Intelreap',
          Math.random() * 450,
          Math.random() * 490
        )
      }

      const duration = performance.now() - start

      // Score: under 10ms = 100, over 100ms = 0
      const score = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            100 - ((duration - 10) / 90) * 100
          )
        )
      )

      return {
        canvasRenderScore: score,
        canvasRenderMs: Math.round(duration)
      }

    } catch {
      return {
        canvasRenderScore: null,
        canvasRenderMs: null
      }
    }
  }

  // Memory access speed
  const benchmarkMemoryAccess = () => {
    const start = performance.now()
    const size = 1000000
    const arr = new Float64Array(size)

    // Write
    for (let i = 0; i < size; i++) {
      arr[i] = i * 1.5
    }

    // Read and compute
    let sum = 0
    for (let i = 0; i < size; i++) {
      sum += arr[i]
    }

    const duration = performance.now() - start

    // Score: under 20ms = 100, over 200ms = 0
    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 - ((duration - 20) / 180) * 100
        )
      )
    )

    return {
      memoryAccessScore: score,
      memoryAccessMs: Math.round(duration),
      _sum: sum
    }
  }

  // CSS animation performance
  const benchmarkCSSAnimation = () => {
    return new Promise((resolve) => {
      try {
        const container =
          document.createElement('div')
        container.style.cssText =
          'position:fixed;top:-9999px;' +
          'left:-9999px;width:100px;height:100px;' +
          'overflow:hidden;'

        // Create animated elements
        const elements = []
        for (let i = 0; i < 50; i++) {
          const el = document.createElement('div')
          el.style.cssText =
            `width:10px;height:10px;` +
            `background:hsl(${i * 7},70%,50%);` +
            `position:absolute;` +
            `animation:ndic-bench-spin 0.1s ` +
            `linear infinite;`
          container.appendChild(el)
          elements.push(el)
        }

        // Inject animation keyframe
        const style = document.createElement('style')
        style.textContent =
          '@keyframes ndic-bench-spin {' +
          'from{transform:rotate(0deg) translateX(20px)}' +
          'to{transform:rotate(360deg) translateX(20px)}}'
        document.head.appendChild(style)
        document.body.appendChild(container)

        // Measure frame rate over 500ms
        let frameCount = 0
        let lastTime = performance.now()
        const frameTimes = []

        const measureFrame = (timestamp) => {
          frameCount++
          frameTimes.push(
            timestamp - lastTime
          )
          lastTime = timestamp

          if (
            timestamp - frameTimes[0] < 500 &&
            frameCount < 60
          ) {
            requestAnimationFrame(measureFrame)
          } else {
            // Cleanup
            document.body.removeChild(container)
            document.head.removeChild(style)

            const avgFrameTime =
              frameTimes.reduce(
                (a, b) => a + b, 0
              ) / frameTimes.length

            const fps = Math.round(
              1000 / avgFrameTime
            )

            // Score based on FPS
            const score = Math.max(
              0,
              Math.min(
                100,
                Math.round((fps / 60) * 100)
              )
            )

            resolve({
              cssAnimationScore: score,
              cssAnimationFPS: fps,
              avgFrameTimeMs: Math.round(
                avgFrameTime
              )
            })
          }
        }

        requestAnimationFrame(measureFrame)

      } catch {
        resolve({
          cssAnimationScore: null,
          cssAnimationFPS: null,
          avgFrameTimeMs: null
        })
      }
    })
  }

  // Event loop responsiveness
  const benchmarkEventLoop = () => {
    return new Promise((resolve) => {
      const measurements = []
      let count = 0
      const target = 10

      const measure = () => {
        const start = performance.now()
        setTimeout(() => {
          const delay =
            performance.now() - start
          measurements.push(delay)
          count++

          if (count < target) {
            measure()
          } else {
            const avg = measurements.reduce(
              (a, b) => a + b, 0
            ) / measurements.length

            // Score: under 1ms = 100, over 20ms = 0
            const score = Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  100 - ((avg - 1) / 19) * 100
                )
              )
            )

            resolve({
              eventLoopScore: score,
              eventLoopAvgMs: Math.round(avg * 100)
                / 100,
              eventLoopMeasurements: measurements
            })
          }
        }, 0)
      }

      measure()
    })
  }

  // ───────────────────────────────────────
  // OVERALL BENCHMARK SCORE
  // ───────────────────────────────────────

  const computeBenchmarkScore = (results) => {
    const weights = {
      jsExecutionScore:    30,
      domManipulationScore: 20,
      canvasRenderScore:   20,
      memoryAccessScore:   15,
      cssAnimationScore:   10,
      eventLoopScore:       5
    }

    let totalWeight = 0
    let earnedScore = 0

    for (const [key, weight] of
      Object.entries(weights)
    ) {
      if (
        results[key] !== null &&
        results[key] !== undefined
      ) {
        earnedScore += results[key] * weight
        totalWeight += weight
      }
    }

    if (totalWeight === 0) return 0

    return Math.round(
      earnedScore / totalWeight
    )
  }

  // ───────────────────────────────────────
  // DEVICE COMPARISONS
  // Baseline benchmark scores for
  // common device categories
  // ───────────────────────────────────────

  const DEVICE_BASELINES = {
    // Average mid-range Android
    // Snapdragon 695 equivalent
    averageMobile: {
      jsExecution:    55,
      domManipulation: 60,
      canvasRender:   50,
      memoryAccess:   55,
      overall:        55
    },
    // Average mid-range desktop
    // Intel Core i5-10th gen equivalent
    averageDesktop: {
      jsExecution:    78,
      domManipulation: 80,
      canvasRender:   75,
      memoryAccess:   78,
      overall:        78
    },
    // High-end device
    // Apple M3 MacBook Pro equivalent
    topTier: {
      jsExecution:    95,
      domManipulation: 95,
      canvasRender:   94,
      memoryAccess:   96,
      overall:        95
    }
  }

  const computeDeviceComparisons = (
    benchmarkScore
  ) => {
    const vsAvgMobile = benchmarkScore >=
      DEVICE_BASELINES.averageMobile.overall
      ? `${Math.round(
          ((benchmarkScore -
            DEVICE_BASELINES.averageMobile.overall) /
           DEVICE_BASELINES.averageMobile.overall)
          * 100
        )}% faster`
      : `${Math.round(
          ((DEVICE_BASELINES.averageMobile.overall -
            benchmarkScore) /
           DEVICE_BASELINES.averageMobile.overall)
          * 100
        )}% slower`

    const vsAvgDesktop = benchmarkScore >=
      DEVICE_BASELINES.averageDesktop.overall
      ? `${Math.round(
          ((benchmarkScore -
            DEVICE_BASELINES.averageDesktop.overall) /
           DEVICE_BASELINES.averageDesktop.overall)
          * 100
        )}% faster`
      : `${Math.round(
          ((DEVICE_BASELINES.averageDesktop.overall -
            benchmarkScore) /
           DEVICE_BASELINES.averageDesktop.overall)
          * 100
        )}% slower`

    const vsTopTier = benchmarkScore >=
      DEVICE_BASELINES.topTier.overall
      ? 'Top tier performance'
      : `${Math.round(
          ((DEVICE_BASELINES.topTier.overall -
            benchmarkScore) /
           DEVICE_BASELINES.topTier.overall)
          * 100
        )}% below top tier`

    // Percentile ranking
    let percentileRanking
    if (benchmarkScore >= 90) {
      percentileRanking = 'Top 5%'
    } else if (benchmarkScore >= 78) {
      percentileRanking = 'Top 25%'
    } else if (benchmarkScore >= 55) {
      percentileRanking = 'Top 50%'
    } else if (benchmarkScore >= 35) {
      percentileRanking = 'Bottom 30%'
    } else {
      percentileRanking = 'Bottom 10%'
    }

    return {
      vsAverageMobile: vsAvgMobile,
      vsAverageDesktop: vsAvgDesktop,
      vsTopTier: vsTopTier,
      percentileRanking: percentileRanking
    }
  }

  // ───────────────────────────────────────
  // SPEED SCORE COMPUTATION
  // Combines vitals and benchmarks
  // ───────────────────────────────────────

  const computeSpeedScore = (
    vitalsData,
    benchmarkScore
  ) => {
    let vitalScore = 0
    let vitalCount = 0

    // Rate each vital 0-100
    const vitalScores = {}

    const vitalMetrics = [
      { key: 'lcp', metric: 'lcp', good: 2500, poor: 4000 },
      { key: 'fcp', metric: 'fcp', good: 1800, poor: 3000 },
      { key: 'ttfb', metric: 'ttfb', good: 800, poor: 1800 },
      { key: 'inp', metric: 'inp', good: 200, poor: 500 },
      { key: 'fid', metric: 'fid', good: 100, poor: 300 }
    ]

    for (const { key, metric, good, poor } of
      vitalMetrics
    ) {
      const value = vitalsData[key]
      if (value !== null && value !== undefined) {
        let score
        if (metric === 'cls') {
          score = value <= 0.1 ? 100
            : value <= 0.25 ? 50
            : 0
        } else {
          score = value <= good ? 100
            : value >= poor ? 0
            : Math.round(
                100 - ((value - good) /
                  (poor - good)) * 100
              )
        }
        vitalScores[key] = score
        vitalScore += score
        vitalCount++
      }
    }

    const avgVitalScore = vitalCount > 0
      ? Math.round(vitalScore / vitalCount)
      : 0

    // Weight vitals 60%, benchmarks 40%
    const speedScore = Math.round(
      avgVitalScore * 0.6 +
      benchmarkScore * 0.4
    )

    return Math.min(100, Math.max(0, speedScore))
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem('INFO', 'Speed engine collecting')

    // Start vital observers early
    // They need time to collect data
    const [lcpPromise, fcpPromise,
           clsPromise, inpPromise,
           fidPromise] = [
      observeLCP(),
      observeFCP(),
      observeCLS(),
      observeINP(),
      observeFID()
    ]

    // Get TTFB immediately from navigation
    const ttfbValue = getTTFB()

    // Run synchronous benchmarks
    const jsResult = benchmarkJSExecution()
    const domResult = benchmarkDOMManipulation()
    const canvasResult = benchmarkCanvasRender()
    const memoryResult = benchmarkMemoryAccess()

    // Run async benchmarks in parallel
    // with vital collection
    const [
      lcpValue, fcpValue, clsValue,
      inpValue, fidValue,
      cssResult, eventLoopResult
    ] = await Promise.all([
      lcpPromise,
      fcpPromise,
      clsPromise,
      inpPromise,
      fidPromise,
      benchmarkCSSAnimation(),
      benchmarkEventLoop()
    ])

    // Compute vital ratings
    const lcpRating = rateVital('lcp', lcpValue)
    const fcpRating = rateVital('fcp', fcpValue)
    const clsRating = rateVital('cls', clsValue)
    const inpRating = rateVital('inp', inpValue)
    const ttfbRating = rateVital('ttfb', ttfbValue)
    const fidRating = rateVital('fid', fidValue)

    // Compute benchmark score
    const allBenchmarks = {
      jsExecutionScore: jsResult.jsExecutionScore,
      domManipulationScore:
        domResult.domManipulationScore,
      canvasRenderScore:
        canvasResult.canvasRenderScore,
      memoryAccessScore:
        memoryResult.memoryAccessScore,
      cssAnimationScore:
        cssResult.cssAnimationScore,
      eventLoopScore: eventLoopResult.eventLoopScore
    }

    const benchmarkScore =
      computeBenchmarkScore(allBenchmarks)

    // Device comparisons
    const comparisons =
      computeDeviceComparisons(benchmarkScore)

    // Vitals data object
    const vitalsData = {
      lcp: lcpValue,
      fcp: fcpValue,
      cls: clsValue,
      inp: inpValue,
      ttfb: ttfbValue,
      fid: fidValue
    }

    // Speed score
    const speedScore = computeSpeedScore(
      vitalsData,
      benchmarkScore
    )

    const speedData = {
      // Core Web Vitals
      lcp: lcpValue,
      lcpRating: lcpRating,
      fcp: fcpValue,
      fcpRating: fcpRating,
      cls: clsValue,
      clsRating: clsRating,
      inp: inpValue,
      inpRating: inpRating,
      ttfb: ttfbValue,
      ttfbRating: ttfbRating,
      fid: fidValue,
      fidRating: fidRating,

      // Browser benchmarks
      jsExecutionScore: jsResult.jsExecutionScore,
      jsExecutionMs: jsResult.jsExecutionMs,
      domManipulationScore:
        domResult.domManipulationScore,
      domManipulationMs: domResult.domManipulationMs,
      canvasRenderScore:
        canvasResult.canvasRenderScore,
      canvasRenderMs: canvasResult.canvasRenderMs,
      memoryAccessScore:
        memoryResult.memoryAccessScore,
      memoryAccessMs: memoryResult.memoryAccessMs,
      cssAnimationScore:
        cssResult.cssAnimationScore,
      cssAnimationFPS: cssResult.cssAnimationFPS,
      eventLoopScore: eventLoopResult.eventLoopScore,
      eventLoopAvgMs: eventLoopResult.eventLoopAvgMs,
      benchmarkScore: benchmarkScore,

      // Device comparisons
      vsAverageMobile: comparisons.vsAverageMobile,
      vsAverageDesktop:
        comparisons.vsAverageDesktop,
      vsTopTier: comparisons.vsTopTier,
      percentileRanking:
        comparisons.percentileRanking,

      // Speed score
      speedScore: speedScore
    }

    // Update STATE
    updateSpeed(speedData)
    markEngineComplete('speed')

    logPerformance(
      'INFO',
      `Speed analysis complete — ` +
      `LCP: ${lcpValue}ms (${lcpRating}) — ` +
      `FCP: ${fcpValue}ms (${fcpRating}) — ` +
      `Benchmark: ${benchmarkScore} — ` +
      `Speed Score: ${speedScore}`
    )

    return speedData
  }

  // Cleanup observers
  const cleanup = () => {
    observers.forEach(obs => {
      try { obs.disconnect() } catch {}
    })
  }

  return {
    collect,
    cleanup,
    observeLCP,
    observeFCP,
    observeCLS,
    observeINP,
    observeFID,
    benchmarkJSExecution,
    benchmarkDOMManipulation,
    benchmarkCanvasRender,
    benchmarkMemoryAccess,
    benchmarkCSSAnimation,
    benchmarkEventLoop,
    computeBenchmarkScore,
    computeSpeedScore
  }

})()
