// ─────────────────────────────────────────
// SUMMARY ENGINE (ON-DEVICE)
// Writes every canvas summary and the full
// system report in the browser from the
// visitor's own results. Nothing is sent to
// an AI provider or to the backend.
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

  // Helpers: a clause is only written when its data exists,
  // so summaries never contain "unknown" filler.
  const has = (v) =>
    v !== null && v !== undefined && v !== '' &&
    v !== 'unknown' && v !== 'Unknown'
  const say = (...parts) => parts.filter(Boolean).join(' ')
  const plural = (n, word) =>
    `${n} ${word}${n === 1 ? '' : 's'}`
  const placeOf = (o) => {
    const bits = []
    if (has(o.city)) bits.push(o.city)
    if (has(o.region) && o.region !== o.city) bits.push(o.region)
    if (has(o.country)) bits.push(o.country)
    return bits.join(', ')
  }
  const kmNote = (km) =>
    km ? `, approximate to within about ${km} km` : ', approximate'
  const lower = (v) => String(v).toLowerCase()
  const cap = (v) => String(v).charAt(0).toUpperCase() + String(v).slice(1)
  const an = (w) => (/^[aeiou]/i.test(String(w)) ? 'an' : 'a')

  const generateCanvasScriptSummary = (
    canvasId
  ) => {
    const generators = {
      canvas1: () => {
        const n = STATE.network
        if (!has(n.asnOwner)) {
          return 'Network infrastructure scan in progress.'
        }
        return say(
          `You reach the internet through ${n.asnOwner}` +
            `${has(n.asnType) ? `, a ${lower(n.asnType)}` : ''}` +
            `${has(n.networkTier) ? ` sitting at ${n.networkTier}` : ''}` +
            `${has(n.allocationRegistry) ? `, with addresses allocated by ${n.allocationRegistry}` : ''}.`,
          has(n.ipRange) ? `Your address block is ${n.ipRange}.` : ''
        )
      },

      canvas2: () => {
        const i = STATE.identity
        if (!i.ip) {
          return 'Network identity resolution in progress.'
        }
        const where = placeOf(i)
        const conn = has(i.connectionType)
          ? `${lower(i.connectionType)} connection`
          : 'connection'
        const v4Main = i.locationBasis === 'IPv4'
        const alt = v4Main
          ? `Your device also has an IPv6 address (${i.ip})` +
            `${i.v6Location && placeOf(i.v6Location) ? `, which a location database places near ${placeOf(i.v6Location)}, but that location differs from the IPv4 one and is less reliable` : ''}.`
          : i.alt && i.alt.ip
          ? `Your device also has an ${i.alt.ipVersion} address (${i.alt.ip})` +
            `${placeOf(i.alt) ? `, which appears near ${placeOf(i.alt)}` : ''}.`
          : ''
        return say(
          has(i.city)
            ? `Your ${v4Main ? 'IPv4' : (i.ipVersion || 'IP')} address appears to be in ${where}${kmNote(i.accuracyRadiusKm)}, on ${an(conn)} ${conn}` +
              `${has(i.isp) ? ` from ${i.isp}` : ''}.`
            : where
            ? `Your ${i.ipVersion || 'IP'} address matches only ${where}, with no city-level match, on ${an(conn)} ${conn}` +
              `${has(i.isp) ? ` from ${i.isp}` : ''}.`
            : `Your ${i.ipVersion || 'IP'} address belongs to ${has(i.isp) ? i.isp : 'your provider'}, on ${an(conn)} ${conn}.`,
          alt,
          'City-level IP location is an estimate and can differ from where you actually are.'
        )
      },

      canvas3: () => {
        const v = STATE.vpn
        if (v.vpnDetected === null) {
          return 'VPN and proxy analysis in progress.'
        }
        const trust = v.trustScore !== null && v.trustScore !== undefined
          ? ` Trust score is ${v.trustScore}/100.`
          : ''
        const route = has(v.routeClassification)
          ? ` Route classification: ${v.routeClassification}.`
          : ''
        if (v.torDetected === 'yes') {
          return `Your traffic appears to leave through the Tor network.${trust}${route}`
        }
        if (v.vpnDetected === 'yes') {
          return `A VPN or similar tunnel is detected on your connection.${trust}${route}`
        }
        if (v.vpnDetected === 'maybe') {
          return `Some signals suggest a VPN or proxy, though none is confirmed.${trust}${route}`
        }
        return `No VPN, proxy or Tor signals were found.${trust}${route}`
      },

      canvas4: () => {
        const ln = STATE.liveNetwork
        if (ln.currentRtt === null) {
          return 'Live network monitoring initializing.'
        }
        return say(
          `Round-trip latency is ${ln.currentRtt} ms` +
            `${has(ln.qualityRating) ? `, rated ${lower(ln.qualityRating)}` : ''}` +
            `${has(ln.effectiveType) ? ` on a ${ln.effectiveType} class link` : ''}.`,
          ln.stabilityIndex ? `Stability is ${ln.stabilityIndex}%.` : ''
        )
      },

      canvas5: () => {
        const d = STATE.device
        if (!has(d.os)) {
          return 'Device intelligence collection in progress.'
        }
        const hw = []
        if (d.cpuCores) hw.push(plural(d.cpuCores, 'CPU core'))
        if (d.ram) hw.push(`${d.ram} GB of memory`)
        return say(
          `You are on ${has(d.browser) ? d.browser + ' on ' : ''}${d.os}` +
            `${hw.length ? ` with ${hw.join(' and ')}` : ''}.`,
          has(d.capabilityTier)
            ? `That places this ${has(d.deviceType) ? lower(d.deviceType) : 'device'} in the ${lower(d.capabilityTier)} capability tier.`
            : ''
        )
      },

      canvas6: () => {
        const g = STATE.graphics
        if (!has(g.gpuVendor)) {
          return 'Graphics engine analysis in progress.'
        }
        return say(
          `Graphics run on ${g.gpuVendor}` +
            `${has(g.webglVersion) ? ` with ${g.webglVersion}` : ''}` +
            `${has(g.hardwareAcceleration) ? ` and ${lower(g.hardwareAcceleration)} hardware acceleration` : ''}.`,
          has(g.graphicsTier) ? `This is ${an(g.graphicsTier)} ${lower(g.graphicsTier)} graphics tier.` : ''
        )
      },

      canvas7: () => {
        const s = STATE.security
        if (s.httpsStatus === null) {
          return 'Security analysis in progress.'
        }
        const flags = s.securityFlags?.length || 0
        return say(
          `Your connection to this page is ${lower(s.httpsStatus)}.`,
          s.securityScore !== null && s.securityScore !== undefined
            ? `Security score is ${s.securityScore}/100${has(s.riskLevel) ? ` with ${lower(s.riskLevel)} risk` : ''}.`
            : '',
          flags > 0
            ? `${plural(flags, 'issue')} ${flags === 1 ? 'was' : 'were'} flagged for review.`
            : 'No security issues were flagged.'
        )
      },

      canvas8: () => {
        const c = STATE.capabilities
        if (c.capabilityScore === null) {
          return 'Browser capability detection in progress.'
        }
        return say(
          `Your browser supports ${c.capabilityCount || 0} of ${c.totalChecked || 28} tested features, a score of ${c.capabilityScore}/100.`,
          `WebGPU is ${c.webgpu ? 'available' : 'not available'} and WebAssembly is ${c.wasm ? 'available' : 'not available'}.`
        )
      },

      canvas9: () => {
        const p = STATE.performance
        if (!p.pageLoadTime) {
          return 'Performance analysis in progress.'
        }
        return say(
          `This page loaded in ${formatTime(p.pageLoadTime)}` +
            `${p.ttfb ? ` and the first byte arrived after ${formatTime(p.ttfb)}` : ''}.`,
          has(p.percentileRating) ? `That is ${lower(p.percentileRating)} compared with typical visits.` : ''
        )
      },

      canvas10: () => {
        const sp = STATE.speed
        const s = STATE.scores
        if (sp.lcp === null && sp.benchmarkScore === null) {
          return 'Speed and rendering analysis in progress.'
        }
        if (sp.lcp !== null) {
          return say(
            `The main content appeared after ${formatLatency(sp.lcp)}` +
              `${has(sp.lcpRating) ? `, rated ${lower(sp.lcpRating)}` : ''}.`,
            s.speedScore ? `Overall speed score is ${s.speedScore}/100.` : ''
          )
        }
        return say(
          `The browser benchmark scored ${sp.benchmarkScore || 0}/100` +
            `${has(sp.percentileRanking) ? `, which is ${lower(sp.percentileRanking)}` : ''}.`
        )
      },

      canvas11: () => {
        const s = STATE.scores
        if (!s.globalScore) {
          return 'Global score computation in progress.'
        }
        return say(
          `Your environment scores ${s.globalScore}/100` +
            `${has(s.healthClassification) ? `, classed as ${lower(s.healthClassification)}` : ''}.`,
          has(s.strongestArea) ? `The strongest area is ${s.strongestArea}` +
            `${has(s.weakestArea) ? ` and the weakest is ${s.weakestArea}` : ''}.` : ''
        )
      },

      canvas12: () => {
        const events = STATE.events
        const meta = STATE.meta
        const critical = getCriticalCount()
        const warnings = getWarningCount()
        return say(
          `The scan is ${meta.isOnline ? 'online' : 'offline'} and has logged ${plural(events.length, 'event')}.`,
          critical > 0 ? `${plural(critical, 'critical flag')} detected.` : '',
          warnings > 0 ? `${plural(warnings, 'warning')} active.` : 'No warnings are active.'
        )
      },

      canvas13: () => {
        const fp = STATE.fingerprinting
        if (fp.uniquenessScore === null) {
          return 'Fingerprint analysis in progress.'
        }
        const flags = []
        if (fp.webdriverDetected) flags.push('automation detected')
        if (fp.adBlockerDetected) flags.push('an ad blocker is active')
        if (fp.incognitoDetected) flags.push('private browsing is likely')
        if (fp.ipv6LeakDetected) flags.push('an IPv6 address is visible alongside your IPv4')
        return say(
          `Your browser fingerprint uniqueness score is ${fp.uniquenessScore}/100.`,
          flags.length > 0
            ? cap(flags.join('; ')) + '.'
            : 'No automation, leak or ad-blocker signals were detected.'
        )
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

    if (i.ip) {
      const where = placeOf(i)
      parts.push(
        has(i.city)
          ? `Your connection appears to come from ${where}${kmNote(i.accuracyRadiusKm)}` +
            `${has(i.isp) ? `, through ${i.isp}` : ''}.`
          : where
          ? `Your address matches only ${where}, with no city-level match` +
            `${has(i.isp) ? `, through ${i.isp}` : ''}.`
          : (has(i.isp) ? `Your connection is through ${i.isp}.` : '')
      )
      if (i.locationBasis === 'IPv4') {
        parts.push(
          `The location above comes from the IPv4 address; the IPv6 address` +
          `${i.v6Location && placeOf(i.v6Location) ? ` is placed near ${placeOf(i.v6Location)} by the database, which differs and is less reliable` : ' is placed elsewhere by the database'}.`
        )
      } else if (i.alt && i.alt.ip) {
        parts.push(
          `The device also has an ${i.alt.ipVersion} address` +
          `${placeOf(i.alt) ? `, which appears near ${placeOf(i.alt)}` : ''}.`
        )
      }
    }

    if (has(d.os) && has(d.browser)) {
      const hw = []
      if (d.cpuCores) hw.push(plural(d.cpuCores, 'CPU core'))
      if (d.ram) hw.push(`${d.ram} GB of memory`)
      parts.push(
        `It is a ${has(d.deviceType) ? lower(d.deviceType) : 'device'} running ${d.os} with ${d.browser}` +
        `${hw.length ? `, with ${hw.join(' and ')}` : ''}.`
      )
    }

    if (v.vpnDetected !== null && v.vpnDetected !== undefined) {
      const vpnStatus =
        v.torDetected === 'yes'
          ? 'Tor network traffic is detected'
          : v.vpnDetected === 'yes'
          ? 'A VPN is active'
          : v.vpnDetected === 'maybe'
          ? 'Some VPN or proxy signals were seen'
          : 'No VPN or proxy was detected'
      parts.push(
        `${vpnStatus}` +
        `${v.trustScore !== null && v.trustScore !== undefined ? `, with a trust score of ${v.trustScore}/100` : ''}.`
      )
    }

    if (ln.currentRtt !== null && ln.currentRtt !== undefined) {
      parts.push(
        `Latency is ${ln.currentRtt} ms` +
        `${has(ln.qualityRating) ? `, rated ${lower(ln.qualityRating)}` : ''}.`
      )
    }

    if (sec.securityScore !== null && sec.securityScore !== undefined) {
      const flags = sec.securityFlags?.length || 0
      parts.push(
        `Security scores ${sec.securityScore}/100` +
        `${has(sec.riskLevel) ? ` with ${lower(sec.riskLevel)} risk` : ''}` +
        `${flags > 0 ? ` and ${plural(flags, 'flag')} raised` : ''}.`
      )
    }

    if (s.globalScore) {
      parts.push(
        `Overall the environment scores ${s.globalScore}/100` +
        `${has(s.healthClassification) ? `, classed as ${lower(s.healthClassification)}` : ''}.` +
        `${has(s.improvementPriority) ? ` The best place to improve is ${s.improvementPriority}.` : ''}`
      )
    }

    return parts.filter(Boolean).join(' ')
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
      'On-device'
    )

    // Update STATE
    updateSummaries({
      [canvasId]: scriptSummary
    })

    return scriptSummary
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
      'On-device',
      new Date().toISOString()
    )

    updateSummaries({
      fullSystem: scriptSummary,
      lastUpdated: new Date().toISOString()
    })

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
        'On-device'
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
