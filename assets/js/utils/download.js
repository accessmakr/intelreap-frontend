// ─────────────────────────────────────────
// DOWNLOAD ENGINE
// Powers PDF, JSON and Copy functions
// in Canvas 11 and Full System Summary
// ─────────────────────────────────────────

// Build clean report data object
// from current STATE
const buildReportData = () => {
  const snapshot = getStateSnapshot()
  const now = new Date()

  return {
    meta: {
      reportTitle: 'Intelreap Intelligence Report',
      generatedAt: now.toISOString(),
      generatedAtFormatted: formatDateTime(
        now.toISOString()
      ),
      version: NDIC_CONFIG.VERSION,
      url: window.location.href,
      userAgent: navigator.userAgent
    },

    network: {
      asn: snapshot.network.asn,
      asnOwner: snapshot.network.asnOwner,
      asnType: snapshot.network.asnType,
      networkTier: snapshot.network.networkTier,
      ipRange: snapshot.network.ipRange,
      allocationRegistry:
        snapshot.network.allocationRegistry,
      routeOrigin: snapshot.network.routeOrigin,
      estimatedPeeringCount:
        snapshot.network.estimatedPeeringCount,
      upstreamProvider:
        snapshot.network.upstreamProvider,
      bgpRouteStatus:
        snapshot.network.bgpRouteStatus,
      networkHealthScore:
        snapshot.network.networkHealthScore
    },

    identity: {
      ip: snapshot.identity.ip,
      ipVersion: snapshot.identity.ipVersion,
      isp: snapshot.identity.isp,
      org: snapshot.identity.org,
      country: snapshot.identity.country,
      countryCode: snapshot.identity.countryCode,
      region: snapshot.identity.region,
      city: snapshot.identity.city,
      postal: snapshot.identity.postal,
      latitude: snapshot.identity.latitude,
      longitude: snapshot.identity.longitude,
      timezone: snapshot.identity.timezone,
      utcOffset: snapshot.identity.utcOffset,
      connectionType:
        snapshot.identity.connectionType
    },

    vpn: {
      vpnDetected: snapshot.vpn.vpnDetected,
      proxyDetected: snapshot.vpn.proxyDetected,
      torDetected: snapshot.vpn.torDetected,
      ipClassification:
        snapshot.vpn.ipClassification,
      timezoneMatch: snapshot.vpn.timezoneMatch,
      languageMatch: snapshot.vpn.languageMatch,
      fraudScore: snapshot.vpn.fraudScore,
      trustScore: snapshot.vpn.trustScore,
      routeClassification:
        snapshot.vpn.routeClassification,
      confidence: snapshot.vpn.confidence
    },

    liveNetwork: {
      currentRtt: snapshot.liveNetwork.currentRtt,
      averageRtt: snapshot.liveNetwork.averageRtt,
      peakRtt: snapshot.liveNetwork.peakRtt,
      lowestRtt: snapshot.liveNetwork.lowestRtt,
      bandwidth: snapshot.liveNetwork.bandwidth,
      effectiveType:
        snapshot.liveNetwork.effectiveType,
      qualityRating:
        snapshot.liveNetwork.qualityRating,
      stabilityIndex:
        snapshot.liveNetwork.stabilityIndex,
      jitterEstimate:
        snapshot.liveNetwork.jitterEstimate
    },

    device: {
      os: snapshot.device.os,
      osVersion: snapshot.device.osVersion,
      browser: snapshot.device.browser,
      browserVersion:
        snapshot.device.browserVersion,
      browserEngine:
        snapshot.device.browserEngine,
      deviceType: snapshot.device.deviceType,
      deviceBrand: snapshot.device.deviceBrand,
      cpuCores: snapshot.device.cpuCores,
      ram: snapshot.device.ram,
      screenWidth: snapshot.device.screenWidth,
      screenHeight: snapshot.device.screenHeight,
      pixelRatio: snapshot.device.pixelRatio,
      touchSupport: snapshot.device.touchSupport,
      capabilityTier:
        snapshot.device.capabilityTier
    },

    graphics: {
      gpuVendor: snapshot.graphics.gpuVendor,
      gpuRenderer: snapshot.graphics.gpuRenderer,
      webglVersion: snapshot.graphics.webglVersion,
      hardwareAcceleration:
        snapshot.graphics.hardwareAcceleration,
      maxTextureSize:
        snapshot.graphics.maxTextureSize,
      shaderPrecision:
        snapshot.graphics.shaderPrecision,
      extensionsCount:
        snapshot.graphics.extensionsCount,
      renderingScore:
        snapshot.graphics.renderingScore,
      graphicsTier: snapshot.graphics.graphicsTier
    },

    security: {
      httpsStatus: snapshot.security.httpsStatus,
      secureContext: snapshot.security.secureContext,
      webrtcExposure:
        snapshot.security.webrtcExposure,
      localIp: snapshot.security.localIp,
      cookieAccess: snapshot.security.cookieAccess,
      localStorageAccess:
        snapshot.security.localStorageAccess,
      cameraPermission:
        snapshot.security.cameraPermission,
      microphonePermission:
        snapshot.security.microphonePermission,
      doNotTrack: snapshot.security.doNotTrack,
      securityScore: snapshot.security.securityScore,
      riskLevel: snapshot.security.riskLevel
    },

    capabilities: {
      webgpu: snapshot.capabilities.webgpu,
      wasm: snapshot.capabilities.wasm,
      webrtc: snapshot.capabilities.webrtc,
      serviceWorker:
        snapshot.capabilities.serviceWorker,
      pushApi: snapshot.capabilities.pushApi,
      indexedDb: snapshot.capabilities.indexedDb,
      webgl: snapshot.capabilities.webgl,
      webgl2: snapshot.capabilities.webgl2,
      capabilityScore:
        snapshot.capabilities.capabilityScore,
      capabilityCount:
        snapshot.capabilities.capabilityCount
    },

    performance: {
      pageLoadTime:
        snapshot.performance.pageLoadTime,
      domContentLoaded:
        snapshot.performance.domContentLoaded,
      ttfb: snapshot.performance.ttfb,
      dnsLookup: snapshot.performance.dnsLookup,
      resourceCount:
        snapshot.performance.resourceCount,
      pageWeight: snapshot.performance.pageWeight,
      runtimeScore:
        snapshot.performance.runtimeScore,
      percentileRating:
        snapshot.performance.percentileRating
    },

    speed: {
      lcp: snapshot.speed.lcp,
      lcpRating: snapshot.speed.lcpRating,
      fcp: snapshot.speed.fcp,
      fcpRating: snapshot.speed.fcpRating,
      cls: snapshot.speed.cls,
      clsRating: snapshot.speed.clsRating,
      inp: snapshot.speed.inp,
      inpRating: snapshot.speed.inpRating,
      benchmarkScore: snapshot.speed.benchmarkScore,
      percentileRanking:
        snapshot.speed.percentileRanking
    },

    scores: {
      networkScore: snapshot.scores.networkScore,
      identityScore: snapshot.scores.identityScore,
      privacyScore: snapshot.scores.privacyScore,
      deviceScore: snapshot.scores.deviceScore,
      graphicsScore: snapshot.scores.graphicsScore,
      securityScore: snapshot.scores.securityScore,
      capabilityScore:
        snapshot.scores.capabilityScore,
      performanceScore:
        snapshot.scores.performanceScore,
      speedScore: snapshot.scores.speedScore,
      globalScore: snapshot.scores.globalScore,
      healthClassification:
        snapshot.scores.healthClassification,
      strongestArea: snapshot.scores.strongestArea,
      weakestArea: snapshot.scores.weakestArea,
      improvementPriority:
        snapshot.scores.improvementPriority
    },

    aiSummary: {
      fullSystem: snapshot.summaries.fullSystem,
      source: snapshot.summaries.source,
      lastUpdated: snapshot.summaries.lastUpdated
    },

    events: {
      total: snapshot.events.length,
      critical: getCriticalCount(),
      warnings: getWarningCount(),
      recent: snapshot.events.slice(0, 20)
    }
  }
}

// ─────────────────────────────────────────
// JSON DOWNLOAD
// ─────────────────────────────────────────

const downloadJSON = () => {
  try {
    const reportData = buildReportData()
    const jsonString = JSON.stringify(
      reportData,
      null,
      2
    )

    const blob = new Blob(
      [jsonString],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    const filename =
      `intelreap-report-` +
      new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .substring(0, 19) +
      `.json`

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)

    logSystem(
      'INFO',
      'Intelligence report downloaded as JSON'
    )

    showDownloadSuccess('json')

  } catch (error) {
    logError(
      'JSON download failed: ' + error.message
    )
    showDownloadError('json')
  }
}

// ─────────────────────────────────────────
// PDF DOWNLOAD
// ─────────────────────────────────────────

const downloadPDF = () => {
  try {
    // Apply print stylesheet
    const printStyles = document.createElement('style')
    printStyles.id = 'ndic-print-styles'
    printStyles.textContent = `
      @media print {
        body {
          background: #ffffff !important;
          color: #000000 !important;
        }

        .ndic-system {
          background: #ffffff !important;
        }

        .ndic-header,
        .ndic-page-header {
          position: static !important;
        }

        .ndic-canvas {
          break-inside: avoid;
          page-break-inside: avoid;
          border: 1px solid #cccccc !important;
          background: #ffffff !important;
          color: #000000 !important;
          margin-bottom: 20px !important;
          padding: 16px !important;
        }

        .ndic-canvas-heading {
          color: #000000 !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }

        .ndic-canvas-subheading {
          color: #333333 !important;
          font-size: 13px !important;
        }

        .ndic-param-label {
          color: #333333 !important;
        }

        .ndic-param-value {
          color: #000000 !important;
          font-weight: bold !important;
        }

        .ndic-ai-summary {
          border-top: 1px solid #cccccc !important;
          padding-top: 8px !important;
          color: #333333 !important;
          font-style: italic !important;
        }

        .ndic-deep-dive-link,
        .ndic-download-section,
        .ndic-scan-status,
        .ndic-header-score,
        canvas,
        .leaflet-container {
          display: none !important;
        }

        .ndic-full-summary {
          break-inside: avoid;
          page-break-inside: avoid;
          border: 2px solid #000000 !important;
          padding: 16px !important;
          background: #ffffff !important;
          color: #000000 !important;
        }

        @page {
          margin: 20mm;
          size: A4;
        }

        h1, h2, h3 {
          color: #000000 !important;
        }
      }
    `

    document.head.appendChild(printStyles)

    // Small delay to let styles apply
    setTimeout(() => {
      window.print()

      // Remove print styles after
      setTimeout(() => {
        const styles = document.getElementById(
          'ndic-print-styles'
        )
        if (styles) {
          document.head.removeChild(styles)
        }
      }, 1000)
    }, 300)

    logSystem(
      'INFO',
      'Intelligence report sent to print/PDF'
    )

    showDownloadSuccess('pdf')

  } catch (error) {
    logError(
      'PDF download failed: ' + error.message
    )
    showDownloadError('pdf')
  }
}

// ─────────────────────────────────────────
// COPY TO CLIPBOARD
// ─────────────────────────────────────────

const copyToClipboard = async () => {
  try {
    const reportData = buildReportData()
    const text = buildPlainTextReport(reportData)

    // Try modern clipboard API first
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textarea =
        document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    logSystem(
      'INFO',
      'Intelligence report copied to clipboard'
    )

    showDownloadSuccess('copy')

  } catch (error) {
    logError(
      'Copy failed: ' + error.message
    )
    showDownloadError('copy')
  }
}

// Build plain text version of report
const buildPlainTextReport = (data) => {
  const lines = []
  const divider = '─'.repeat(50)

  lines.push('INTELREAP INTELLIGENCE REPORT')
  lines.push(divider)
  lines.push(`Generated: ${data.meta.generatedAtFormatted}`)
  lines.push(`URL: ${data.meta.url}`)
  lines.push('')

  lines.push('GLOBAL SCORE')
  lines.push(divider)
  lines.push(`Global Score:        ${data.scores.globalScore}/100`)
  lines.push(`Health:              ${data.scores.healthClassification}`)
  lines.push(`Strongest Area:      ${data.scores.strongestArea}`)
  lines.push(`Weakest Area:        ${data.scores.weakestArea}`)
  lines.push('')

  lines.push('NETWORK INFRASTRUCTURE')
  lines.push(divider)
  lines.push(`ASN:                 ${data.network.asn}`)
  lines.push(`ASN Owner:           ${data.network.asnOwner}`)
  lines.push(`ASN Type:            ${data.network.asnType}`)
  lines.push(`Network Tier:        ${data.network.networkTier}`)
  lines.push(`Registry:            ${data.network.allocationRegistry}`)
  lines.push(`Route Origin:        ${data.network.routeOrigin}`)
  lines.push(`Network Health:      ${data.network.networkHealthScore}`)
  lines.push('')

  lines.push('NETWORK IDENTITY')
  lines.push(divider)
  lines.push(`IP Address:          ${data.identity.ip}`)
  lines.push(`IP Version:          ${data.identity.ipVersion}`)
  lines.push(`ISP:                 ${data.identity.isp}`)
  lines.push(`Country:             ${data.identity.country}`)
  lines.push(`City:                ${data.identity.city}`)
  lines.push(`Timezone:            ${data.identity.timezone}`)
  lines.push(`Connection Type:     ${data.identity.connectionType}`)
  lines.push('')

  lines.push('VPN AND ROUTING')
  lines.push(divider)
  lines.push(`VPN Detected:        ${data.vpn.vpnDetected}`)
  lines.push(`Proxy Detected:      ${data.vpn.proxyDetected}`)
  lines.push(`TOR Detected:        ${data.vpn.torDetected}`)
  lines.push(`Trust Score:         ${data.vpn.trustScore}/100`)
  lines.push(`Route:               ${data.vpn.routeClassification}`)
  lines.push('')

  lines.push('LIVE NETWORK')
  lines.push(divider)
  lines.push(`Current Latency:     ${data.liveNetwork.currentRtt}ms`)
  lines.push(`Average Latency:     ${data.liveNetwork.averageRtt}ms`)
  lines.push(`Bandwidth:           ${data.liveNetwork.bandwidth}`)
  lines.push(`Quality:             ${data.liveNetwork.qualityRating}`)
  lines.push('')

  lines.push('DEVICE')
  lines.push(divider)
  lines.push(`OS:                  ${data.device.os}`)
  lines.push(`Browser:             ${data.device.browser}`)
  lines.push(`Device Type:         ${data.device.deviceType}`)
  lines.push(`CPU Cores:           ${data.device.cpuCores}`)
  lines.push(`RAM:                 ${data.device.ram}GB`)
  lines.push(`Capability Tier:     ${data.device.capabilityTier}`)
  lines.push('')

  lines.push('GRAPHICS')
  lines.push(divider)
  lines.push(`GPU Vendor:          ${data.graphics.gpuVendor}`)
  lines.push(`WebGL Version:       ${data.graphics.webglVersion}`)
  lines.push(`Graphics Tier:       ${data.graphics.graphicsTier}`)
  lines.push(`Rendering Score:     ${data.graphics.renderingScore}`)
  lines.push('')

  lines.push('SECURITY')
  lines.push(divider)
  lines.push(`HTTPS:               ${data.security.httpsStatus}`)
  lines.push(`WebRTC Exposure:     ${data.security.webrtcExposure}`)
  lines.push(`Security Score:      ${data.security.securityScore}/100`)
  lines.push(`Risk Level:          ${data.security.riskLevel}`)
  lines.push('')

  lines.push('PERFORMANCE')
  lines.push(divider)
  lines.push(`Page Load:           ${data.performance.pageLoadTime}ms`)
  lines.push(`TTFB:                ${data.performance.ttfb}ms`)
  lines.push(`Performance Score:   ${data.scores.performanceScore}`)
  lines.push(`Percentile:          ${data.performance.percentileRating}`)
  lines.push('')

  lines.push('CORE WEB VITALS')
  lines.push(divider)
  lines.push(`LCP:                 ${data.speed.lcp}ms (${data.speed.lcpRating})`)
  lines.push(`FCP:                 ${data.speed.fcp}ms (${data.speed.fcpRating})`)
  lines.push(`CLS:                 ${data.speed.cls} (${data.speed.clsRating})`)
  lines.push(`INP:                 ${data.speed.inp}ms (${data.speed.inpRating})`)
  lines.push('')

  lines.push('SCORE BREAKDOWN')
  lines.push(divider)
  lines.push(`Network Score:       ${data.scores.networkScore}/100`)
  lines.push(`Identity Score:      ${data.scores.identityScore}/100`)
  lines.push(`Privacy Score:       ${data.scores.privacyScore}/100`)
  lines.push(`Device Score:        ${data.scores.deviceScore}/100`)
  lines.push(`Graphics Score:      ${data.scores.graphicsScore}/100`)
  lines.push(`Security Score:      ${data.scores.securityScore}/100`)
  lines.push(`Capability Score:    ${data.scores.capabilityScore}/100`)
  lines.push(`Performance Score:   ${data.scores.performanceScore}/100`)
  lines.push(`Speed Score:         ${data.scores.speedScore}/100`)
  lines.push(`GLOBAL SCORE:        ${data.scores.globalScore}/100`)
  lines.push('')

  if (data.aiSummary.fullSystem) {
    lines.push('AI DIAGNOSTIC SUMMARY')
    lines.push(divider)
    lines.push(data.aiSummary.fullSystem)
    lines.push('')
  }

  lines.push(divider)
  lines.push('Generated by Intelreap')
  lines.push('intelreap.com')

  return lines.join('\n')
}

// ─────────────────────────────────────────
// UI FEEDBACK
// ─────────────────────────────────────────

const showDownloadSuccess = (type) => {
  const buttonMap = {
    json: 'btn-download-json',
    pdf:  'btn-download-pdf',
    copy: 'btn-copy-clipboard'
  }

  const labelMap = {
    json: 'Downloaded',
    pdf:  'Sent to Printer',
    copy: 'Copied'
  }

  const originalMap = {
    json: 'Download JSON',
    pdf:  'Download PDF',
    copy: 'Copy to Clipboard'
  }

  const btnId = buttonMap[type]
  const btn = el(btnId)
  if (!btn) return

  btn.textContent = labelMap[type]
  btn.classList.add('ndic-btn-success')

  setTimeout(() => {
    btn.textContent = originalMap[type]
    btn.classList.remove('ndic-btn-success')
  }, 2500)
}

const showDownloadError = (type) => {
  const buttonMap = {
    json: 'btn-download-json',
    pdf:  'btn-download-pdf',
    copy: 'btn-copy-clipboard'
  }

  const btn = el(buttonMap[type])
  if (!btn) return

  btn.textContent = 'Failed — Try Again'
  btn.classList.add('ndic-btn-error')

  setTimeout(() => {
    btn.classList.remove('ndic-btn-error')
  }, 3000)
}
