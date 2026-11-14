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
        source: data.source,
        accuracyRadiusKm: data.accuracyRadiusKm || null,
        // A fresh primary lookup resets any location
        // switch made for the second address
        locationBasis: null,
        locationBasisIp: null,
        v6Location: null
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
  // OTHER ADDRESS (IPv4 <-> IPv6)
  // A phone often has both. The backend only
  // sees the one it was reached on, so the
  // browser finds the other family and the
  // backend looks that address up.
  // Best effort: silent on any failure.
  // ───────────────────────────────────────

  // When the device has both an IPv6 and an IPv4 address and
  // a database places them in different cities of the SAME
  // country, the IPv4 location becomes the main one (IPv4
  // location data is the more mature of the two). Different
  // countries are never merged: that difference is a real
  // signal and is shown as it is.
  const normCity = (c) =>
    String(c || '').trim().toLowerCase()

  const chooseLocationBasis = (primary, alt) => {
    if (!primary || !alt) return false
    if (primary.ipVersion !== 'IPv6') return false
    if (alt.ipVersion !== 'IPv4') return false
    if (!alt.city) return false
    const num = (v) =>
      v === null || v === undefined || v === ''
        ? NaN
        : Number(v)
    if (
      !Number.isFinite(num(alt.latitude)) ||
      !Number.isFinite(num(alt.longitude))
    ) return false
    if (!primary.countryCode || !alt.countryCode) return false
    if (primary.countryCode !== alt.countryCode) return false
    return normCity(primary.city) !== normCity(alt.city)
  }

  const useAltLocationIfBetter = (alt) => {
    const cur = STATE.identity
    if (cur.locationBasis) return false
    if (!chooseLocationBasis(cur, alt)) return false
    updateIdentity({
      city: alt.city,
      region: alt.region,
      country: alt.country,
      postal: alt.postal,
      latitude: Number(alt.latitude),
      longitude: Number(alt.longitude),
      timezone: alt.timezone || cur.timezone,
      utcOffset: alt.utcOffset || cur.utcOffset,
      accuracyRadiusKm: alt.accuracyRadiusKm,
      locationBasis: 'IPv4',
      locationBasisIp: alt.ip,
      v6Location: {
        ip: cur.ip,
        city: cur.city,
        region: cur.region,
        country: cur.country,
        latitude: cur.latitude,
        longitude: cur.longitude,
        accuracyRadiusKm: cur.accuracyRadiusKm
      }
    })
    return true
  }

  const fetchAltAddress = async (primary) => {
    try {
      if (!primary || !primary.ip) return null
      const isV6 = primary.ip.includes(':')
      const finder = isV6
        ? 'https://api.ipify.org?format=json'
        : 'https://api6.ipify.org?format=json'
      const found = await fetchWithTimeout(
        finder, { cache: 'no-store' }, 4000
      )
      if (!found.ok) return null
      const other = ((await found.json()) || {}).ip
      if (
        typeof other !== 'string' ||
        other === primary.ip ||
        other.includes(':') === isV6 ||
        !/^[0-9a-fA-F:.]+$/.test(other)
      ) {
        return null
      }
      const res = await fetchWithTimeout(
        NDIC_CONFIG.BACKEND_URL +
          NDIC_CONFIG.ENDPOINTS.ipIdentity +
          '?ip=' + encodeURIComponent(other),
        { cache: 'no-store' }
      )
      if (!res.ok) return null
      const body = await res.json()
      const d = body && body.success && body.data
      if (!d || d.ip !== other) return null
      const alt = {
        ip: d.ip,
        ipVersion: d.ipVersion,
        city: d.city,
        region: d.region,
        country: d.country,
        countryCode: d.countryCode,
        latitude: d.latitude,
        longitude: d.longitude,
        timezone: d.timezone || null,
        utcOffset: d.utcOffset || null,
        postal: d.postal || null,
        accuracyRadiusKm: d.accuracyRadiusKm || null
      }
      updateIdentity({ alt })
      useAltLocationIfBetter(alt)
      return alt
    } catch (e) {
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

    // Render Canvas 13 — its map shows the IP location
    // too, and must follow a late switch to the IPv4 one
    if (typeof Canvas13 !== 'undefined') {
      Canvas13.render()
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

    // The other address, if the device has both
    // (never blocks or fails the scan)
    fetchAltAddress(identityData).then(() => {
      if (typeof triggerRenders === 'function') {
        triggerRenders()
      }
    })

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

    // A fresh lookup returns the main address's own
    // location, so re-apply the IPv4 one when it applies
    if (
      identityData &&
      previousIP &&
      identityData.ip === previousIP
    ) {
      if (
        STATE.identity.alt &&
        useAltLocationIfBetter(STATE.identity.alt)
      ) {
        triggerRenders()
      }
    }

    // Detect IP change
    if (
      identityData &&
      previousIP &&
      identityData.ip !== previousIP
    ) {
      // The old second address no longer applies
      updateIdentity({ alt: null })
      fetchAltAddress(identityData).then(() => {
        triggerRenders()
      })

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
    fetchAltAddress,
    chooseLocationBasis,
    fetchIPDeep,
    initializeMap
  }

})()
