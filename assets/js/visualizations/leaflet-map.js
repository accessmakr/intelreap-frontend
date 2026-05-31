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
            provider.url,
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
          maxWidth: 280,
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

  return {
    initialize,
    update,
    resize,
    destroy,
    isReady
  }

})()
