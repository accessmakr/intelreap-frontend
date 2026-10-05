// ─────────────────────────────────────────
// CHART.JS VISUALIZATION ENGINE
// Powers all Chart.js based visuals:
// Canvas 3  — Latency line graph
//             Bandwidth gauge dial
//             Stability area graph
// Canvas 9  — Performance waterfall
//             Responsiveness gauge
// Canvas 10 — Core Vitals bar chart
//             Benchmark gauge dials
// Canvas 11 — Global score doughnut
//             Sub-score gauge dials
// ─────────────────────────────────────────

const ChartJSViz = (() => {

  // ───────────────────────────────────────
  // CHART REGISTRY
  // Stores all active chart instances
  // for update and destroy management
  // ───────────────────────────────────────

  const charts = {}

  // ---------------------------------------
  // THEME COLOURS
  // Swaps dark-theme chart colours for
  // readable light-theme equivalents.
  // ---------------------------------------

  const isLightTheme = () =>
    document.documentElement.getAttribute('data-theme') !== 'dark'

  const LIGHT_HEX = {
    '#68d391': '#0a6b34',
    '#63b3ed': '#075f99',
    '#ecc94b': '#7f4d00',
    '#f56565': '#b3261e',
    '#ed8936': '#a93a08',
    '#fc8181': '#b3261e',
    '#9f7aea': '#5b21b6',
    '#76e4f7': '#006b87',
    '#2d3748': '#e3e8ef'
  }
  const LIGHT_RGB = {
    '99,179,237': '7,95,153',
    '72,187,120': '10,107,52',
    '236,201,75': '127,77,0',
    '245,101,101': '179,38,30'
  }

  const tc = (color) => {
    if (!isLightTheme()) return color
    const k = String(color).toLowerCase().replace(/\s+/g, '')
    if (LIGHT_HEX[k]) return LIGHT_HEX[k]
    const m = k.match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/)
    if (!m) return color
    const rgb = m[1] + ',' + m[2] + ',' + m[3]
    const a = m[4] === undefined ? 1 : parseFloat(m[4])
    if (rgb === '255,255,255') {
      const na = a <= 0.15 ? a * 2 : Math.min(0.92, a * 1.4 + 0.2)
      return 'rgba(15,23,42,' + na.toFixed(2) + ')'
    }
    if (LIGHT_RGB[rgb]) return 'rgba(' + LIGHT_RGB[rgb] + ',' + a + ')'
    return color
  }

  const cssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name).trim()
    return v || fallback
  }

  // ───────────────────────────────────────
  // CHART.JS GLOBAL DEFAULTS
  // Applied to all charts system-wide
  // ───────────────────────────────────────

  const applyGlobalDefaults = () => {
    if (typeof Chart === 'undefined') return

    Chart.defaults.color =
      cssVar('--color-text-secondary', '#a8b6c9')
    Chart.defaults.borderColor =
      tc('rgba(255,255,255,0.05)')
    Chart.defaults.font.family =
      'Inter, sans-serif'
    Chart.defaults.font.size = 11
    Chart.defaults.plugins.legend.display = false
    Chart.defaults.plugins.tooltip.backgroundColor =
      cssVar('--color-bg-elevated', '#28313f')
    Chart.defaults.plugins.tooltip.titleColor =
      cssVar('--color-text-primary', '#dde3ea')
    Chart.defaults.plugins.tooltip.bodyColor =
      cssVar('--color-text-secondary', '#a8b6c9')
    Chart.defaults.plugins.tooltip.borderColor =
      cssVar('--color-border-secondary', 'rgba(255,255,255,0.1)')
    Chart.defaults.plugins.tooltip.borderWidth = 1
    Chart.defaults.plugins.tooltip.padding = 10
    Chart.defaults.plugins.tooltip.cornerRadius = 6
    Chart.defaults.animation.duration = 600
    Chart.defaults.animation.easing =
      'easeInOutQuart'
    Chart.defaults.responsive = true
    Chart.defaults.maintainAspectRatio = false
  }

  // ───────────────────────────────────────
  // DESTROY CHART SAFELY
  // ───────────────────────────────────────

  const destroyChart = (chartId) => {
    if (charts[chartId]) {
      try {
        charts[chartId].destroy()
      } catch {
        // Continue
      }
      delete charts[chartId]
    }
  }

  // ───────────────────────────────────────
  // GET CSS VARIABLE VALUE
  // Resolves CSS custom properties
  // for use in Chart.js colors
  // ───────────────────────────────────────

  const getCSSVar = (varName) => {
    return getComputedStyle(
      document.documentElement
    ).getPropertyValue(varName).trim()
  }

  // ───────────────────────────────────────
  // CANVAS 3 — LATENCY LINE GRAPH
  // Real-time RTT history
  // Updates every 3 seconds
  // ───────────────────────────────────────

  const initLatencyGraph = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas3-latency')

    const canvas = el('canvas3-latency-chart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const maxPoints =
      NDIC_CONFIG.LIMITS.rttHistoryLength

    // Build initial empty dataset
    const labels = Array(maxPoints).fill('')
    const data = Array(maxPoints).fill(null)

    // Gradient fill
    const gradient = ctx.createLinearGradient(
      0, 0, 0, 200
    )
    gradient.addColorStop(
      0,
      tc('rgba(99, 179, 237, 0.3)')
    )
    gradient.addColorStop(
      1,
      tc('rgba(99, 179, 237, 0.0)')
    )

    charts['canvas3-latency'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Latency (ms)',
          data: data,
          borderColor: tc('#63b3ed'),
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: tc('#63b3ed'),
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        scales: {
          x: {
            display: false
          },
          y: {
            min: 0,
            grid: {
              color: tc('rgba(255,255,255,0.05)'),
              drawBorder: false
            },
            ticks: {
              callback: (value) => `${value}ms`,
              maxTicksLimit: 5,
              color: tc('rgba(255,255,255,0.4)')
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `Latency: ${ctx.raw}ms`
            }
          },
          // Reference lines at 50ms, 100ms, 200ms
          annotation: {
            annotations: {
              line50: {
                type: 'line',
                yMin: 50,
                yMax: 50,
                borderColor:
                  tc('rgba(72, 187, 120, 0.3)'),
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: '50ms',
                  enabled: true,
                  position: 'end',
                  color: tc('rgba(72,187,120,0.6)'),
                  font: { size: 9 }
                }
              },
              line100: {
                type: 'line',
                yMin: 100,
                yMax: 100,
                borderColor:
                  tc('rgba(236, 201, 75, 0.3)'),
                borderWidth: 1,
                borderDash: [4, 4]
              },
              line200: {
                type: 'line',
                yMin: 200,
                yMax: 200,
                borderColor:
                  tc('rgba(245, 101, 101, 0.3)'),
                borderWidth: 1,
                borderDash: [4, 4]
              }
            }
          }
        }
      }
    })
  }

  // Update latency graph with new RTT data
  const updateLatencyGraph = (rttHistory) => {
    const chart = charts['canvas3-latency']
    if (!chart || !rttHistory) return

    const maxPoints =
      NDIC_CONFIG.LIMITS.rttHistoryLength

    // Pad or trim to maxPoints
    let data = [...rttHistory]
    while (data.length < maxPoints) {
      data.unshift(null)
    }
    data = data.slice(-maxPoints)

    chart.data.datasets[0].data = data
    chart.update('none') // No animation for live data
  }

  // ───────────────────────────────────────
  // CANVAS 3 — BANDWIDTH GAUGE DIAL
  // Half-circle doughnut gauge
  // ───────────────────────────────────────

  const initBandwidthGauge = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas3-bandwidth')

    const canvas = el('canvas3-bandwidth-chart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    charts['canvas3-bandwidth'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: [
            tc('#63b3ed'),
            tc('rgba(255,255,255,0.05)')
          ],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    })
  }

  const updateBandwidthGauge = (bandwidth) => {
    const chart = charts['canvas3-bandwidth']
    if (!chart) return

    const maxBandwidth = 100
    const value = Math.min(
      bandwidth || 0,
      maxBandwidth
    )
    const remaining = maxBandwidth - value

    // Color based on bandwidth
    let color = tc('#f56565') // red — poor
    if (value >= 50) color = tc('#63b3ed')     // blue
    else if (value >= 25) color = tc('#68d391') // green
    else if (value >= 10) color = tc('#ecc94b') // amber

    chart.data.datasets[0].data = [
      value, remaining
    ]
    chart.data.datasets[0].backgroundColor[0] =
      color
    chart.update()
  }

  // ───────────────────────────────────────
  // CANVAS 3 — STABILITY AREA GRAPH
  // Shows network stability over time
  // ───────────────────────────────────────

  const initStabilityGraph = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas3-stability')

    const canvas = el('canvas3-stability-chart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const maxPoints = 30

    const gradient = ctx.createLinearGradient(
      0, 0, 0, 100
    )
    gradient.addColorStop(
      0,
      tc('rgba(72, 187, 120, 0.4)')
    )
    gradient.addColorStop(
      1,
      tc('rgba(72, 187, 120, 0.0)')
    )

    charts['canvas3-stability'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(maxPoints).fill(''),
        datasets: [{
          data: Array(maxPoints).fill(100),
          borderColor: tc('#68d391'),
          backgroundColor: gradient,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        scales: {
          x: { display: false },
          y: {
            min: 0,
            max: 100,
            display: false
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    })
  }

  const updateStabilityGraph = (
    stabilityIndex,
    rttHistory
  ) => {
    const chart = charts['canvas3-stability']
    if (!chart) return

    const current = chart.data.datasets[0].data
    current.push(stabilityIndex || 0)
    if (current.length > 30) current.shift()

    // Color based on stability
    let color = tc('#f56565')
    if (stabilityIndex >= 80) color = tc('#68d391')
    else if (stabilityIndex >= 60) color = tc('#ecc94b')

    chart.data.datasets[0].borderColor = color
    chart.update('none')
  }

  // ───────────────────────────────────────
  // CANVAS 9 — PERFORMANCE WATERFALL
  // Horizontal bar chart showing
  // each timing milestone
  // ───────────────────────────────────────

  const initPerformanceWaterfall = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas9-waterfall')

    const canvas = el('canvas9-waterfall-chart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    charts['canvas9-waterfall'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'DNS Lookup',
          'TCP Connect',
          'TLS Handshake',
          'Time to First Byte',
          'Response',
          'DOM Processing',
          'Resource Fetch'
        ],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: [
            tc('#63b3ed'),
            tc('#76e4f7'),
            tc('#9f7aea'),
            tc('#68d391'),
            tc('#ecc94b'),
            tc('#ed8936'),
            tc('#fc8181')
          ],
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: tc('rgba(255,255,255,0.05)')
            },
            ticks: {
              callback: (v) => `${v}ms`,
              color: tc('rgba(255,255,255,0.4)'),
              maxTicksLimit: 6
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: tc('rgba(255,255,255,0.6)'),
              font: { size: 10 }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` ${ctx.raw}ms`
            }
          }
        }
      }
    })
  }

  const updatePerformanceWaterfall = (perf) => {
    const chart = charts['canvas9-waterfall']
    if (!chart || !perf) return

    const values = [
      perf.dnsLookup || 0,
      perf.tcpConnection || 0,
      perf.tlsHandshake || 0,
      perf.ttfb || 0,
      perf.responseTime || 0,
      perf.domProcessing || 0,
      perf.resourceFetchTime || 0
    ]

    // Color each bar by duration
    const colors = values.map(v => {
      if (v <= 50) return tc('#68d391')   // green
      if (v <= 200) return tc('#ecc94b')  // amber
      return tc('#f56565')                // red
    })

    chart.data.datasets[0].data = values
    chart.data.datasets[0].backgroundColor =
      colors
    chart.update()
  }

  // ───────────────────────────────────────
  // CANVAS 9 — RESPONSIVENESS GAUGE
  // Runtime performance score gauge
  // ───────────────────────────────────────

  const initResponsivenessGauge = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas9-responsiveness')

    const canvas = el(
      'canvas9-responsiveness-chart'
    )
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    charts['canvas9-responsiveness'] =
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [0, 100],
            backgroundColor: [
              tc('#68d391'),
              tc('rgba(255,255,255,0.05)')
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      })
  }

  const updateResponsivenessGauge = (score) => {
    const chart =
      charts['canvas9-responsiveness']
    if (!chart) return

    const value = Math.min(score || 0, 100)

    let color = tc('#f56565')
    if (value >= 80) color = tc('#68d391')
    else if (value >= 60) color = tc('#ecc94b')
    else if (value >= 40) color = tc('#ed8936')

    chart.data.datasets[0].data =
      [value, 100 - value]
    chart.data.datasets[0].backgroundColor[0] =
      color
    chart.update()
  }

  // ───────────────────────────────────────
  // CANVAS 10 — CORE VITALS BAR CHART
  // Six Core Web Vitals comparison
  // ───────────────────────────────────────

  const initVitalsBarChart = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas10-vitals')

    const canvas = el('canvas10-vitals-chart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    charts['canvas10-vitals'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'LCP', 'FCP', 'CLS',
          'INP', 'TTFB', 'FID'
        ],
        datasets: [
          {
            label: 'Measured',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              tc('#68d391'), tc('#68d391'), tc('#68d391'),
              tc('#68d391'), tc('#68d391'), tc('#68d391')
            ],
            borderRadius: 4,
            borderSkipped: false
          },
          {
            label: 'Good Threshold',
            data: [2500, 1800, 0.1, 200, 800, 100],
            backgroundColor:
              tc('rgba(255,255,255,0.08)'),
            borderRadius: 4,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: tc('rgba(255,255,255,0.6)'),
              font: { size: 11, weight: '600' }
            }
          },
          y: {
            display: false
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const labels = [
                  'LCP', 'FCP', 'CLS',
                  'INP', 'TTFB', 'FID'
                ]
                const idx = ctx.dataIndex
                const isCLS = idx === 2
                if (ctx.datasetIndex === 0) {
                  return isCLS
                    ? ` ${ctx.raw}`
                    : ` ${ctx.raw}ms`
                }
                return null
              }
            }
          }
        }
      }
    })
  }

  const updateVitalsBarChart = (speed) => {
    const chart = charts['canvas10-vitals']
    if (!chart || !speed) return

    const values = [
      speed.lcp || 0,
      speed.fcp || 0,
      speed.cls || 0,
      speed.inp || 0,
      speed.ttfb || 0,
      speed.fid || 0
    ]

    const ratings = [
      speed.lcpRating,
      speed.fcpRating,
      speed.clsRating,
      speed.inpRating,
      speed.ttfbRating,
      speed.fidRating
    ]

    const colors = ratings.map(rating => {
      if (rating === 'Good') return tc('#68d391')
      if (rating === 'Needs Improvement') {
        return tc('#ecc94b')
      }
      if (rating === 'Poor') return tc('#f56565')
      return tc('rgba(255,255,255,0.2)')
    })

    chart.data.datasets[0].data = values
    chart.data.datasets[0].backgroundColor =
      colors
    chart.update()
  }

  // ───────────────────────────────────────
  // CANVAS 10 — BENCHMARK GAUGE DIALS
  // Seven small gauges one per benchmark
  // ───────────────────────────────────────

  const BENCHMARK_GAUGE_IDS = [
    'js-execution',
    'dom-manipulation',
    'canvas-render',
    'memory-access',
    'css-animation',
    'event-loop',
    'overall-benchmark'
  ]

  const initBenchmarkGauges = () => {
    if (typeof Chart === 'undefined') return

    BENCHMARK_GAUGE_IDS.forEach(gaugeId => {
      destroyChart(`canvas10-${gaugeId}`)

      const canvas = el(
        `canvas10-${gaugeId}-chart`
      )
      if (!canvas) return

      const ctx = canvas.getContext('2d')

      charts[`canvas10-${gaugeId}`] =
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [0, 100],
              backgroundColor: [
                tc('#63b3ed'),
                tc('rgba(255,255,255,0.05)')
              ],
              borderWidth: 0,
              circumference: 180,
              rotation: 270
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '78%',
            animation: { duration: 800 },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            }
          }
        })
    })
  }

  const updateBenchmarkGauge = (
    gaugeId,
    score
  ) => {
    const chart =
      charts[`canvas10-${gaugeId}`]
    if (!chart) return

    const value = Math.min(score || 0, 100)

    let color = tc('#f56565')
    if (value >= 80) color = tc('#68d391')
    else if (value >= 60) color = tc('#ecc94b')
    else if (value >= 40) color = tc('#ed8936')
    else if (value > 0) color = tc('#fc8181')

    chart.data.datasets[0].data =
      [value, 100 - value]
    chart.data.datasets[0].backgroundColor[0] =
      color
    chart.update()
  }

  const updateAllBenchmarkGauges = (speed) => {
    if (!speed) return

    updateBenchmarkGauge(
      'js-execution',
      speed.jsExecutionScore
    )
    updateBenchmarkGauge(
      'dom-manipulation',
      speed.domManipulationScore
    )
    updateBenchmarkGauge(
      'canvas-render',
      speed.canvasRenderScore
    )
    updateBenchmarkGauge(
      'memory-access',
      speed.memoryAccessScore
    )
    updateBenchmarkGauge(
      'css-animation',
      speed.cssAnimationScore
    )
    updateBenchmarkGauge(
      'event-loop',
      speed.eventLoopScore
    )
    updateBenchmarkGauge(
      'overall-benchmark',
      speed.benchmarkScore
    )
  }

  // ───────────────────────────────────────
  // CANVAS 11 — GLOBAL SCORE DOUGHNUT
  // Large central score visualization
  // ───────────────────────────────────────

  const initGlobalScoreDoughnut = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas11-global')

    const canvas = el('canvas11-global-chart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // Custom center text plugin
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw(chart) {
        const { width, height, ctx: c } = chart
        c.restore()

        const score =
          chart.data.datasets[0].data[0]
        const health =
          chart.config.options.centerText ||
          ''

        // Score number
        c.font = `bold ${
          Math.round(height / 4)
        }px Inter, sans-serif`
        c.fillStyle = '#ffffff'
        c.textAlign = 'center'
        c.textBaseline = 'middle'

        const centerX = width / 2
        const centerY = height / 2 - 10

        c.fillText(score || 0, centerX, centerY)

        // Health label below
        c.font = `${
          Math.round(height / 10)
        }px Inter, sans-serif`
        c.fillStyle = tc('rgba(255,255,255,0.5)')
        c.fillText(health, centerX, centerY + 28)

        c.save()
      }
    }

    charts['canvas11-global'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: [
            tc('#68d391'),
            tc('rgba(255,255,255,0.05)')
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        rotation: -90,
        circumference: 360,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        centerText: '',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      },
      plugins: [centerTextPlugin]
    })
  }

  const updateGlobalScoreDoughnut = (
    score,
    health
  ) => {
    const chart = charts['canvas11-global']
    if (!chart) return

    const value = Math.min(score || 0, 100)

    let color = tc('#f56565')
    if (value >= 90) color = tc('#68d391')
    else if (value >= 70) color = tc('#63b3ed')
    else if (value >= 50) color = tc('#ecc94b')
    else if (value >= 30) color = tc('#ed8936')

    chart.data.datasets[0].data =
      [value, 100 - value]
    chart.data.datasets[0].backgroundColor[0] =
      color
    chart.options.centerText = health || ''
    chart.update()
  }

  // ───────────────────────────────────────
  // CANVAS 11 — SUB-SCORE GAUGE DIALS
  // Nine small score gauges
  // ───────────────────────────────────────

  const SUB_SCORE_GAUGE_IDS = [
    'network', 'identity', 'privacy',
    'device', 'graphics', 'security',
    'capability', 'performance', 'speed'
  ]

  const initSubScoreGauges = () => {
    if (typeof Chart === 'undefined') return

    SUB_SCORE_GAUGE_IDS.forEach(area => {
      destroyChart(`canvas11-${area}`)

      const canvas = el(
        `canvas11-${area}-chart`
      )
      if (!canvas) return

      const ctx = canvas.getContext('2d')

      const centerPlugin = {
        id: `center-${area}`,
        beforeDraw(chart) {
          const { width, height, ctx: c } = chart
          c.restore()
          const score =
            chart.data.datasets[0].data[0]
          c.font = `bold ${
            Math.round(height / 4.5)
          }px Inter, sans-serif`
          c.fillStyle = '#ffffff'
          c.textAlign = 'center'
          c.textBaseline = 'middle'
          c.fillText(
            score || 0,
            width / 2,
            height / 2
          )
          c.save()
        }
      }

      charts[`canvas11-${area}`] =
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [0, 100],
              backgroundColor: [
                tc('#63b3ed'),
                tc('rgba(255,255,255,0.05)')
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            animation: { duration: 800 },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            }
          },
          plugins: [centerPlugin]
        })
    })
  }

  const updateSubScoreGauge = (area, score) => {
    const chart = charts[`canvas11-${area}`]
    if (!chart) return

    const value = Math.min(score || 0, 100)
    const color = getScoreColor(value)

    chart.data.datasets[0].data =
      [value, 100 - value]
    chart.data.datasets[0].backgroundColor[0] =
      color
    chart.update()
  }

  const updateAllSubScoreGauges = (scores) => {
    if (!scores) return

    updateSubScoreGauge(
      'network', scores.networkScore
    )
    updateSubScoreGauge(
      'identity', scores.identityScore
    )
    updateSubScoreGauge(
      'privacy', scores.privacyScore
    )
    updateSubScoreGauge(
      'device', scores.deviceScore
    )
    updateSubScoreGauge(
      'graphics', scores.graphicsScore
    )
    updateSubScoreGauge(
      'security', scores.securityScore
    )
    updateSubScoreGauge(
      'capability', scores.capabilityScore
    )
    updateSubScoreGauge(
      'performance', scores.performanceScore
    )
    updateSubScoreGauge(
      'speed', scores.speedScore
    )
  }

  // ───────────────────────────────────────
  // INITIALIZE ALL CHARTS
  // Called once on page load
  // ───────────────────────────────────────

  const initializeAll = () => {
    if (typeof Chart === 'undefined') {
      logError(
        'Chart.js library not loaded'
      )
      return
    }

    applyGlobalDefaults()

    // Canvas 3 charts
    initLatencyGraph()
    initBandwidthGauge()
    initStabilityGraph()

    // Canvas 9 charts
    initPerformanceWaterfall()
    initResponsivenessGauge()

    // Canvas 10 charts
    initVitalsBarChart()
    initBenchmarkGauges()

    // Canvas 11 charts
    initGlobalScoreDoughnut()
    initSubScoreGauges()

    logSystem(
      'INFO',
      'Chart.js visualization engine ready'
    )
  }

  // ───────────────────────────────────────
  // UPDATE ALL CHARTS
  // Called by canvas render functions
  // ───────────────────────────────────────

  const updateCanvas3Charts = () => {
    const ln = STATE.liveNetwork
    updateLatencyGraph(ln.rttHistory)
    updateBandwidthGauge(ln.bandwidth)
    updateStabilityGraph(
      ln.stabilityIndex,
      ln.rttHistory
    )
  }

  const updateCanvas9Charts = () => {
    const p = STATE.performance
    updatePerformanceWaterfall(p)
    updateResponsivenessGauge(p.runtimeScore)
  }

  const updateCanvas10Charts = () => {
    const sp = STATE.speed
    updateVitalsBarChart(sp)
    updateAllBenchmarkGauges(sp)
  }

  const updateCanvas11Charts = () => {
    const s = STATE.scores
    updateGlobalScoreDoughnut(
      s.globalScore,
      s.healthClassification
    )
    updateAllSubScoreGauges(s)
  }

  // ───────────────────────────────────────
  // RESIZE ALL CHARTS
  // ───────────────────────────────────────

  const resize = () => {
    Object.values(charts).forEach(chart => {
      try {
        chart.resize()
      } catch {
        // Continue
      }
    })
  }

  // ───────────────────────────────────────
  // DESTROY ALL CHARTS
  // Called on page unload
  // ───────────────────────────────────────

  const destroyAll = () => {
    Object.keys(charts).forEach(id => {
      destroyChart(id)
    })
  }

  window.addEventListener('ndic-theme-changed', applyGlobalDefaults)

  return {
    initializeAll,
    updateCanvas3Charts,
    updateCanvas9Charts,
    updateCanvas10Charts,
    updateCanvas11Charts,
    updateLatencyGraph,
    updateBandwidthGauge,
    updateStabilityGraph,
    updatePerformanceWaterfall,
    updateResponsivenessGauge,
    updateVitalsBarChart,
    updateAllBenchmarkGauges,
    updateGlobalScoreDoughnut,
    updateAllSubScoreGauges,
    resize,
    destroyAll
  }

})()
