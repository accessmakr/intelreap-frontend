// ─────────────────────────────────────────
// AI SUMMARY ENGINE
// Three layer AI system powering all
// canvas summaries and full system report
// Layer 1 — Script engine (always instant)
// Layer 2 — Groq via backend (fast AI)
// Layer 3 — Gemini via backend (fallback)
// ─────────────────────────────────────────

const AISummaryEngine = (() => {

  // ───────────────────────────────────────
  // INTERNAL STATE
  // ───────────────────────────────────────

  let summaryRefreshInterval = null
  let isRefreshing = false
  let lastFullSummaryTime = 0
  const FULL_SUMMARY_COOLDOWN = 55000

  // ───────────────────────────────────────
  // LAYER 1 — SCRIPT SUMMARY ENGINE
  // Always runs instantly
  // Never fails
  // Uses actual STATE values
  // ───────────────────────────────────────

  const generateScriptSummary = (
    type,
    canvasId
  ) => {
    if (type === 'full') {
      return generateFullScriptSummary()
    }
    return generateCanvasScriptSummary(canvasId)
  }

  const generateCanvasScriptSummary = (
    canvasId
  ) => {
    const generators = {
      canvas1: () => {
        const n = STATE.network
        if (!n.asnOwner) {
          return 'Network infrastructure scan in progress.'
        }
        return `You are on a ` +
          `${n.networkTier || 'unknown tier'} ` +
          `${n.asnType || 'network'} ` +
          `operated by ${n.asnOwner} ` +
          `under the ${n.allocationRegistry || 'unknown'} registry.`
      },

      canvas2: () => {
        const i = STATE.identity
        if (!i.ip) {
          return 'Network identity resolution in progress.'
        }
        return `Your internet identity resolves to ` +
          `${i.city || 'unknown location'}` +
          `${i.country ? ', ' + i.country : ''} ` +
          `via ${i.isp || 'unknown ISP'} ` +
          `on a ${i.connectionType || 'unknown'} connection.`
      },

      canvas3: () => {
        const v = STATE.vpn
        if (v.vpnDetected === null) {
          return 'VPN and proxy analysis in progress.'
        }
        if (v.torDetected === 'yes') {
          return `TOR network detected on your connection ` +
            `with a trust score of ` +
            `${v.trustScore ?? 'unknown'}/100.`
        }
        if (v.vpnDetected === 'yes') {
          return `VPN detected on your connection ` +
            `with a trust score of ` +
            `${v.trustScore ?? 'unknown'}/100 ` +
            `and ${v.routeClassification || 'unknown'} route classification.`
        }
        return `No VPN or proxy detected. ` +
          `Trust score ${v.trustScore ?? 'unknown'}/100 ` +
          `with a ${v.routeClassification || 'unknown'} route classification.`
      },

      canvas4: () => {
        const ln = STATE.liveNetwork
        if (ln.currentRtt === null) {
          return 'Live network monitoring initializing.'
        }
        return `Your live connection shows ` +
          `${ln.currentRtt}ms latency ` +
          `on a ${ln.effectiveType || 'unknown'} link ` +
          `with ${ln.qualityRating || 'unknown'} quality ` +
          `and ${ln.stabilityIndex || 0}% stability.`
      },

      canvas5: () => {
        const d = STATE.device
        if (!d.os) {
          return 'Device intelligence collection in progress.'
        }
        return `You are using ` +
          `${d.browser || 'unknown browser'} ` +
          `on ${d.os || 'unknown OS'} ` +
          `with ${d.cpuCores || 'unknown'} CPU cores ` +
          `and ${d.ram || 'unknown'}GB RAM — ` +
          `a ${d.capabilityTier || 'unknown'} tier ` +
          `${d.deviceType || 'device'}.`
      },

      canvas6: () => {
        const g = STATE.graphics
        if (!g.gpuVendor) {
          return 'Graphics engine analysis in progress.'
        }
        return `Your ${g.gpuVendor || 'unknown'} GPU ` +
          `supports ${g.webglVersion || 'unknown'} ` +
          `with ${g.hardwareAcceleration || 'unknown'} hardware acceleration ` +
          `placing graphics in the ` +
          `${g.graphicsTier || 'unknown'} tier.`
      },

      canvas7: () => {
        const s = STATE.security
        if (s.httpsStatus === null) {
          return 'Security analysis in progress.'
        }
        const flags = s.securityFlags?.length || 0
        return `Connection is ${s.httpsStatus || 'unknown'} ` +
          `with security score ` +
          `${s.securityScore || 0}/100 ` +
          `and ${s.riskLevel || 'unknown'} risk level` +
          `${flags > 0 ? ` — ${flags} flag${flags > 1 ? 's' : ''} raised` : ''}.`
      },

      canvas8: () => {
        const c = STATE.capabilities
        if (c.capabilityScore === null) {
          return 'Browser capability detection in progress.'
        }
        return `Your browser scores ` +
          `${c.capabilityScore}/100 on capability detection ` +
          `with ${c.capabilityCount || 0} of ` +
          `${c.totalChecked || 28} features supported. ` +
          `WebGPU is ` +
          `${c.webgpu ? 'supported' : 'not supported'} ` +
          `and WebAssembly is ` +
          `${c.wasm ? 'supported' : 'not supported'}.`
      },

      canvas9: () => {
        const p = STATE.performance
        if (!p.pageLoadTime) {
          return 'Performance analysis in progress.'
        }
        return `Page loaded in ` +
          `${formatTime(p.pageLoadTime)} ` +
          `with ${formatTime(p.ttfb)} TTFB ` +
          `placing you in the ` +
          `${p.percentileRating || 'unknown'} ` +
          `performance percentile.`
      },

      canvas10: () => {
        const sp = STATE.speed
        const s = STATE.scores
        if (sp.lcp === null &&
            sp.benchmarkScore === null) {
          return 'Speed and rendering analysis in progress.'
        }
        if (sp.lcp !== null) {
          return `Largest Contentful Paint is ` +
            `${formatLatency(sp.lcp)} ` +
            `rated ${sp.lcpRating || 'unknown'} ` +
            `with overall speed score ` +
            `${s.speedScore || 0}/100.`
        }
        return `Browser benchmark score is ` +
          `${sp.benchmarkScore || 0}/100 ` +
          `placing you in the ` +
          `${sp.percentileRanking || 'unknown'}.`
      },

      canvas11: () => {
        const s = STATE.scores
        if (!s.globalScore) {
          return 'Global score computation in progress.'
        }
        return `Your global environment score is ` +
          `${s.globalScore}/100 ` +
          `with ${s.healthClassification || 'unknown'} classification. ` +
          `Strongest area is ` +
          `${s.strongestArea || 'unknown'} ` +
          `and weakest is ` +
          `${s.weakestArea || 'unknown'}.`
      },

      canvas12: () => {
        const events = STATE.events
        const meta = STATE.meta
        const critical = getCriticalCount()
        const warnings = getWarningCount()
        return `System is ` +
          `${meta.isOnline ? 'online' : 'offline'} ` +
          `with ${events.length} events logged. ` +
          `${critical > 0
            ? `${critical} critical flag${critical > 1 ? 's' : ''} detected. `
            : ''}` +
          `${warnings > 0
            ? `${warnings} warning${warnings > 1 ? 's' : ''} active.`
            : 'No warnings active.'}`
      },

      canvas13: () => {
        const fp = STATE.fingerprinting
        if (fp.uniquenessScore === null) {
          return 'Fingerprint analysis in progress.'
        }
        const flags = []
        if (fp.webdriverDetected) flags.push('automation detected')
        if (fp.adBlockerDetected) flags.push('ad blocker active')
        if (fp.incognitoDetected) flags.push('private browsing likely')
        if (fp.ipv6LeakDetected) flags.push('IPv6 leak detected')

        return `Your fingerprint uniqueness score is ` +
          `${fp.uniquenessScore}/100. ` +
          `${flags.length > 0
            ? flags.join(', ') + '.'
            : 'No automation, leak, or ad blocker signals detected.'}`
      }
    }

    const generator = generators[canvasId]
    if (!generator) {
      return 'Intelligence analysis complete.'
    }

    try {
      return generator()
    } catch {
      return 'Intelligence analysis complete.'
    }
  }

  const generateFullScriptSummary = () => {
    const s = STATE.scores
    const i = STATE.identity
    const d = STATE.device
    const v = STATE.vpn
    const sec = STATE.security
    const ln = STATE.liveNetwork

    if (!s.globalScore && !i.ip) {
      return 'Full intelligence scan in progress. Please wait while all systems collect data.'
    }

    const parts = []

    if (i.ip && i.city) {
      parts.push(
        `You are connecting from ` +
        `${i.city}${i.country ? ', ' + i.country : ''} ` +
        `via ${i.isp || 'unknown ISP'}.`
      )
    }

    if (d.os && d.browser) {
      parts.push(
        `Your ${d.deviceType || 'device'} ` +
        `running ${d.os} with ${d.browser} ` +
        `${d.cpuCores ? `has ${d.cpuCores} CPU cores` : ''} ` +
        `${d.ram ? `and ${d.ram}GB RAM` : ''}.`.trim()
      )
    }

    if (v.routeClassification) {
      const vpnStatus =
        v.torDetected === 'yes'
          ? 'TOR network detected'
          : v.vpnDetected === 'yes'
          ? 'VPN is active'
          : v.vpnDetected === 'maybe'
          ? 'VPN suspicion detected'
          : 'No VPN or proxy detected'

      parts.push(
        `${vpnStatus} with ` +
        `${v.routeClassification} route classification ` +
        `and trust score ${v.trustScore ?? 'unknown'}/100.`
      )
    }

    if (ln.currentRtt !== null) {
      parts.push(
        `Your connection shows ` +
        `${ln.currentRtt}ms latency ` +
        `with ${ln.qualityRating || 'unknown'} quality.`
      )
    }

    if (sec.securityScore !== null) {
      const flags = sec.securityFlags?.length || 0
      parts.push(
        `Security score is ` +
        `${sec.securityScore}/100 ` +
        `with ${sec.riskLevel || 'unknown'} risk` +
        `${flags > 0 ? ` and ${flags} flag${flags > 1 ? 's' : ''} raised` : ''}.`
      )
    }

    if (s.globalScore) {
      parts.push(
        `Overall your environment scores ` +
        `${s.globalScore}/100 — ` +
        `${s.healthClassification || 'unknown'} classification. ` +
        `${s.improvementPriority
          ? `Priority improvement area is ${s.improvementPriority}.`
          : ''}`
      )
    }

    return parts.join(' ')
  }

  // ───────────────────────────────────────
  // RENDER SUMMARY TO DOM
  // Updates canvas summary element
  // ───────────────────────────────────────

  const renderSummaryToDOM = (
    canvasId,
    summary,
    source
  ) => {
    if (!canvasId || !summary) return

    const summaryEl = el(
      `${canvasId}-ai-summary`
    )
    if (!summaryEl) return

    // Typing animation on update
    summaryEl.classList.add(
      'ndic-summary-updating'
    )

    setTimeout(() => {
      summaryEl.textContent = summary
      summaryEl.classList.remove(
        'ndic-summary-updating'
      )
      summaryEl.classList.add(
        'ndic-summary-loaded'
      )

      // Update source badge
      const sourceBadge = el(
        `${canvasId}-ai-source`
      )
      if (sourceBadge) {
        sourceBadge.textContent = source
        sourceBadge.setAttribute(
          'data-source',
          source
        )
      }
    }, 150)
  }

  // Render full system summary
  const renderFullSummaryToDOM = (
    summary,
    source,
    timestamp
  ) => {
    const summaryEl = el('full-system-summary')
    if (summaryEl) {
      summaryEl.classList.add(
        'ndic-summary-updating'
      )
      setTimeout(() => {
        summaryEl.textContent = summary
        summaryEl.classList.remove(
          'ndic-summary-updating'
        )
        summaryEl.classList.add(
          'ndic-summary-loaded'
        )
      }, 150)
    }

    const sourceEl = el('full-summary-source')
    if (sourceEl) {
      sourceEl.textContent = source
    }

    const timeEl = el('full-summary-timestamp')
    if (timeEl) {
      timeEl.textContent =
        `Generated: ${formatTimestamp(timestamp)}`
    }
  }

  // ───────────────────────────────────────
  // CALL BACKEND AI SUMMARY
  // Tries Groq then Gemini
  // Returns script fallback if both fail
  // ───────────────────────────────────────

  const callBackendSummary = async (
    type,
    canvasId
  ) => {
    try {
      const payload = {
        type: type,
        canvas: canvasId || null,
        data: getStateSnapshot()
      }

      const response = await fetchWithTimeout(
        NDIC_CONFIG.BACKEND_URL +
        NDIC_CONFIG.ENDPOINTS.aiSummary,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        },
        20000
      )

      if (!response.ok) {
        throw new Error(
          `AI summary error: ${response.status}`
        )
      }

      const data = await response.json()

      if (!data.success || !data.summary) {
        throw new Error(
          'AI summary response invalid'
        )
      }

      return {
        summary: data.summary,
        source: data.source || 'script',
        fromCache: data.fromCache || false,
        generatedAt: data.generatedAt ||
          new Date().toISOString()
      }

    } catch (error) {
      logAI(
        'WARNING',
        `AI backend failed: ${error.message} ` +
        `— using script fallback`
      )
      return null
    }
  }

  // ───────────────────────────────────────
  // REQUEST CANVAS SUMMARY
  // Gets AI summary for one canvas
  // ───────────────────────────────────────

  const requestCanvasSummary = async (
    canvasId
  ) => {
    // Layer 1 — Script summary instantly
    const scriptSummary = generateScriptSummary(
      'canvas',
      canvasId
    )

    // Render script summary immediately
    renderSummaryToDOM(
      canvasId,
      scriptSummary,
      'Script'
    )

    // Update STATE
    updateSummaries({
      [canvasId]: scriptSummary
    })

    // Layer 2/3 — Backend AI in background
    const aiResult = await callBackendSummary(
      'canvas',
      canvasId
    )

    if (aiResult && aiResult.summary) {
      // Replace script summary with AI
      renderSummaryToDOM(
        canvasId,
        aiResult.summary,
        capitalizeFirst(aiResult.source)
      )

      // Update STATE
      updateSummaries({
        [canvasId]: aiResult.summary,
        source: aiResult.source
      })

      logAI(
        'INFO',
        `${canvasId} summary via ` +
        `${aiResult.source}` +
        `${aiResult.fromCache ? ' (cached)' : ''}`
      )
    }

    return aiResult?.summary || scriptSummary
  }

  // ───────────────────────────────────────
  // REQUEST FULL SYSTEM SUMMARY
  // Gets complete diagnostic paragraph
  // ───────────────────────────────────────

  const requestFullSummary = async () => {
    // Cooldown check
    const now = Date.now()
    if (
      now - lastFullSummaryTime <
      FULL_SUMMARY_COOLDOWN
    ) {
      return STATE.summaries.fullSystem
    }

    lastFullSummaryTime = now

    // Layer 1 — Script summary instantly
    const scriptSummary = generateScriptSummary(
      'full',
      null
    )

    // Render script summary immediately
    renderFullSummaryToDOM(
      scriptSummary,
      'Script',
      new Date().toISOString()
    )

    updateSummaries({
      fullSystem: scriptSummary,
      lastUpdated: new Date().toISOString()
    })

    // Layer 2/3 — Backend AI in background
    const aiResult = await callBackendSummary(
      'full',
      null
    )

    if (aiResult && aiResult.summary) {
      renderFullSummaryToDOM(
        aiResult.summary,
        capitalizeFirst(aiResult.source),
        aiResult.generatedAt
      )

      updateSummaries({
        fullSystem: aiResult.summary,
        source: aiResult.source,
        lastUpdated: aiResult.generatedAt
      })

      logAI(
        'INFO',
        `Full system summary via ` +
        `${aiResult.source}` +
        `${aiResult.fromCache ? ' (cached)' : ''}`
      )

      return aiResult.summary
    }

    return scriptSummary
  }

  // ───────────────────────────────────────
  // REQUEST ALL CANVAS SUMMARIES
  // Requests all 12 canvas summaries
  // Called after initial data collection
  // Staggers calls to avoid rate limits
  // ───────────────────────────────────────

  const requestAllCanvasSummaries = async () => {
    const canvases = [
      'canvas1', 'canvas2', 'canvas3',
      'canvas4', 'canvas5', 'canvas6',
      'canvas7', 'canvas8', 'canvas9',
      'canvas10', 'canvas11', 'canvas12',
      'canvas13'
    ]

    logAI(
      'INFO',
      'Requesting all canvas AI summaries'
    )

    // Generate all script summaries first
    // These are instant and always work
    for (const canvasId of canvases) {
      const scriptSummary =
        generateScriptSummary('canvas', canvasId)
      renderSummaryToDOM(
        canvasId,
        scriptSummary,
        'Script'
      )
      updateSummaries({ [canvasId]: scriptSummary })
    }

    // Request AI summaries with stagger
    // 500ms between each to avoid rate limits
    for (const canvasId of canvases) {
      await sleep(500)
      requestCanvasSummary(canvasId)
        .catch(err => {
          logAI(
            'WARNING',
            `${canvasId} AI request failed: ` +
            err.message
          )
        })
    }
  }

  // ───────────────────────────────────────
  // START REFRESH CYCLE
  // Refreshes summaries every 60 seconds
  // ───────────────────────────────────────

  const startRefreshCycle = () => {
    if (summaryRefreshInterval) return

    summaryRefreshInterval = setInterval(
      async () => {
        if (isRefreshing) return
        isRefreshing = true

        logAI(
          'INFO',
          'AI summary refresh cycle starting'
        )

        try {
          // Refresh full system summary
          await requestFullSummary()

          // Refresh canvases that have
          // live changing data
          const liveCanvases = [
            'canvas4',  // Live network
            'canvas11', // Global scores
            'canvas12'  // Live feed
          ]

          for (const canvasId of liveCanvases) {
            await requestCanvasSummary(canvasId)
            await sleep(300)
          }

        } catch (error) {
          logAI(
            'WARNING',
            'Refresh cycle error: ' +
            error.message
          )
        }

        isRefreshing = false
      },
      NDIC_CONFIG.INTERVALS.aiSummaryRefresh
    )

    logAI(
      'INFO',
      'AI summary refresh cycle started ' +
      '(60 second interval)'
    )
  }

  // ───────────────────────────────────────
  // STOP REFRESH CYCLE
  // ───────────────────────────────────────

  const stopRefreshCycle = () => {
    if (summaryRefreshInterval) {
      clearInterval(summaryRefreshInterval)
      summaryRefreshInterval = null
    }
  }

  // ───────────────────────────────────────
  // INITIAL COLLECTION
  // Called by core engine after all
  // data engines have completed
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'AI summary engine starting'
    )

    // Request all canvas summaries
    await requestAllCanvasSummaries()

    // Request full system summary
    await requestFullSummary()

    // Start 60 second refresh cycle
    startRefreshCycle()

    logAI(
      'INFO',
      'AI summary engine initialized'
    )
  }

  return {
    collect,
    requestCanvasSummary,
    requestFullSummary,
    requestAllCanvasSummaries,
    startRefreshCycle,
    stopRefreshCycle,
    generateScriptSummary,
    generateCanvasScriptSummary,
    generateFullScriptSummary
  }

})()
