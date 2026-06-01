// ─────────────────────────────────────────
// CANVAS 12 RENDERER
// Live Intelligence Feed
// What Just Happened?
// ─────────────────────────────────────────

const Canvas12 = (() => {

  const render = () => {
    const events = STATE.events
    const meta = STATE.meta

    // ─── PARAMETERS ───────────────────────

    // Online status
    const statusEl = el('c12-online-status')
    if (statusEl) {
      statusEl.textContent =
        meta.isOnline ? 'Online' : 'Offline'
      statusEl.style.color =
        meta.isOnline
          ? 'var(--color-success)'
          : 'var(--color-danger)'
    }

    // Backend health
    const backendEl = el('c12-backend-health')
    if (backendEl) {
      backendEl.textContent =
        meta.backendHealthy
          ? 'Healthy'
          : 'Degraded'
      backendEl.style.color =
        meta.backendHealthy
          ? 'var(--color-success)'
          : 'var(--color-warning)'
    }

    // Event counts
    setText('c12-total-events',
      String(events.length)
    )

    const criticals = getCriticalCount()
    setText('c12-critical-count',
      String(criticals)
    )
    setColor('c12-critical-count',
      criticals > 0
        ? 'var(--color-critical)'
        : 'var(--color-text-muted)'
    )

    const warnings = getWarningCount()
    setText('c12-warning-count',
      String(warnings)
    )
    setColor('c12-warning-count',
      warnings > 0
        ? 'var(--color-warning)'
        : 'var(--color-text-muted)'
    )

    // API call count
    setText('c12-api-calls',
      String(meta.apiCallCount || 0)
    )

    // Error count
    setText('c12-error-count',
      String(meta.errorCount || 0)
    )
    setColor('c12-error-count',
      (meta.errorCount || 0) > 0
        ? 'var(--color-warning)'
        : 'var(--color-text-muted)'
    )

    // Last network change
    setText('c12-last-network-change',
      meta.lastNetworkChange
        ? formatTimestamp(meta.lastNetworkChange)
        : 'None detected'
    )

    // Scan start time
    setText('c12-scan-start-time',
      meta.scanStartTime
        ? formatTimestamp(meta.scanStartTime)
        : '—'
    )

    // AI summary source
    setText('c12-ai-summary-source',
      STATE.summaries.source
        ? capitalizeFirst(STATE.summaries.source)
        : '—'
    )

    // Last AI update
    setText('c12-ai-last-updated',
      STATE.summaries.lastUpdated
        ? formatTimestamp(STATE.summaries.lastUpdated)
        : '—'
    )

    // ─── LIVE FEED ────────────────────────
    // Feed is rendered by logger.js
    // renderFullFeed() rebuilds from STATE
    // Each new event auto-appends via
    // renderFeedEvent() in logger.js
    // Canvas 12 is always visible
    MonitoringEngine.revealCanvas('canvas-12')

    const deepDiveLink =
      el('c12-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas12
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas12
    }
  }

  return { render }
})()
