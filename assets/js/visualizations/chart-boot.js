// ─────────────────────────────────────────
// CHART BOOT
// Starts the Chart.js charts. ChartJSViz.initializeAll()
// was never called, so every chart area stayed empty.
// Each canvas is placed in a fixed-size frame first,
// because Chart.js sizes itself to its parent and a
// parent without a fixed height makes it grow forever.
// ─────────────────────────────────────────
;(function () {
  // id: [width, height]  (width: number of px or '100%')
  var FRAMES = {
    'canvas3-latency-chart': ['100%', 120],
    'canvas3-bandwidth-chart': [120, 80],
    'canvas3-stability-chart': ['100%', 120],
    'canvas9-waterfall-chart': ['100%', 220],
    'canvas9-responsiveness-chart': [120, 80],
    'canvas10-vitals-chart': ['100%', 180],
    'c10-js-execution-gauge': [70, 50],
    'c10-dom-manipulation-gauge': [70, 50],
    'c10-canvas-render-gauge': [70, 50],
    'c10-memory-access-gauge': [70, 50],
    'canvas11-global-chart': [200, 200],
    'canvas11-network-chart': [80, 80],
    'canvas11-identity-chart': [80, 80],
    'canvas11-privacy-chart': [80, 80],
    'canvas11-device-chart': [80, 80],
    'canvas11-graphics-chart': [80, 80],
    'canvas11-security-chart': [80, 80],
    'canvas11-capability-chart': [80, 80],
    'canvas11-performance-chart': [80, 80],
    'canvas11-speed-chart': [80, 80]
  }

  var started = false

  var frameAll = function () {
    Object.keys(FRAMES).forEach(function (id) {
      var canvas = document.getElementById(id)
      if (!canvas || !canvas.parentNode) return
      if (canvas.parentNode.classList &&
          canvas.parentNode.classList.contains('ndic-chart-frame')) return
      var size = FRAMES[id]
      var frame = document.createElement('div')
      frame.className = 'ndic-chart-frame'
      frame.style.position = 'relative'
      frame.style.maxWidth = '100%'
      frame.style.width =
        typeof size[0] === 'number' ? size[0] + 'px' : size[0]
      frame.style.height = size[1] + 'px'
      canvas.parentNode.insertBefore(frame, canvas)
      frame.appendChild(canvas)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
    })
  }

  var start = function () {
    if (started) return true
    if (typeof Chart === 'undefined' ||
        typeof ChartJSViz === 'undefined') return false
    started = true
    try {
      frameAll()
      // Give the overall-score doughnut its own space above the rings
      var ring = document.querySelector('.ndic-score-ring-container')
      if (ring) {
        ring.style.width = '200px'
        ring.style.height = '200px'
        ring.style.margin = '0 auto 16px'
        // The chart draws the number itself; hide the duplicate
        var dup = document.getElementById('c11-global-score')
        if (dup) dup.style.display = 'none'
      }
      ChartJSViz.initializeAll()
      // Fill the charts with whatever data already arrived
      var calls = ['updateCanvas3Charts', 'updateCanvas9Charts',
        'updateCanvas10Charts', 'updateCanvas11Charts']
      calls.forEach(function (name) {
        try { ChartJSViz[name]() } catch (e) { /* data not ready yet */ }
      })
    } catch (e) {
      if (window.console) console.warn('Chart start failed', e)
    }
    return true
  }

  // Charts and diagrams pick their colours when they are drawn,
  // so draw them again when the theme is switched.
  var redrawForTheme = function () {
    setTimeout(function () {
      try { ChartJSViz.initializeAll() } catch (e) {}
      ;['updateCanvas3Charts', 'updateCanvas9Charts',
        'updateCanvas10Charts', 'updateCanvas11Charts'
      ].forEach(function (name) {
        try { ChartJSViz[name]() } catch (e) {}
      })
      if (typeof D3DiagramsViz !== 'undefined') {
        ;['updateRoutingDiagram', 'updateCapabilityGrid', 'updateScoreRings'
        ].forEach(function (name) {
          try { D3DiagramsViz[name]() } catch (e) {}
        })
      }
    }, 60)
  }
  window.addEventListener('ndic-theme-changed', redrawForTheme)

  var begin = function () {
    if (start()) return
    // Libraries are loaded with defer; wait for them
    var tries = 0
    var timer = setInterval(function () {
      tries += 1
      if (start() || tries > 80) clearInterval(timer)
    }, 150)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', begin)
  } else {
    begin()
  }
})()
