// ─────────────────────────────────────────
// D3.JS DIAGRAM VISUALIZATION ENGINE
// Powers three complex diagrams:
// Canvas 1  — ASN routing flow diagram
// Canvas 8  — Capability boolean grid
// Canvas 11 — Sub-score ring system
// ─────────────────────────────────────────

const D3DiagramsViz = (() => {

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
  // INTERNAL STATE
  // ───────────────────────────────────────

  let routingSimulation = null
  let routingResizeObserver = null

  // ───────────────────────────────────────
  // CHECK D3 AVAILABILITY
  // ───────────────────────────────────────

  const isD3Available = () => {
    if (typeof d3 === 'undefined') {
      logError('D3.js library not loaded')
      return false
    }
    return true
  }

  // ───────────────────────────────────────
  // CANVAS 1 — ASN ROUTING FLOW DIAGRAM
  // Force-directed graph showing network
  // routing path from user to internet
  // ───────────────────────────────────────

  const initRoutingDiagram = () => {
    if (!isD3Available()) return

    const container = el('canvas1-routing-diagram')
    if (!container) return

    // Clear previous diagram
    d3.select('#canvas1-routing-diagram')
      .selectAll('*')
      .remove()

    if (routingSimulation) {
      routingSimulation.stop()
      routingSimulation = null
    }

    const width = container.clientWidth || 400
    const height = container.clientHeight || 220

    // Build nodes from STATE data
    const network = STATE.network
    const identity = STATE.identity

    // Below this container width, lay nodes
    // out as 3-over-2 rows instead of a single
    // cramped row of 5 across — this is purely
    // a layout branch, the data and flow order
    // (device -> isp -> asn -> upstream -> internet)
    // stay identical either way.
    const isNarrow = width < 480

    const nodes = isNarrow
      ? [
          {
            id: 'device',
            label: 'Your Device',
            sublabel: identity.ip || '—',
            type: 'device',
            x: width * 0.18,
            y: height * 0.3,
            fixed: true
          },
          {
            id: 'isp',
            label: identity.isp ||
              'Internet Service Provider',
            sublabel: identity.connectionType ||
              'ISP',
            type: 'isp',
            x: width * 0.5,
            y: height * 0.3
          },
          {
            id: 'asn',
            label: network.asnOwner || 'ASN',
            sublabel: network.asn || '—',
            type: 'asn',
            x: width * 0.82,
            y: height * 0.3
          },
          {
            id: 'upstream',
            label: network.upstreamProvider ||
              'Upstream Provider',
            sublabel: network.networkTier || '—',
            type: 'upstream',
            x: width * 0.34,
            y: height * 0.72
          },
          {
            id: 'internet',
            label: 'Internet',
            sublabel: network.allocationRegistry ||
              'Global',
            type: 'internet',
            x: width * 0.66,
            y: height * 0.72,
            fixed: true
          }
        ]
      : [
          {
            id: 'device',
            label: 'Your Device',
            sublabel: identity.ip || '—',
            type: 'device',
            x: width * 0.1,
            y: height * 0.5,
            fixed: true
          },
          {
            id: 'isp',
            label: identity.isp ||
              'Internet Service Provider',
            sublabel: identity.connectionType ||
              'ISP',
            type: 'isp',
            x: width * 0.3,
            y: height * 0.5
          },
          {
            id: 'asn',
            label: network.asnOwner || 'ASN',
            sublabel: network.asn || '—',
            type: 'asn',
            x: width * 0.5,
            y: height * 0.5
          },
          {
            id: 'upstream',
            label: network.upstreamProvider ||
              'Upstream Provider',
            sublabel: network.networkTier || '—',
            type: 'upstream',
            x: width * 0.7,
            y: height * 0.5
          },
          {
            id: 'internet',
            label: 'Internet',
            sublabel: network.allocationRegistry ||
              'Global',
            type: 'internet',
            x: width * 0.9,
            y: height * 0.5,
            fixed: true
          }
        ]

    // Links between nodes
    const links = [
      {
        source: 'device',
        target: 'isp',
        label: identity.connectionType ||
          'connection',
        latency: STATE.liveNetwork.currentRtt
      },
      {
        source: 'isp',
        target: 'asn',
        label: 'routing',
        latency: null
      },
      {
        source: 'asn',
        target: 'upstream',
        label: 'transit',
        latency: null
      },
      {
        source: 'upstream',
        target: 'internet',
        label: 'peering',
        latency: null
      }
    ]

    // Create SVG
    const svg = d3
      .select('#canvas1-routing-diagram')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    // Define arrow marker
    svg.append('defs')
      .append('marker')
      .attr('id', 'ndic-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', tc('rgba(99,179,237,0.6)'))

    // Define pulse gradient
    const defs = svg.select('defs')

    const pulseGradient = defs
      .append('radialGradient')
      .attr('id', 'ndic-pulse-gradient')

    pulseGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', tc('#63b3ed'))
      .attr('stop-opacity', 0.8)

    pulseGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', tc('#63b3ed'))
      .attr('stop-opacity', 0)

    // Link group
    const linkGroup = svg.append('g')
      .attr('class', 'ndic-routing-links')

    // Draw links
    const linkElements = linkGroup
      .selectAll('.ndic-routing-link')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'ndic-routing-link-group')

    // Link lines
    linkElements.append('line')
      .attr('class', 'ndic-routing-link')
      .attr('stroke', tc('rgba(99,179,237,0.3)'))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,3')
      .attr('marker-end', 'url(#ndic-arrow)')

    // Link labels
    linkElements.append('text')
      .attr('class', 'ndic-routing-link-label')
      .attr('fill', tc('rgba(255,255,255,0.3)'))
      .attr('font-size', '9px')
      .attr('text-anchor', 'middle')
      .attr('dy', -6)
      .text(d => {
        if (d.latency) {
          return `${d.label} • ${d.latency}ms`
        }
        return d.label
      })

    // Node group
    const nodeGroup = svg.append('g')
      .attr('class', 'ndic-routing-nodes')

    // Node type styling
    const nodeStyles = {
      device: {
        radius: 22,
        fillColor: tc('#2d3748'),
        strokeColor: tc('#63b3ed'),
        strokeWidth: 2
      },
      isp: {
        radius: 18,
        fillColor: tc('#2d3748'),
        strokeColor: tc('#68d391'),
        strokeWidth: 1.5
      },
      asn: {
        radius: 20,
        fillColor: tc('#2d3748'),
        strokeColor: tc('#9f7aea'),
        strokeWidth: 2
      },
      upstream: {
        radius: 16,
        fillColor: tc('#2d3748'),
        strokeColor: tc('#ecc94b'),
        strokeWidth: 1.5
      },
      internet: {
        radius: 22,
        fillColor: tc('#2d3748'),
        strokeColor: tc('#63b3ed'),
        strokeWidth: 2
      }
    }

    // Draw nodes
    const nodeElements = nodeGroup
      .selectAll('.ndic-routing-node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', d =>
        `ndic-routing-node ndic-node-${d.type}`
      )
      .attr('transform', d =>
        `translate(${d.x}, ${d.y})`
      )

    // Pulse rings for device and internet
    nodeElements
      .filter(d =>
        d.type === 'device' ||
        d.type === 'internet'
      )
      .append('circle')
      .attr('class', 'ndic-node-pulse')
      .attr('r', d =>
        nodeStyles[d.type].radius + 8
      )
      .attr('fill', 'none')
      .attr('stroke', d =>
        nodeStyles[d.type].strokeColor
      )
      .attr('stroke-width', 1)
      .attr('opacity', 0.3)

    // Node circles
    nodeElements.append('circle')
      .attr('r', d => nodeStyles[d.type].radius)
      .attr('fill', d =>
        nodeStyles[d.type].fillColor
      )
      .attr('stroke', d =>
        nodeStyles[d.type].strokeColor
      )
      .attr('stroke-width', d =>
        nodeStyles[d.type].strokeWidth
      )

    // Node type icons (text based)
    const nodeIcons = {
      device:   '◉',
      isp:      '⬡',
      asn:      '◈',
      upstream: '◇',
      internet: '⊕'
    }

    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', d =>
        nodeStyles[d.type].strokeColor
      )
      .attr('font-size', d =>
        nodeStyles[d.type].radius * 0.8
      )
      .text(d => nodeIcons[d.type])

    // Node labels below
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d =>
        nodeStyles[d.type].radius + 14
      )
      .attr('fill', tc('rgba(255,255,255,0.7)'))
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text(d => truncateString(d.label, 16))

    // Node sublabels
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d =>
        nodeStyles[d.type].radius + 26
      )
      .attr('fill', tc('rgba(255,255,255,0.35)'))
      .attr('font-size', '9px')
      .text(d => truncateString(d.sublabel, 14))

    // Initialize force simulation
    routingSimulation = d3
      .forceSimulation(nodes)
      .force('link',
        d3.forceLink(links)
          .id(d => d.id)
          .distance(isNarrow ? width * 0.32 : width * 0.18)
          .strength(0.8)
      )
      .force('charge',
        d3.forceManyBody()
          .strength(-120)
      )
      .force('x',
        d3.forceX(d => d.x || width / 2)
          .strength(d => d.fixed ? 1 : 0.3)
      )
      .force('y',
        d3.forceY(d => d.y || height / 2)
          .strength(d => d.fixed ? 1 : 0.5)
      )
      .alpha(0.8)
      .alphaDecay(0.05)

    // Update positions on tick
    routingSimulation.on('tick', () => {
      // Update link positions
      linkGroup.selectAll('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      // Update link label positions
      linkGroup.selectAll('text')
        .attr('x', d =>
          (d.source.x + d.target.x) / 2
        )
        .attr('y', d =>
          (d.source.y + d.target.y) / 2
        )

      // Update node positions
      nodeGroup.selectAll('.ndic-routing-node')
        .attr('transform', d =>
          `translate(${
            Math.max(
              nodeStyles[d.type].radius,
              Math.min(
                width - nodeStyles[d.type].radius,
                d.x
              )
            )
          }, ${
            Math.max(
              nodeStyles[d.type].radius,
              Math.min(
                height - 40,
                d.y
              )
            )
          })`
        )
    })

    // Animate pulse rings
    const animatePulse = () => {
      nodeGroup.selectAll('.ndic-node-pulse')
        .transition()
        .duration(1500)
        .ease(d3.easeSinOut)
        .attr('r', d =>
          nodeStyles[d.type].radius + 16
        )
        .attr('opacity', 0)
        .transition()
        .duration(0)
        .attr('r', d =>
          nodeStyles[d.type].radius + 4
        )
        .attr('opacity', 0.3)
        .on('end', animatePulse)
    }

    animatePulse()

    logSystem(
      'INFO',
      'ASN routing diagram initialized'
    )
  }

  // Update routing diagram with new data
  const updateRoutingDiagram = () => {
    initRoutingDiagram()
  }

  // ───────────────────────────────────────
  // CANVAS 8 — CAPABILITY BOOLEAN GRID
  // Visual grid of all browser capabilities
  // Grouped by category
  // ───────────────────────────────────────

  const initCapabilityGrid = () => {
    if (!isD3Available()) return

    const container = el('canvas8-capability-grid')
    if (!container) return

    d3.select('#canvas8-capability-grid')
      .selectAll('*')
      .remove()

    const caps = STATE.capabilities

    // Capability definitions with categories
    const capabilities = [
      // AI and Compute
      {
        id: 'webgpu',
        label: 'WebGPU',
        category: 'AI & Compute',
        value: caps.webgpu
      },
      {
        id: 'wasm',
        label: 'WebAssembly',
        category: 'AI & Compute',
        value: caps.wasm
      },
      {
        id: 'wasmThreads',
        label: 'WASM Threads',
        category: 'AI & Compute',
        value: caps.wasmThreads
      },
      {
        id: 'sharedArrayBuffer',
        label: 'SharedArrayBuffer',
        category: 'AI & Compute',
        value: caps.sharedArrayBuffer
      },
      {
        id: 'webnn',
        label: 'Web Neural Network',
        category: 'AI & Compute',
        value: caps.webnn
      },

      // Communication
      {
        id: 'webrtc',
        label: 'WebRTC',
        category: 'Communication',
        value: caps.webrtc
      },
      {
        id: 'websockets',
        label: 'WebSockets',
        category: 'Communication',
        value: caps.websockets
      },
      {
        id: 'serverSentEvents',
        label: 'Server-Sent Events',
        category: 'Communication',
        value: caps.serverSentEvents
      },
      {
        id: 'pushApi',
        label: 'Push API',
        category: 'Communication',
        value: caps.pushApi
      },
      {
        id: 'webBluetooth',
        label: 'Web Bluetooth',
        category: 'Communication',
        value: caps.webBluetooth
      },
      {
        id: 'webUsb',
        label: 'Web USB',
        category: 'Communication',
        value: caps.webUsb
      },
      {
        id: 'webTransport',
        label: 'WebTransport',
        category: 'Communication',
        value: caps.webTransport
      },

      // Storage
      {
        id: 'indexedDb',
        label: 'IndexedDB',
        category: 'Storage',
        value: caps.indexedDb
      },
      {
        id: 'cacheApi',
        label: 'Cache API',
        category: 'Storage',
        value: caps.cacheApi
      },
      {
        id: 'fileSystemAccess',
        label: 'File System Access',
        category: 'Storage',
        value: caps.fileSystemAccess
      },
      {
        id: 'storageManager',
        label: 'Storage Manager',
        category: 'Storage',
        value: caps.storageManager
      },
      {
        id: 'opfs',
        label: 'Origin Private FS',
        category: 'Storage',
        value: caps.opfs
      },

      // Rendering
      {
        id: 'webgl2',
        label: 'WebGL 2',
        category: 'Rendering',
        value: caps.webgl2
      },
      {
        id: 'webgl',
        label: 'WebGL',
        category: 'Rendering',
        value: caps.webgl
      },
      {
        id: 'canvas2d',
        label: 'Canvas 2D',
        category: 'Rendering',
        value: caps.canvas2d
      },
      {
        id: 'offscreenCanvas',
        label: 'OffscreenCanvas',
        category: 'Rendering',
        value: caps.offscreenCanvas
      },
      {
        id: 'cssGrid',
        label: 'CSS Grid',
        category: 'Rendering',
        value: caps.cssGrid
      },

      // System
      {
        id: 'serviceWorker',
        label: 'Service Worker',
        category: 'System',
        value: caps.serviceWorker
      },
      {
        id: 'notifications',
        label: 'Notifications',
        category: 'System',
        value: caps.notifications
      },
      {
        id: 'geolocation',
        label: 'Geolocation',
        category: 'System',
        value: caps.geolocation
      },
      {
        id: 'mediaDevices',
        label: 'Media Devices',
        category: 'System',
        value: caps.mediaDevices
      },
      {
        id: 'wakeLock',
        label: 'Wake Lock',
        category: 'System',
        value: caps.wakeLock
      },
      {
        id: 'paymentRequest',
        label: 'Payment Request',
        category: 'System',
        value: caps.paymentRequest
      }
    ]

    // Group by category
    const categories = [
      'AI & Compute',
      'Communication',
      'Storage',
      'Rendering',
      'System'
    ]

    const categoryColors = {
      'AI & Compute':  tc('#9f7aea'),
      'Communication': tc('#63b3ed'),
      'Storage':       tc('#68d391'),
      'Rendering':     tc('#ed8936'),
      'System':        tc('#76e4f7')
    }

    const containerWidth =
      container.clientWidth || 600
    const tileSize = 90
    const tileGap = 8
    const tilesPerRow = Math.floor(
      containerWidth / (tileSize + tileGap)
    )

    const svg = d3
      .select('#canvas8-capability-grid')
      .append('svg')
      .attr('width', '100%')
      .attr('class', 'ndic-capability-svg')

    let currentY = 0
    let totalHeight = 0

    categories.forEach(category => {
      const categoryCaps = capabilities.filter(
        c => c.category === category
      )

      if (categoryCaps.length === 0) return

      const color = categoryColors[category]

      // Category header
      svg.append('text')
        .attr('x', 0)
        .attr('y', currentY + 16)
        .attr('fill', color)
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .attr('letter-spacing', '0.1em')
        .attr('text-transform', 'uppercase')
        .text(category.toUpperCase())

      currentY += 28

      // Calculate rows needed
      const rows = Math.ceil(
        categoryCaps.length / tilesPerRow
      )

      categoryCaps.forEach((cap, index) => {
        const col = index % tilesPerRow
        const row = Math.floor(
          index / tilesPerRow
        )

        const x = col * (tileSize + tileGap)
        const y = currentY +
          row * (tileSize * 0.6 + tileGap)

        const tileGroup = svg.append('g')
          .attr('class', 'ndic-cap-tile')
          .attr('transform',
            `translate(${x}, ${y})`
          )

        // Tile background
        tileGroup.append('rect')
          .attr('width', tileSize)
          .attr('height', tileSize * 0.55)
          .attr('rx', 6)
          .attr('fill', cap.value
            ? `${color}22`
            : tc('rgba(255,255,255,0.03)')
          )
          .attr('stroke', cap.value
            ? color
            : tc('rgba(255,255,255,0.08)')
          )
          .attr('stroke-width', cap.value
            ? 1.5
            : 1
          )

        // Status indicator dot
        tileGroup.append('circle')
          .attr('cx', tileSize - 10)
          .attr('cy', 10)
          .attr('r', 4)
          .attr('fill', cap.value
            ? color
            : tc('rgba(255,255,255,0.15)')
          )

        // Capability label
        tileGroup.append('text')
          .attr('x', 8)
          .attr('y', tileSize * 0.35)
          .attr('fill', cap.value
            ? tc('rgba(255,255,255,0.85)')
            : tc('rgba(255,255,255,0.25)')
          )
          .attr('font-size', '9px')
          .attr('font-weight', cap.value
            ? '600' : '400'
          )
          .text(cap.label)

        // Supported / Not supported text
        tileGroup.append('text')
          .attr('x', 8)
          .attr('y', tileSize * 0.52)
          .attr('fill', cap.value
            ? color
            : tc('rgba(255,255,255,0.2)')
          )
          .attr('font-size', '8px')
          .text(cap.value
            ? 'Supported'
            : 'Not Supported'
          )

        // Entrance animation
        tileGroup
          .attr('opacity', 0)
          .transition()
          .delay(index * 30)
          .duration(300)
          .attr('opacity', 1)
      })

      const rowHeight = rows *
        (tileSize * 0.6 + tileGap)

      currentY += rowHeight + 20
      totalHeight = currentY
    })

    // Set SVG height
    svg.attr('height', totalHeight)

    logSystem(
      'INFO',
      'Capability grid rendered'
    )
  }

  // Update capability grid
  const updateCapabilityGrid = () => {
    initCapabilityGrid()
  }

  // ───────────────────────────────────────
  // CANVAS 11 — SUB-SCORE RINGS
  // Concentric ring visualization
  // Each ring = one sub-score
  // ───────────────────────────────────────

  const initScoreRings = () => {
    if (!isD3Available()) return

    const container = el('canvas11-score-rings')
    if (!container) return

    d3.select('#canvas11-score-rings')
      .selectAll('*')
      .remove()

    const scores = STATE.scores

    const width = container.clientWidth || 300
    const isNarrow = width < 480
    // Narrow screens need a 3-row legend
    // instead of 1 row, so reserve extra
    // vertical space for it
    const legendRows = isNarrow ? 3 : 1
    const height = Math.min(width, 300) +
      (isNarrow ? (legendRows - 1) * 18 : 0)
    const cx = width / 2
    const cy = (Math.min(width, 300)) / 2
    const maxRadius = Math.min(cx, cy) - 20

    const svg = d3
      .select('#canvas11-score-rings')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    // Score ring definitions
    const rings = [
      {
        key: 'speedScore',
        label: 'Speed',
        color: tc('#63b3ed')
      },
      {
        key: 'performanceScore',
        label: 'Performance',
        color: tc('#68d391')
      },
      {
        key: 'capabilityScore',
        label: 'Capability',
        color: tc('#76e4f7')
      },
      {
        key: 'securityScore',
        label: 'Security',
        color: tc('#f56565')
      },
      {
        key: 'graphicsScore',
        label: 'Graphics',
        color: tc('#ed8936')
      },
      {
        key: 'deviceScore',
        label: 'Device',
        color: tc('#ecc94b')
      },
      {
        key: 'privacyScore',
        label: 'Privacy',
        color: tc('#9f7aea')
      },
      {
        key: 'identityScore',
        label: 'Identity',
        color: tc('#fc8181')
      },
      {
        key: 'networkScore',
        label: 'Network',
        color: tc('#b794f4')
      }
    ]

    const ringCount = rings.length
    const ringThickness = (maxRadius - 10) /
      ringCount
    const ringGap = 2

    // Arc generator
    const arc = d3.arc()

    rings.forEach((ring, index) => {
      const outerRadius =
        maxRadius - index * ringThickness
      const innerRadius =
        outerRadius - ringThickness + ringGap

      const score = scores[ring.key] || 0
      const angle = (score / 100) *
        Math.PI * 2

      // Background track
      svg.append('path')
        .datum({
          startAngle: 0,
          endAngle: Math.PI * 2
        })
        .attr('d', arc({
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          startAngle: -Math.PI / 2,
          endAngle: Math.PI * 2 - Math.PI / 2
        }))
        .attr('fill', tc('rgba(255,255,255,0.04)'))
        .attr('transform',
          `translate(${cx}, ${cy})`
        )

      // Score arc
      svg.append('path')
        .attr('class', `ndic-ring-${ring.key}`)
        .datum({
          startAngle: -Math.PI / 2,
          endAngle: angle - Math.PI / 2
        })
        .attr('d', arc({
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          startAngle: -Math.PI / 2,
          endAngle: score > 0
            ? angle - Math.PI / 2
            : -Math.PI / 2
        }))
        .attr('fill', ring.color)
        .attr('transform',
          `translate(${cx}, ${cy})`
        )
        .attr('opacity', 0)
        .transition()
        .delay(index * 80)
        .duration(600)
        .attr('opacity', 1)

    })

    // Center global score
    svg.append('text')
      .attr('x', cx)
      .attr('y', cy - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', tc('#ffffff'))
      .attr('font-size', '28px')
      .attr('font-weight', '800')
      .attr('font-family', 'Inter, sans-serif')
      .text(scores.globalScore || 0)

    svg.append('text')
      .attr('x', cx)
      .attr('y', cy + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', tc('rgba(255,255,255,0.45)'))
      .attr('font-size', '11px')
      .attr('font-family', 'Inter, sans-serif')
      .text(
        scores.healthClassification ||
        'Computing...'
      )

    // Legend below rings
    const legendCols = isNarrow ? 3 : rings.length
    const legendRowHeight = 18
    const legendColWidth = width / legendCols
    const legendStartY = isNarrow
      ? (Math.min(width, 300)) - 5
      : height - 5

    rings.forEach((ring, index) => {
      const col = index % legendCols
      const row = Math.floor(index / legendCols)
      const lx = (col + 0.5) * legendColWidth
      const ly = legendStartY + row * legendRowHeight
      const score = scores[ring.key] || 0

      const legendGroup = svg.append('g')
        .attr('transform',
          `translate(${lx}, ${ly})`
        )

      legendGroup.append('circle')
        .attr('r', 3)
        .attr('fill', ring.color)
        .attr('cy', -8)

      legendGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', tc('rgba(255,255,255,0.5)'))
        .attr('font-size', isNarrow ? '9px' : '7px')
        .attr('y', 0)
        .text(
          isNarrow
            ? truncateString(ring.label, 10)
            : ring.label
        )
    })

    logSystem(
      'INFO',
      'Score rings diagram initialized'
    )
  }

  // Update score rings
  const updateScoreRings = () => {
    initScoreRings()
  }

  // ───────────────────────────────────────
  // RESIZE HANDLER
  // Reinitializes responsive diagrams
  // ───────────────────────────────────────

  const resize = () => {
    // Debounced reinit of all diagrams
    const containers = [
      'canvas1-routing-diagram',
      'canvas8-capability-grid',
      'canvas11-score-rings'
    ]

    containers.forEach(id => {
      if (el(id)) {
        d3.select(`#${id}`)
          .select('svg')
          .attr('width', '100%')
      }
    })

    // Reinit routing diagram for new dimensions
    if (el('canvas1-routing-diagram') &&
        STATE.network.asn) {
      initRoutingDiagram()
    }
  }

  // ───────────────────────────────────────
  // INITIALIZE ALL D3 DIAGRAMS
  // ───────────────────────────────────────

  const initializeAll = () => {
    if (!isD3Available()) return

    logSystem(
      'INFO',
      'D3 diagram engine initializing'
    )

    // Diagrams are initialized lazily
    // when their canvas data is ready
    // initRoutingDiagram called by Canvas1
    // initCapabilityGrid called by Canvas8
    // initScoreRings called by Canvas11

    logSystem(
      'INFO',
      'D3 diagram engine ready'
    )
  }

  // ───────────────────────────────────────
  // CLEANUP
  // ───────────────────────────────────────

  const destroy = () => {
    if (routingSimulation) {
      routingSimulation.stop()
      routingSimulation = null
    }

    if (routingResizeObserver) {
      routingResizeObserver.disconnect()
      routingResizeObserver = null
    }

    const containers = [
      'canvas1-routing-diagram',
      'canvas8-capability-grid',
      'canvas11-score-rings'
    ]

    containers.forEach(id => {
      if (el(id)) {
        d3.select(`#${id}`)
          .selectAll('*')
          .remove()
      }
    })
  }

  return {
    initializeAll,
    initRoutingDiagram,
    updateRoutingDiagram,
    initCapabilityGrid,
    updateCapabilityGrid,
    initScoreRings,
    updateScoreRings,
    resize,
    destroy
  }

})()
