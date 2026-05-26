// ─────────────────────────────────────────
// IP ENRICHMENT ENGINE
// Calls backend for IP identity and
// deep network intelligence
// Powers Canvas 1 and Canvas 2
// ─────────────────────────────────────────

const IPEngine = (() => {

  // ───────────────────────────────────────
  // FETCH IP IDENTITY
  // Calls /api/ip-identity
  // ───────────────────────────────────────

  const fetchIPIdentity = async () => {
    logAPI(
      'INFO',
      'Fetching IP identity from backend'
    )

    try {
      const response = await callBackend(
        'ipIdentity'
      )

      if (!response.success || !response.data) {
        throw new Error(
          'IP identity response invalid'
        )
      }

      const data = response.data

      // Update STATE.identity
      updateIdentity({
        ip: data.ip,
        ipVersion: data.ipVersion,
        isp: data.isp,
        org: data.org,
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        city: data.city,
        postal: data.postal,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        utcOffset: data.utcOffset,
        connectionType: data.connectionType,
        mobile: data.mobile,
        proxy: data.proxy,
        hosting: data.hosting,
        continent: data.continent,
        source: data.source
      })

      logBackendResponse(
        'ip-identity',
        data.responseTime,
        data.fromCache
      )

      logAPI(
        'INFO',
        `IP resolved: ${data.ip} — ` +
        `${data.city}, ${data.country} — ` +
        `${data.isp}`
      )

      return data

    } catch (error) {
      logBackendError('ip-identity', error.message)
      logError(
        'IP identity fetch failed: ' +
        error.message
      )
      return null
    }
  }

  // ───────────────────────────────────────
  // FETCH IP DEEP
  // Calls /api/ip-deep
  // ───────────────────────────────────────

  const fetchIPDeep = async () => {
    logAPI(
      'INFO',
      'Fetching deep network intelligence'
    )

    try {
      const response = await callBackend(
        'ipDeep'
      )

      if (!response.success || !response.data) {
        throw new Error(
          'IP deep response invalid'
        )
      }

      const data = response.data

      // Update STATE.network
      updateNetwork({
        asn: data.asn,
        asnNumber: data.asnNumber,
        asnOwner: data.asnOwner,
        asnType: data.asnType,
        asnCategory: data.asnCategory,
        networkTier: data.networkTier,
        networkTierNumber: data.networkTierNumber,
        ipRange: data.ipRange,
        allocationRegistry:
          data.allocationRegistry,
        routeOrigin: data.routeOrigin,
        estimatedPeeringCount:
          data.estimatedPeeringCount,
        upstreamProvider: data.upstreamProvider,
        announcementStatus:
          data.networkAnnouncementStatus,
        bgpRouteStatus: data.bgpRouteStatus,
        networkHealthScore: data.networkHealthScore,
        classificationSource:
          data.classificationSource,
        classificationConfidence:
          data.classificationConfidence,
        isHosting: data.isHosting,
        isMobile: data.isMobile,
        isProxy: data.isProxy,
        peeringdbData: data.peeringdbData,
        knownProvider: data.knownProvider
      })

      logBackendResponse(
        'ip-deep',
        data.responseTime,
        data.fromCache
      )

      logAPI(
        'INFO',
        `ASN: ${data.asn} — ` +
        `${data.asnOwner} — ` +
        `${data.networkTier} — ` +
        `Health: ${data.networkHealthScore}`
      )

      return data

    } catch (error) {
      logBackendError('ip-deep', error.message)
      logError(
        'IP deep fetch failed: ' +
        error.message
      )
      return null
    }
  }

  // ───────────────────────────────────────
  // INITIALIZE LEAFLET MAP
  // Sets up Canvas 2 map after
  // identity data is available
  // ───────────────────────────────────────

  const initializeMap = (lat, lng, city, isp) => {
    if (
      typeof LeafletMapViz === 'undefined'
    ) return

    try {
      LeafletMapViz.initialize(
        lat, lng, city, isp
      )
    } catch (error) {
      logError(
        'Map initialization failed: ' +
        error.message
      )
    }
  }

  // ───────────────────────────────────────
  // TRIGGER CANVAS RENDERS
  // After data is available
  // ───────────────────────────────────────

  const triggerRenders = () => {
    // Render Canvas 1 — ASN data
    if (typeof Canvas1 !== 'undefined') {
      Canvas1.render()
    }

    // Render Canvas 2 — Identity data
    if (typeof Canvas2 !== 'undefined') {
      Canvas2.render()
    }
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // Fetches both identity and deep data
  // in parallel for speed
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'IP enrichment engine collecting'
    )

    // Run both calls in parallel
    const [identityData, deepData] =
      await Promise.all([
        fetchIPIdentity(),
        fetchIPDeep()
      ])

    // Mark engine complete
    markEngineComplete('ip')

    // Initialize map if coordinates available
    if (
      identityData?.latitude &&
      identityData?.longitude
    ) {
      initializeMap(
        identityData.latitude,
        identityData.longitude,
        identityData.city,
        identityData.isp
      )
    }

    // Trigger canvas renders
    triggerRenders()

    logSystem(
      'INFO',
      'IP enrichment complete — ' +
      `Identity: ${identityData ? 'OK' : 'Failed'} — ` +
      `Deep: ${deepData ? 'OK' : 'Failed'}`
    )

    return { identityData, deepData }
  }

  // ───────────────────────────────────────
  // REFRESH
  // Called periodically to check for
  // IP changes (e.g. VPN toggle)
  // ───────────────────────────────────────

  const refresh = async () => {
    logAPI(
      'INFO',
      'Refreshing IP intelligence'
    )

    const previousIP = STATE.identity.ip

    const identityData = await fetchIPIdentity()

    // Detect IP change
    if (
      identityData &&
      previousIP &&
      identityData.ip !== previousIP
    ) {
      logNetwork(
        'CRITICAL',
        `IP address changed: ` +
        `${previousIP} → ${identityData.ip}`
      )

      // Trigger proxy re-check
      if (typeof ProxyEngine !== 'undefined') {
        await ProxyEngine.collect()
      }
    }

    return identityData
  }

  return {
    collect,
    refresh,
    fetchIPIdentity,
    fetchIPDeep,
    initializeMap
  }

})()
