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
    '#2d3748': '#e3e8ef',
    '#ffffff': '#0f172a'
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

  // Draws a number (and a small unit line) inside a doughnut or
  // half-circle dial: options.plugins.ndicGaugeText = { text, sub }
  const gaugeTextPlugin = {
    id: 'ndicGaugeText',
    afterDraw: (chart, args, opts) => {
      if (!opts || !opts.text) return
      const meta = chart.getDatasetMeta(0)
      const arc = meta && meta.data && meta.data[0]
      if (!arc) return
      const p = arc.getProps(
        ['x', 'y', 'innerRadius', 'outerRadius'], true
      )
      const ctx = chart.ctx
      const size = Math.max(
        11, Math.min(26, p.innerRadius * 0.62)
      )
      const subSize = Math.max(8, size * 0.46)
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      let y = p.y - 3
      if (opts.sub) {
        ctx.fillStyle =
          cssVar('--color-text-secondary', '#a8b6c9')
        ctx.font = `500 ${subSize}px Inter, sans-serif`
        ctx.fillText(opts.sub, p.x, y)
        y -= subSize + 3
      }
      ctx.fillStyle =
        cssVar('--color-text-primary', '#dde3ea')
      ctx.font = `700 ${size}px Inter, sans-serif`
      ctx.fillText(String(opts.text), p.x, y)
      ctx.restore()
    }
  }

  // Draws a label above each bar of the first dataset:
  // options.plugins.ndicBarValues = { labels: [...] }
  const barValuesPlugin = {
    id: 'ndicBarValues',
    afterDatasetsDraw: (chart, args, opts) => {
      if (!opts || !opts.labels) return
      const meta = chart.getDatasetMeta(0)
      const ctx = chart.ctx
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.font = '700 10px Inter, sans-serif'
      ctx.fillStyle = cssVar('--color-text-primary', '#dde3ea')
      meta.data.forEach((bar, i) => {
        const label = opts.labels[i]
        if (label) ctx.fillText(label, bar.x - 0, bar.y - 4)
      })
      ctx.restore()
    }
  }

  // Shows a short grey note in the middle of a chart while it has too
  // little data to draw anything meaningful: options.plugins.ndicEmptyNote
  const emptyNotePlugin = {
    id: 'ndicEmptyNote',
    afterDraw: (chart, args, opts) => {
      if (!opts || !opts.text) return
      const a = chart.chartArea
      if (!a) return
      const ctx = chart.ctx
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '600 12px Inter, sans-serif'
      ctx.fillStyle = cssVar('--color-text-secondary', '#a8b6c9')
      ctx.fillText(
        opts.text, (a.left + a.right) / 2, (a.top + a.bottom) / 2
      )
      ctx.restore()
    }
  }

  let pluginsRegistered = false

  const applyGlobalDefaults = () => {
    if (typeof Chart === 'undefined') return

    if (!pluginsRegistered) {
      Chart.register(gaugeTextPlugin, barValuesPlugin, emptyNotePlugin)
      pluginsRegistered = true
    }

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
    const samples = rttHistory.filter(v => v !== null && v !== undefined).length
    chart.data.datasets[0].pointRadius = samples < 8 ? 3 : 0
    chart.options.plugins.ndicEmptyNote = {
      text: samples < 4
        ? 'Collecting latency samples (' + samples + ')…'
        : ''
    }
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
        animation: false,
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
    chart.options.plugins.ndicGaugeText = {
      text: bandwidth
        ? (bandwidth >= 100 ? '100+' : Number(bandwidth).toFixed(1))
        : '—',
      sub: 'Mbps download'
    }
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

    // No reading yet: do not plot a false zero
    if (stabilityIndex === null || stabilityIndex === undefined) {
      chart.options.plugins.ndicEmptyNote = {
        text: 'Collecting stability samples (0)…'
      }
      chart.update('none')
      return
    }
    current.push(stabilityIndex)
    if (current.length > 30) current.shift()

    // Color based on stability
    let color = tc('#f56565')
    if (stabilityIndex >= 80) color = tc('#68d391')
    else if (stabilityIndex >= 60) color = tc('#ecc94b')

    chart.data.datasets[0].borderColor = color
    chart.options.plugins.ndicEmptyNote = {
      text: current.length < 6
        ? 'Collecting stability samples (' + current.length + ')…'
        : ''
    }
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
              callback: (v) => (v >= 1000 ? `${v / 1000}s` : `${v}ms`),
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 5,
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
          animation: false,
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
    chart.options.plugins.ndicGaugeText = {
      text: Math.round(value),
      sub: 'responsiveness / 100'
    }
    chart.update()
  }

  // ───────────────────────────────────────
  // CANVAS 10 — CORE VITALS BAR CHART
  // Six Core Web Vitals comparison
  // ───────────────────────────────────────

  // Each metric has its own unit (ms, or none for CLS), so the bars
  // show the result as a share of that metric's "good" limit. The grey
  // bar is the limit (always full height); a coloured bar shorter than
  // the grey one means "good". The real value is written above it.
  const VITAL_NAMES = ['LCP', 'FCP', 'CLS', 'INP', 'TTFB', 'FID']
  const VITAL_LIMITS = [2500, 1800, 0.1, 200, 800, 100]

  const formatVital = (index, v) => {
    if (v === null || v === undefined) return '—'
    if (index === 2) return Number(v).toFixed(2)
    return v >= 1000
      ? (v / 1000).toFixed(1) + ' s'
      : Math.round(v) + ' ms'
  }

  const initVitalsBarChart = () => {
    if (typeof Chart === 'undefined') return
    destroyChart('canvas10-vitals')

    const canvas = el('canvas10-vitals-chart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    charts['canvas10-vitals'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: VITAL_NAMES,
        datasets: [
          {
            label: 'Your result',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              tc('#68d391'), tc('#68d391'), tc('#68d391'),
              tc('#68d391'), tc('#68d391'), tc('#68d391')
            ],
            borderRadius: 4,
            borderSkipped: false
          },
          {
            label: 'Good limit',
            data: [1, 1, 1, 1, 1, 1],
            backgroundColor:
              tc('rgba(255,255,255,0.12)'),
            borderRadius: 4,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 6 } },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: cssVar('--color-text-secondary', '#a8b6c9'),
              font: { size: 11, weight: '600' }
            }
          },
          y: {
            display: false,
            min: 0,
            max: 3
          }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Your result against the "good" limit (grey): lower than grey is good',
            align: 'start',
            color: cssVar('--color-text-secondary', '#a8b6c9'),
            font: { size: 11, weight: '600' },
            padding: { bottom: 10 }
          },
          ndicBarValues: { labels: [] },
          tooltip: {
            callbacks: {
              label: (c) => {
                const i = c.dataIndex
                if (c.datasetIndex === 1) {
                  return ' Good limit: ' + formatVital(i, VITAL_LIMITS[i])
                }
                const raw = c.chart.$rawVitals
                return ' Your result: ' + formatVital(i, raw ? raw[i] : null)
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

    const raw = [
      speed.lcp, speed.fcp, speed.cls,
      speed.inp, speed.ttfb, speed.fid
    ]
    chart.$rawVitals = raw

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

    const ratios = raw.map((v, i) =>
      v === null || v === undefined
        ? 0
        : Math.min(2.5, Math.max(0.03, v / VITAL_LIMITS[i]))
    )

    chart.data.datasets[0].data = ratios
    chart.data.datasets[0].backgroundColor =
      colors
    chart.options.plugins.ndicBarValues = {
      labels: raw.map((v, i) => formatVital(i, v))
    }
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

      const canvas =
        el(`c10-${gaugeId}-gauge`) ||
        el(`canvas10-${gaugeId}-chart`)
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
    chart.options.plugins.ndicGaugeText = {
      text: score === null || score === undefined
        ? '—' : Math.round(value),
      sub: '/ 100'
    }
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
        c.fillStyle = tc('#ffffff')
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
          c.fillStyle = tc('#ffffff')
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
    // Canvas cannot use var(--x); read the real colour
    let color = getScoreColor(value)
    const varMatch = /^var\((--[a-z0-9-]+)\)$/i.exec(color)
    if (varMatch) color = cssVar(varMatch[1], '#63b3ed')

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

  const setChartTitle = (id, text) => {
    const chart = charts[id]
    if (!chart) return
    chart.options.plugins.title = {
      display: true,
      text,
      align: 'start',
      color: cssVar('--color-text-secondary', '#a8b6c9'),
      font: { size: 11, weight: '600' },
      padding: { bottom: 8 }
    }
    chart.update('none')
  }

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

    // Plain titles so each chart says what it shows
    setChartTitle('canvas3-latency',
      'Latency over time (ms): lower is better')
    setChartTitle('canvas3-stability',
      'Stability over time: higher and steadier is better')
    setChartTitle('canvas9-waterfall',
      'Where the page load time went (ms): shorter is better')

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
