// ─────────────────────────────────────────
// CANVAS 8 RENDERER
// Capability Matrix
// What Can Your Browser Do?
// ─────────────────────────────────────────

const Canvas8 = (() => {

  const render = () => {
    const c = STATE.capabilities
    const s = STATE.scores

    // Capability score
    const scoreEl = el('c8-capability-score')
    if (scoreEl) {
      scoreEl.textContent =
        c.capabilityScore !== null
          ? `${c.capabilityScore}/100`
          : '—'
      scoreEl.style.color =
        getScoreColor(c.capabilityScore || 0)
    }

    setText('c8-capability-count',
      c.capabilityCount !== null
        ? `${c.capabilityCount} of ${c.totalChecked || 28}`
        : '—'
    )

    // Storage estimate
    if (c.storageEstimate) {
      setText('c8-storage-quota',
        c.storageEstimate.quotaMB !== null
          ? `${c.storageEstimate.quotaMB} MB`
          : '—'
      )
      setText('c8-storage-usage',
        c.storageEstimate.usageMB !== null
          ? `${c.storageEstimate.usageMB} MB`
          : '—'
      )
    }

    // Battery status
    if (c.batteryStatus) {
      setBooleanIndicator(
        'c8-battery-charging',
        c.batteryStatus.charging,
        'Charging', 'Discharging'
      )
      setText('c8-battery-level',
        c.batteryStatus.level !== undefined
          ? `${c.batteryStatus.level}%`
          : '—'
      )
    }

    // Notification permission
    setText('c8-notification-permission',
      capitalizeFirst(
        c.notificationPermission
      ) || '—'
    )

    // Canvas score
    setText('c8-score',
      s.capabilityScore
        ? `${s.capabilityScore}/100`
        : '—'
    )
    setColor('c8-score',
      getScoreColor(s.capabilityScore || 0)
    )

    // ─── D3 CAPABILITY GRID ───────────────
    D3DiagramsViz.initCapabilityGrid()

    const deepDiveLink = el('c8-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas8
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas8
    }

    if (c.capabilityScore !== null) {
      MonitoringEngine.revealCanvas('canvas-8')
    }
  }

  return { render }
})()
