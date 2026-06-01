// ─────────────────────────────────────────
// CANVAS 4 RENDERER
// Live Network Monitor
// How Fast Is Your Connection?
// ─────────────────────────────────────────

const Canvas4 = (() => {

  const getLatencyColor = (rtt) => {
    if (rtt === null) {
      return 'var(--color-text-muted)'
    }
    if (rtt <= 50)  return 'var(--color-score-excellent)'
    if (rtt <= 100) return 'var(--color-score-good)'
    if (rtt <= 200) return 'var(--color-score-fair)'
    if (rtt <= 400) return 'var(--color-score-poor)'
    return 'var(--color-score-critical)'
  }

  const render = () => {
    const ln = STATE.liveNetwork
    const s  = STATE.scores

    // ─── PARAMETERS ───────────────────────

    // Current latency — prominent
    const rttEl = el('c4-current-rtt')
    if (rttEl) {
      rttEl.textContent = ln.currentRtt !== null
        ? `${ln.currentRtt}ms`
        : '—'
      rttEl.style.color =
        getLatencyColor(ln.currentRtt)
    }

    setText('c4-average-rtt',
      ln.averageRtt !== null
        ? `${ln.averageRtt}ms`
        : '—'
    )
    setColor('c4-average-rtt',
      getLatencyColor(ln.averageRtt)
    )

    setText('c4-peak-rtt',
      ln.peakRtt !== null
        ? `${ln.peakRtt}ms`
        : '—'
    )

    setText('c4-lowest-rtt',
      ln.lowestRtt !== null
        ? `${ln.lowestRtt}ms`
        : '—'
    )

    // Bandwidth
    setText('c4-bandwidth',
      ln.bandwidth !== null
        ? formatBandwidth(ln.bandwidth)
        : '—'
    )

    // Effective connection type badge
    const connTypeEl = el('c4-effective-type')
    if (connTypeEl) {
      connTypeEl.textContent =
        (ln.effectiveType || '—').toUpperCase()
      connTypeEl.setAttribute(
        'data-type',
        ln.effectiveType || 'unknown'
      )
    }

    // Save data mode
    setBooleanIndicator(
      'c4-save-data',
      ln.saveData,
      'On', 'Off'
    )

    // Stability index
    const stabilityEl = el('c4-stability-index')
    if (stabilityEl) {
      const stability = ln.stabilityIndex
      stabilityEl.textContent =
        stability !== null
          ? `${stability}%`
          : '—'
      stabilityEl.style.color =
        getScoreColor(stability || 0)
    }

    // Packet loss estimate
    setText('c4-packet-loss',
      ln.packetLossEstimate !== null
        ? `~${ln.packetLossEstimate}%`
        : '—'
    )

    // Connection quality rating
    const qualityEl = el('c4-quality-rating')
    if (qualityEl) {
      qualityEl.textContent =
        ln.qualityRating || '—'
      qualityEl.style.color =
        getConnectionQualityColor(
          ln.qualityRating
        )
    }

    // Jitter estimate
    setText('c4-jitter-estimate',
      ln.jitterEstimate !== null
        ? `${ln.jitterEstimate}ms`
        : '—'
    )

    // Uptime since load
    setText('c4-uptime',
      formatUptime(ln.uptimeSinceLoad)
    )

    // Connection change count
    setText('c4-connection-changes',
      ln.connectionChangeCount !== undefined
        ? String(ln.connectionChangeCount)
        : '0'
    )

    // Network API availability
    const apiAvailEl = el('c4-api-available')
    if (apiAvailEl) {
      const available =
        ln.effectiveType !== null
      apiAvailEl.textContent = available
        ? 'Available'
        : 'Not Available (Firefox/Safari)'
      apiAvailEl.style.color = available
        ? 'var(--color-success)'
        : 'var(--color-text-muted)'
    }

    // Canvas score
    setText('c4-score',
      s.networkScore
        ? `${s.networkScore}/100`
        : '—'
    )
    setColor('c4-score',
      getScoreColor(s.networkScore || 0)
    )

    // ─── VISUALIZATIONS ───────────────────
    ChartJSViz.updateCanvas3Charts()

    // ─── DEEP DIVE LINK ───────────────────
    const deepDiveLink = el('c4-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas4
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas4
    }

    // ─── CANVAS REVEAL ────────────────────
    MonitoringEngine.revealCanvas('canvas-4')
  }

  return { render }

})()
