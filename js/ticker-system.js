// ─────────────────────────────────────────
// INTELREAP LIVE TELEMETRY TICKER
// Endless horizontal scroll ticker
// Two modes:
// LIVE — reads from STATE (index.html)
// STATIC — sample data (all other pages)
// Updates every 5 seconds on live mode
// ─────────────────────────────────────────

const TickerSystem = (() => {

  // ─────────────────────────────────────
  // INTERNAL STATE
  // ─────────────────────────────────────

  let tickerInterval = null
  let isLiveMode = false
  let tickerTrack = null

  // ─────────────────────────────────────
  // STATIC TICKER DATA
  // Shown on pages without live STATE
  // Demonstrates tool capabilities
  // ─────────────────────────────────────

  const STATIC_TICKER_ITEMS = [
    { label: 'RTT', value: '—ms', unit: '' },
    { label: 'Bandwidth', value: '—', unit: 'Mbps' },
    { label: 'Network Tier', value: 'Scanning...', unit: '' },
    { label: 'Trust Score', value: '—', unit: '/100' },
    { label: 'VPN Status', value: '—', unit: '' },
    { label: 'Security Score', value: '—', unit: '/100' },
    { label: 'LCP', value: '—', unit: 'ms' },
    { label: 'FCP', value: '—', unit: 'ms' },
    { label: 'CLS', value: '—', unit: '' },
    { label: 'GPU Tier', value: '—', unit: '' },
    { label: 'WebGL', value: '—', unit: '' },
    { label: 'CPU Cores', value: '—', unit: '' },
    { label: 'RAM', value: '—', unit: 'GB' },
    { label: 'ASN', value: '—', unit: '' },
    { label: 'Connection', value: '—', unit: '' },
    { label: 'Global Score', value: '—', unit: '/100' },
    { label: 'Capabilities', value: '—', unit: '/56' },
    { label: 'TTFB', value: '—', unit: 'ms' },
    { label: 'Stability', value: '—', unit: '%' },
    { label: 'Risk Level', value: '—', unit: '' },
    { label: 'Browser', value: '—', unit: '' },
    { label: 'OS', value: '—', unit: '' },
    { label: 'WebRTC', value: '—', unit: '' },
    { label: 'Registry', value: '—', unit: '' },
    { label: 'Health', value: '—', unit: '' }
  ]

  // ─────────────────────────────────────
  // SAMPLE TICKER DATA
  // Shown on non-intelligence pages
  // Illustrates what the tool reveals
  // ─────────────────────────────────────

  const SAMPLE_TICKER_ITEMS = [
    { label: 'RTT', value: '42', unit: 'ms', highlight: false },
    { label: 'Network Tier', value: 'Tier 1', unit: '', highlight: true },
    { label: 'Trust Score', value: '98', unit: '/100', highlight: true },
    { label: 'VPN Status', value: 'Clean Route', unit: '', highlight: false },
    { label: 'Security Score', value: '91', unit: '/100', highlight: true },
    { label: 'LCP', value: '1.2', unit: 's', highlight: false },
    { label: 'FCP', value: '0.8', unit: 's', highlight: false },
    { label: 'WebGPU', value: 'Supported', unit: '', highlight: true },
    { label: 'WebGL', value: '2.0', unit: '', highlight: false },
    { label: 'Bandwidth', value: '94.2', unit: 'Mbps', highlight: false },
    { label: 'CPU Cores', value: '10', unit: ' cores', highlight: false },
    { label: 'RAM', value: '16', unit: 'GB', highlight: false },
    { label: 'CLS Score', value: '0.02', unit: '', highlight: true },
    { label: 'Global Score', value: '87', unit: '/100', highlight: true },
    { label: 'Capabilities', value: '48', unit: '/56', highlight: false },
    { label: 'TTFB', value: '84', unit: 'ms', highlight: false },
    { label: 'Stability', value: '97', unit: '%', highlight: true },
    { label: 'Browser', value: 'Chrome 125', unit: '', highlight: false },
    { label: 'GPU', value: 'Ultra Tier', unit: '', highlight: true },
    { label: 'Risk Level', value: 'Low', unit: '', highlight: false },
    { label: 'WebRTC', value: 'Safe', unit: '', highlight: true },
    { label: 'Registry', value: 'ARIN', unit: '', highlight: false },
    { label: 'Health', value: 'Excellent', unit: '', highlight: true },
    { label: 'HTTPS', value: 'Secure', unit: '', highlight: false },
    { label: 'Connection', value: '4G LTE', unit: '', highlight: false }
  ]

  // ─────────────────────────────────────
  // READ LIVE STATE
  // Only available on index.html
  // ─────────────────────────────────────

  const getLiveTickerItems = () => {
    if (typeof STATE === 'undefined') {
      return STATIC_TICKER_ITEMS
    }

    const n = STATE.network
    const i = STATE.identity
    const v = STATE.vpn
    const ln = STATE.liveNetwork
    const d = STATE.device
    const g = STATE.graphics
    const sec = STATE.security
    const sp = STATE.speed
    const p = STATE.performance
    const c = STATE.capabilities
    const s = STATE.scores

    return [
      {
        label: 'RTT',
        value: ln.currentRtt !== null
          ? String(ln.currentRtt)
          : '—',
        unit: 'ms',
        highlight: ln.currentRtt !== null &&
          ln.currentRtt <= 50
      },
      {
        label: 'Bandwidth',
        value: ln.bandwidth !== null
          ? ln.bandwidth.toFixed(1)
          : '—',
        unit: 'Mbps',
        highlight: false
      },
      {
        label: 'Network Tier',
        value: n.networkTier || '—',
        unit: '',
        highlight: n.networkTierNumber === 1
      },
      {
        label: 'ASN',
        value: n.asn || '—',
        unit: '',
        highlight: false
      },
      {
        label: 'ISP',
        value: i.isp
          ? i.isp.substring(0, 20)
          : '—',
        unit: '',
        highlight: false
      },
      {
        label: 'Location',
        value: i.city && i.countryCode
          ? `${i.city}, ${i.countryCode}`
          : '—',
        unit: '',
        highlight: false
      },
      {
        label: 'VPN',
        value: v.vpnDetected === 'yes'
          ? 'Detected'
          : v.vpnDetected === 'no'
          ? 'Clean'
          : v.vpnDetected === 'maybe'
          ? 'Suspect'
          : '—',
        unit: '',
        highlight: v.vpnDetected === 'yes'
      },
      {
        label: 'Trust Score',
        value: v.trustScore !== null
          ? String(v.trustScore)
          : '—',
        unit: '/100',
        highlight: (v.trustScore || 0) >= 90
      },
      {
        label: 'Route',
        value: v.routeClassification || '—',
        unit: '',
        highlight:
          v.routeClassification === 'Clean'
      },
      {
        label: 'Security',
        value: sec.securityScore !== null
          ? String(sec.securityScore)
          : '—',
        unit: '/100',
        highlight: (sec.securityScore || 0) >= 80
      },
      {
        label: 'Risk',
        value: sec.riskLevel || '—',
        unit: '',
        highlight: sec.riskLevel === 'Low'
      },
      {
        label: 'WebRTC',
        value: sec.webrtcExposure || '—',
        unit: '',
        highlight:
          sec.webrtcExposure === 'Safe'
      },
      {
        label: 'HTTPS',
        value: sec.httpsStatus || '—',
        unit: '',
        highlight:
          sec.httpsStatus === 'Secure'
      },
      {
        label: 'OS',
        value: d.os
          ? d.os.substring(0, 16)
          : '—',
        unit: '',
        highlight: false
      },
      {
        label: 'Browser',
        value: d.browser
          ? d.browser.substring(0, 16)
          : '—',
        unit: '',
        highlight: false
      },
      {
        label: 'Device',
        value: d.deviceType || '—',
        unit: '',
        highlight: false
      },
      {
        label: 'CPU',
        value: d.cpuCores !== null
          ? String(d.cpuCores)
          : '—',
        unit: ' cores',
        highlight: (d.cpuCores || 0) >= 8
      },
      {
        label: 'RAM',
        value: d.ram !== null
          ? String(d.ram)
          : '—',
        unit: 'GB',
        highlight: (d.ram || 0) >= 8
      },
      {
        label: 'Tier',
        value: d.capabilityTier || '—',
        unit: '',
        highlight:
          d.capabilityTier === 'Flagship'
      },
      {
        label: 'GPU',
        value: g.graphicsTier || '—',
        unit: ' tier',
        highlight:
          g.graphicsTier === 'Ultra'
      },
      {
        label: 'WebGL',
        value: g.webglVersion || '—',
        unit: '',
        highlight:
          g.webglVersionNumber === 2
      },
      {
        label: 'WebGPU',
        value: c.webgpu
          ? 'Supported'
          : 'Not Supported',
        unit: '',
        highlight: c.webgpu === true
      },
      {
        label: 'LCP',
        value: sp.lcp !== null
          ? String(sp.lcp)
          : '—',
        unit: 'ms',
        highlight: sp.lcpRating === 'Good'
      },
      {
        label: 'FCP',
        value: sp.fcp !== null
          ? String(sp.fcp)
          : '—',
        unit: 'ms',
        highlight: sp.fcpRating === 'Good'
      },
      {
        label: 'CLS',
        value: sp.cls !== null
          ? String(sp.cls)
          : '—',
        unit: '',
        highlight: sp.clsRating === 'Good'
      },
      {
        label: 'TTFB',
        value: p.ttfb !== null
          ? String(p.ttfb)
          : '—',
        unit: 'ms',
        highlight: (p.ttfb || 999) <= 200
      },
      {
        label: 'Load Time',
        value: p.pageLoadTime !== null
          ? String(p.pageLoadTime)
          : '—',
        unit: 'ms',
        highlight: (p.pageLoadTime || 9999) <= 1000
      },
      {
        label: 'Stability',
        value: ln.stabilityIndex !== null
          ? String(ln.stabilityIndex)
          : '—',
        unit: '%',
        highlight: (ln.stabilityIndex || 0) >= 90
      },
      {
        label: 'Capabilities',
        value: c.capabilityCount !== null
          ? String(c.capabilityCount)
          : '—',
        unit: `/56`,
        highlight: (c.capabilityCount || 0) >= 45
      },
      {
        label: 'Score',
        value: s.globalScore
          ? String(s.globalScore)
          : '—',
        unit: '/100',
        highlight: (s.globalScore || 0) >= 80
      },
      {
        label: 'Health',
        value: s.healthClassification || '—',
        unit: '',
        highlight:
          s.healthClassification === 'Excellent'
      }
    ]
  }

  // ─────────────────────────────────────
  // BUILD TICKER ITEMS HTML
  // Duplicated 3x for seamless loop
  // ─────────────────────────────────────

  const buildTickerHTML = (items) => {
    const itemsHTML = items.map(item => `
      <span class="ndic-ticker-item ${
        item.highlight
          ? 'ndic-ticker-item--highlight'
          : ''
      }">
        <span class="ndic-ticker-label">
          ${item.label}
        </span>
        <span class="ndic-ticker-value">
          ${item.value}${item.unit ? `<span class="ndic-ticker-unit">${item.unit}</span>` : ''}
        </span>
      </span>
      <span class="ndic-ticker-sep"
        aria-hidden="true">
        ·
      </span>
    `).join('')

    // Triple the content for seamless loop
    return itemsHTML + itemsHTML + itemsHTML
  }

  // ─────────────────────────────────────
  // UPDATE LIVE TICKER
  // Called every 5 seconds in live mode
  // ─────────────────────────────────────

  const updateLiveTicker = () => {
    if (!tickerTrack) return

    const items = getLiveTickerItems()
    tickerTrack.innerHTML = buildTickerHTML(items)
  }

  // ─────────────────────────────────────
  // BUILD TICKER
  // ─────────────────────────────────────

  const buildTicker = (container) => {
    // Detect mode
    isLiveMode = typeof STATE !== 'undefined'

    const items = isLiveMode
      ? getLiveTickerItems()
      : SAMPLE_TICKER_ITEMS

    const ticker = document.createElement('div')
    ticker.className = 'ndic-ticker'
    ticker.setAttribute('aria-label',
      'Live intelligence telemetry'
    )
    ticker.setAttribute('role', 'marquee')
    ticker.setAttribute('aria-live', 'off')

    const track = document.createElement('div')
    track.className = 'ndic-ticker-track'
    track.innerHTML = buildTickerHTML(items)

    ticker.appendChild(track)
    container.appendChild(ticker)

    tickerTrack = track

    // Pause on hover
    ticker.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused'
    })
    ticker.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running'
    })

    // Touch pause
    ticker.addEventListener(
      'touchstart',
      () => {
        track.style.animationPlayState = 'paused'
      },
      { passive: true }
    )
    ticker.addEventListener(
      'touchend',
      () => {
        track.style.animationPlayState = 'running'
      },
      { passive: true }
    )

    // Start live update cycle if on
    // intelligence page with STATE
    if (isLiveMode) {
      tickerInterval = setInterval(
        updateLiveTicker,
        5000
      )
    }
  }

  // ─────────────────────────────────────
  // INJECT INTO ALL CONTAINERS
  // ─────────────────────────────────────

  const injectAll = () => {
    const containers = document.querySelectorAll(
      '.ndic-ticker-container'
    )
    containers.forEach(container => {
      if (container.dataset.tickerInjected) return
      buildTicker(container)
      container.dataset.tickerInjected = 'true'
    })
  }

  // ─────────────────────────────────────
  // STOP
  // ─────────────────────────────────────

  const stop = () => {
    if (tickerInterval) {
      clearInterval(tickerInterval)
      tickerInterval = null
    }
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = () => {
    injectAll()

    // Cleanup on unload
    window.addEventListener(
      'beforeunload',
      stop
    )
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    )
  } else {
    init()
  }

  return {
    init,
    injectAll,
    updateLiveTicker,
    stop
  }

})()
