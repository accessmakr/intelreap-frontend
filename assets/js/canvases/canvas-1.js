// ─────────────────────────────────────────
// CANVAS 1 RENDERER
// ASN & Network Route Intelligence
// What Network Are You On?
// ─────────────────────────────────────────

const Canvas1 = (() => {

  const render = () => {
    const n = STATE.network
    const s = STATE.scores

    // ─── PARAMETERS ───────────────────────

    setText('c1-asn-number',
      n.asn || '—'
    )

    setText('c1-asn-owner',
      n.asnOwner || '—'
    )

    setText('c1-asn-type',
      n.asnType || '—'
    )

    setText('c1-network-tier',
      n.networkTier || '—'
    )

    setText('c1-ip-range',
      n.ipRange || '—'
    )

    setText('c1-allocation-registry',
      n.allocationRegistry || '—'
    )

    setText('c1-route-origin',
      n.routeOrigin || '—'
    )

    setText('c1-peering-count',
      n.estimatedPeeringCount || '—'
    )

    setText('c1-upstream-provider',
      n.upstreamProvider || '—'
    )

    setText('c1-announcement-status',
      n.announcementStatus || '—'
    )

    setText('c1-bgp-route-status',
      n.bgpRouteStatus || '—'
    )

    // Network health score with color
    const healthScore = n.networkHealthScore
    setText('c1-network-health',
      healthScore !== null
        ? `${healthScore}/100`
        : '—'
    )
    setColor(
      'c1-network-health',
      getScoreColor(healthScore || 0)
    )

    // Classification confidence badge
    setText('c1-classification-source',
      n.classificationSource || '—'
    )
    setText('c1-classification-confidence',
      n.classificationConfidence || '—'
    )

    // Known provider badge
    if (n.knownProvider) {
      setText('c1-known-provider', n.knownProvider)
      addClass('c1-known-provider-row', 'ndic-visible')
    }

    // PeeringDB enrichment if available
    if (n.peeringdbData) {
      setText('c1-peeringdb-traffic',
        n.peeringdbData.traffic || '—'
      )
      setText('c1-peeringdb-prefixes4',
        n.peeringdbData.prefixes4
          ? `${n.peeringdbData.prefixes4} IPv4`
          : '—'
      )
      setText('c1-peeringdb-prefixes6',
        n.peeringdbData.prefixes6
          ? `${n.peeringdbData.prefixes6} IPv6`
          : '—'
      )
      addClass('c1-peeringdb-section', 'ndic-visible')
    }

    // Hosting / Mobile / Proxy flags
    setBooleanIndicator(
      'c1-is-hosting',
      n.isHosting,
      'Yes', 'No'
    )
    setBooleanIndicator(
      'c1-is-mobile',
      n.isMobile,
      'Yes', 'No'
    )
    setBooleanIndicator(
      'c1-is-proxy',
      n.isProxy,
      'Yes', 'No'
    )

    // Canvas score
    setText('c1-score',
      s.networkScore
        ? `${s.networkScore}/100`
        : '—'
    )
    setColor(
      'c1-score',
      getScoreColor(s.networkScore || 0)
    )

    // ─── VISUALIZATION ────────────────────
    // Only render diagram if we have ASN data
    if (n.asn && n.asnOwner) {
      D3DiagramsViz.initRoutingDiagram()
    }

    // ─── DEEP DIVE LINK ───────────────────
    const deepDiveLink = el('c1-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas1
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas1
    }

    // ─── CANVAS REVEAL ────────────────────
    if (n.asn || n.networkHealthScore) {
      MonitoringEngine.revealCanvas('canvas-1')
    }
  }

  return { render }

})()
