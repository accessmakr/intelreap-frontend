// ─────────────────────────────────────────
// LEAFLET MAP VISUALIZATION
// Powers Canvas 2 — Network Identity Panel
// Interactive world map with IP location
// pin, custom marker and popup
// ─────────────────────────────────────────

const LeafletMapViz = (() => {

  // ───────────────────────────────────────
  // INTERNAL STATE
  // ───────────────────────────────────────

  let map = null
  let marker = null
  let initialized = false
  let currentLat = null
  let currentLng = null
  let currentCity = null
  let currentIsp = null

  const tileUrl = (url) => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      return url
    }
    return url
      .replace('dark_all', 'light_all')
      .replace('alidade_smooth_dark', 'alidade_smooth')
  }

  // ───────────────────────────────────────
  // DARK TILE LAYER OPTIONS
  // Multiple providers for fallback
  // ───────────────────────────────────────

  const TILE_PROVIDERS = [
    {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      name: 'CartoDB Dark'
    },
    {
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
      subdomains: '',
      maxZoom: 20,
      name: 'Stadia Dark'
    },
    {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abc',
      maxZoom: 19,
      name: 'OpenStreetMap'
    }
  ]

  // ───────────────────────────────────────
  // CUSTOM MARKER ICON
  // Branded Intelreap location pin
  // ───────────────────────────────────────

  const createCustomIcon = () => {
    if (typeof L === 'undefined') return null

    return L.divIcon({
      className: 'ndic-map-marker',
      html: `
        <div class="ndic-marker-outer">
          <div class="ndic-marker-inner">
            <div class="ndic-marker-dot"></div>
          </div>
          <div class="ndic-marker-pulse"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -25]
    })
  }

  // ───────────────────────────────────────
  // BUILD POPUP CONTENT
  // Shows IP location details in popup
  // ───────────────────────────────────────

  const buildPopupContent = (
    city,
    region,
    country,
    isp,
    ip,
    connectionType
  ) => {
    return `
      <div class="ndic-map-popup">
        <div class="ndic-popup-header">
          <span class="ndic-popup-ip">${ip || '—'}</span>
          <span class="ndic-popup-type">${connectionType || '—'}</span>
        </div>
        <div class="ndic-popup-location">
          ${[city, region, country]
            .filter(Boolean)
            .join(', ') || 'Unknown location'}
        </div>
        <div class="ndic-popup-isp">
          ${isp || 'Unknown ISP'}
        </div>
      </div>
    `
  }

  // ───────────────────────────────────────
  // INITIALIZE MAP
  // Called by IPEngine after identity
  // data is available
  // ───────────────────────────────────────

  const initialize = (lat, lng, city, isp) => {
    if (typeof L === 'undefined') {
      logError('Leaflet library not loaded')
      return
    }

    const mapContainer = el('canvas2-map')
    if (!mapContainer) {
      logError('Map container canvas2-map not found')
      return
    }

    if (!lat || !lng) {
      logError('Invalid coordinates for map')
      return
    }

    currentLat = lat
    currentLng = lng
    currentCity = typeof city === 'undefined' ? currentCity : city
    currentIsp = typeof isp === 'undefined' ? currentIsp : isp

    try {
      // Destroy existing map if any
      if (map) {
        map.remove()
        map = null
        marker = null
        initialized = false
      }

      // Create map instance
      map = L.map('canvas2-map', {
        center: [lat, lng],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
        dragging: true,
        tap: true
      })

      // Add tile layer with fallback
      let tileLayerAdded = false

      for (const provider of TILE_PROVIDERS) {
        try {
          const tileLayer = L.tileLayer(
            tileUrl(provider.url),
            {
              attribution: provider.attribution,
              subdomains: provider.subdomains,
              maxZoom: provider.maxZoom
            }
          )

          tileLayer.addTo(map)
          tileLayerAdded = true
          break

        } catch {
          // Try next provider
        }
      }

      if (!tileLayerAdded) {
        logError('All map tile providers failed')
      }

      // Add custom marker
      const icon = createCustomIcon()
      if (icon) {
        marker = L.marker([lat, lng], {
          icon: icon
        })
      } else {
        marker = L.marker([lat, lng])
      }

      // Build popup
      const identity = STATE.identity
      const popupContent = buildPopupContent(
        city || identity.city,
        identity.region,
        identity.country,
        isp || identity.isp,
        identity.ip,
        identity.connectionType
      )

      marker
        .addTo(map)
        .bindPopup(popupContent, {
          className: 'ndic-leaflet-popup',
          maxWidth: 230,
          autoPan: true,
          closeButton: true
        })
        .openPopup()

      // Add accuracy circle
      if (identity.latitude && identity.longitude) {
        L.circle([lat, lng], {
          color: 'var(--color-accent-primary)',
          fillColor: 'var(--color-accent-primary)',
          fillOpacity: 0.05,
          weight: 1,
          radius: 50000 // 50km radius
        }).addTo(map)
      }

      initialized = true

      logSystem(
        'INFO',
        `Map initialized at ` +
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      )

    } catch (error) {
      logError(
        'Map initialization failed: ' +
        error.message
      )
    }
  }

  // ───────────────────────────────────────
  // UPDATE MAP
  // Pan to new location smoothly
  // Called when IP changes
  // ───────────────────────────────────────

  const update = (lat, lng, city, isp) => {
    if (!map || !initialized) {
      initialize(lat, lng, city, isp)
      return
    }

    if (!lat || !lng) return

    currentLat = lat
    currentLng = lng
    currentCity = typeof city === 'undefined' ? currentCity : city
    currentIsp = typeof isp === 'undefined' ? currentIsp : isp

    try {
      // Smooth pan to new location
      map.flyTo([lat, lng], 10, {
        duration: 1.5,
        easeLinearity: 0.25
      })

      // Update marker position
      if (marker) {
        marker.setLatLng([lat, lng])

        // Update popup content
        const identity = STATE.identity
        const popupContent = buildPopupContent(
          city || identity.city,
          identity.region,
          identity.country,
          isp || identity.isp,
          identity.ip,
          identity.connectionType
        )

        marker.setPopupContent(popupContent)
      }

      logSystem(
        'INFO',
        `Map updated to ` +
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      )

    } catch (error) {
      logError(
        'Map update failed: ' +
        error.message
      )
    }
  }

  // ───────────────────────────────────────
  // RESIZE MAP
  // Called on window resize to prevent
  // tile rendering issues
  // ───────────────────────────────────────

  const resize = () => {
    if (map && initialized) {
      try {
        map.invalidateSize()
      } catch {
        // Continue
      }
    }
  }

  // ───────────────────────────────────────
  // DESTROY MAP
  // Clean up on page unload
  // ───────────────────────────────────────

  const destroy = () => {
    if (map) {
      try {
        map.remove()
      } catch {
        // Continue
      }
      map = null
      marker = null
      initialized = false
    }
  }

  // ───────────────────────────────────────
  // IS READY
  // ───────────────────────────────────────

  const isReady = () => initialized

  // ───────────────────────────────────────
  // DUAL-PIN MAP — CANVAS 13
  // Shows GPS-reported location alongside
  // IP-reported location on one map, with
  // a connecting line when they differ.
  // Entirely independent state from the
  // single-pin map above, since they live
  // in different containers and can both
  // be on screen at once.
  // ───────────────────────────────────────

  let dualMap = null
  let dualMapInitialized = false

  const createGpsIcon = () => {
    if (typeof L === 'undefined') return null

    return L.divIcon({
      className: 'ndic-map-marker ndic-map-marker--gps',
      html: `
        <div class="ndic-marker-outer ndic-marker-outer--gps">
          <div class="ndic-marker-inner">
            <div class="ndic-marker-dot"></div>
          </div>
          <div class="ndic-marker-pulse"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -25]
    })
  }

  const initDualPinMap = (
    gpsLat, gpsLng, ipLat, ipLng
  ) => {
    if (typeof L === 'undefined') {
      logError('Leaflet library not loaded')
      return
    }

    const mapContainer = el('canvas13-dual-map')
    if (!mapContainer) {
      logError(
        'Dual map container canvas13-dual-map not found'
      )
      return
    }

    if (!gpsLat || !gpsLng) {
      // Nothing meaningful to show without a
      // real GPS reading
      return
    }

    try {
      if (dualMap) {
        dualMap.remove()
        dualMap = null
        dualMapInitialized = false
      }

      const hasIpPoint =
        ipLat !== null && ipLat !== undefined &&
        ipLng !== null && ipLng !== undefined

      const points = hasIpPoint
        ? [[gpsLat, gpsLng], [ipLat, ipLng]]
        : [[gpsLat, gpsLng]]

      dualMap = L.map('canvas13-dual-map', {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
        dragging: true,
        tap: true
      })

      let tileLayerAdded = false
      for (const provider of TILE_PROVIDERS) {
        try {
          L.tileLayer(tileUrl(provider.url), {
            attribution: provider.attribution,
            subdomains: provider.subdomains,
            maxZoom: provider.maxZoom
          }).addTo(dualMap)
          tileLayerAdded = true
          break
        } catch {
          // Try next provider
        }
      }

      if (!tileLayerAdded) {
        logError('All map tile providers failed')
      }

      // GPS pin
      const gpsIcon = createGpsIcon()
      const gpsMarker = gpsIcon
        ? L.marker([gpsLat, gpsLng], { icon: gpsIcon })
        : L.marker([gpsLat, gpsLng])
      gpsMarker
        .addTo(dualMap)
        .bindPopup(
          '<div class="ndic-map-popup">' +
          '<div class="ndic-popup-header">' +
          '<span class="ndic-popup-ip">GPS Location</span>' +
          '</div>' +
          `<div class="ndic-popup-location">${gpsLat.toFixed(4)}, ${gpsLng.toFixed(4)}</div>` +
          '</div>',
          { className: 'ndic-leaflet-popup', maxWidth: 200 }
        )

      // IP pin, if we have one to compare against
      if (hasIpPoint) {
        const ipIcon = createCustomIcon()
        const ipMarker = ipIcon
          ? L.marker([ipLat, ipLng], { icon: ipIcon })
          : L.marker([ipLat, ipLng])
        ipMarker
          .addTo(dualMap)
          .bindPopup(
            '<div class="ndic-map-popup">' +
            '<div class="ndic-popup-header">' +
            '<span class="ndic-popup-ip">IP Location</span>' +
            '</div>' +
            `<div class="ndic-popup-location">${ipLat.toFixed(4)}, ${ipLng.toFixed(4)}</div>` +
            '</div>',
            { className: 'ndic-leaflet-popup', maxWidth: 200 }
          )

        // Connecting line between the two points
        L.polyline(points, {
          color: 'var(--color-warning)',
          weight: 2,
          dashArray: '6, 6',
          opacity: 0.7
        }).addTo(dualMap)

        dualMap.fitBounds(points, {
          padding: [30, 30],
          maxZoom: 12
        })
      } else {
        dualMap.setView([gpsLat, gpsLng], 11)
      }

      dualMapInitialized = true

      logSystem(
        'INFO',
        'Dual-pin fingerprint map initialized'
      )

    } catch (error) {
      logError(
        'Dual-pin map initialization failed: ' +
        error.message
      )
    }
  }

  window.addEventListener('ndic-theme-changed', () => {
    if (map && currentLat && currentLng) {
      initialize(currentLat, currentLng, currentCity, currentIsp)
    }
  })

  return {
    initialize,
    update,
    resize,
    destroy,
    isReady,
    initDualPinMap
  }

})()
