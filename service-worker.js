// ─────────────────────────────────────────
// INTELREAP SERVICE WORKER
// Cache strategies per resource type:
// Static assets     → Cache first
// HTML pages        → Network first
// API calls         → Network only
// Fonts             → Cache first
// Images            → Stale while revalidate
// ─────────────────────────────────────────

const SW_VERSION = 'intelreap-v1.3.0'

// Cache names per resource type
const CACHES = {
  static:  `${SW_VERSION}-static`,
  pages:   `${SW_VERSION}-pages`,
  fonts:   `${SW_VERSION}-fonts`,
  images:  `${SW_VERSION}-images`,
  runtime: `${SW_VERSION}-runtime`
}

// ─────────────────────────────────────────
// STATIC ASSETS TO PRECACHE
// Cached immediately on SW install
// Available offline from first visit
// ─────────────────────────────────────────

const PRECACHE_STATIC = [
  // Core CSS
  '/assets/css/ndic-design-system.css',
  '/assets/css/ndic-animations.css',
  '/assets/css/ndic-rtl.css',

  // Core JS — config and state
  '/assets/js/config.js',
  '/assets/js/state.js',

  // Utilities
  '/assets/js/utils/helpers.js',
  '/assets/js/utils/logger.js',
  '/assets/js/utils/download.js',

  // Global site scripts
  '/js/registry.js',
  '/js/root-config.js',
  '/js/menu-system.js',
  '/js/search-system.js',
  '/js/schema.js',
  '/js/internal-links.js',
  '/js/legal-engine.js',
  '/js/share-system.js',
  '/js/ticker-system.js',
  '/js/carousel-system.js',
  '/js/ad-slots.js',
  '/js/sw-register.js',

  // Icons
  '/assets/images/icons/icon-192.png',
  '/assets/images/icons/icon-512.png',
  '/assets/images/icons/apple-touch-icon.png',

  // Offline fallback
  '/offline.html'
]

// ─────────────────────────────────────────
// HTML PAGES TO PRECACHE
// ─────────────────────────────────────────

const PRECACHE_PAGES = [
  '/index.html',
  '/intelligence/network-route.html',
  '/intelligence/network-identity.html',
  '/intelligence/vpn-proxy.html',
  '/intelligence/live-network.html',
  '/intelligence/device.html',
  '/intelligence/graphics.html',
  '/intelligence/security.html',
  '/intelligence/capability.html',
  '/intelligence/performance.html',
  '/intelligence/rendering-speed.html',
  '/intelligence/scoreboard.html',
  '/intelligence/live-feed.html',
  '/about.html',
  '/contact.html',
  '/privacy-policy.html',
  '/cookies-policy.html',
  '/terms-of-use.html'
]

// ─────────────────────────────────────────
// GOOGLE FONTS TO CACHE
// ─────────────────────────────────────────

const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
]

// ─────────────────────────────────────────
// CDN LIBRARIES TO CACHE
// ─────────────────────────────────────────

const CDN_ORIGINS = [
  'https://cdnjs.cloudflare.com',
  'https://unpkg.com'
]

// ─────────────────────────────────────────
// BACKEND API — NEVER CACHE
// Always network for live intelligence
// ─────────────────────────────────────────

const API_ORIGIN = 'https://intelreap-backend.vercel.app'

const NEVER_CACHE_PATTERNS = [
  /\/api\//,
  /intelreap-backend\.vercel\.app/,
  /api\.ipify\.org/,
  /ip-api\.com/,
  /ipwho\.is/,
  /proxycheck\.io/,
  /ipqualityscore\.com/,
  /api\.groq\.com/,
  /generativelanguage\.googleapis\.com/,
  /stun\./
]

// ─────────────────────────────────────────
// INSTALL EVENT
// Precaches all static assets
// ─────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([

      // Cache static assets
      caches.open(CACHES.static).then(cache => {
        return Promise.allSettled(
          PRECACHE_STATIC.map(url =>
            cache.add(
              new Request(url, { cache: 'reload' })
            ).catch(err => {
              console.warn(
                '[SW] Precache skipped:', url, err
              )
            })
          )
        )
      }),

      // Cache HTML pages
      caches.open(CACHES.pages).then(cache => {
        return Promise.allSettled(
          PRECACHE_PAGES.map(url =>
            cache.add(url).catch(() => {
              // Page may not exist yet
              // during initial deploy
            })
          )
        )
      })

    ]).then(() => {
      // NOTE: deliberately NOT calling
      // self.skipWaiting() here. Doing so
      // forced every new service worker to
      // activate immediately and claim all
      // open tabs via clients.claim(), which
      // fires the controllerchange event that
      // sw-register.js listens for — and that
      // handler reloads the page. The result
      // was an automatic reload on every
      // deploy, for every open tab, with no
      // user action involved. The update
      // banner UI already has an explicit
      // "Update" button that posts a
      // SKIP_WAITING message (handled below),
      // which is the correct, user-initiated
      // way to activate a new version.
    })
  )
})

// ─────────────────────────────────────────
// ACTIVATE EVENT
// Clean up old caches from previous versions
// ─────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            // Delete any cache not in
            // current version's cache names
            return Object.values(CACHES)
              .indexOf(name) === -1
          })
          .map(name => {
            console.log(
              '[SW] Deleting old cache:',
              name
            )
            return caches.delete(name)
          })
      )
    }).then(() => {
      // Take control of all clients
      // immediately without reload
      return self.clients.claim()
    })
  )
})

// ─────────────────────────────────────────
// FETCH EVENT
// Route requests to correct strategy
// ─────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignore non-GET requests
  if (request.method !== 'GET') return

  // Ignore chrome-extension and other schemes
  if (!url.protocol.startsWith('http')) return

  // NEVER cache API and intelligence calls
  const isAPICall = NEVER_CACHE_PATTERNS.some(
    pattern => pattern.test(request.url)
  )

  if (isAPICall) {
    event.respondWith(networkOnly(request))
    return
  }

  // Google Fonts — cache first
  const isFontRequest =
    FONT_ORIGINS.some(origin =>
      url.origin === origin
    )

  if (isFontRequest) {
    event.respondWith(cacheFirst(request, CACHES.fonts))
    return
  }

  // CDN libraries — stale while revalidate
  const isCDNRequest =
    CDN_ORIGINS.some(origin =>
      url.origin === origin
    )

  if (isCDNRequest) {
    event.respondWith(
      staleWhileRevalidate(request, CACHES.runtime)
    )
    return
  }

  // Only handle same-origin from here
  if (url.origin !== self.location.origin) {
    event.respondWith(networkOnly(request))
    return
  }

  const pathname = url.pathname

  // HTML pages — network first
  // Falls back to cache then offline page
  if (
    request.headers.get('Accept')
      ?.includes('text/html') ||
    pathname.endsWith('.html') ||
    pathname === '/'
  ) {
    event.respondWith(
      networkFirstWithOfflineFallback(request)
    )
    return
  }

  // CSS and JS — stale while revalidate
  // Returns cached version immediately for
  // speed, but always refreshes the cache in
  // the background — so even if SW_VERSION
  // isn't bumped, staleness self-heals after
  // one reload instead of persisting forever
  if (
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  ) {
    event.respondWith(
      staleWhileRevalidate(request, CACHES.static)
    )
    return
  }

  // Images — stale while revalidate
  if (
    pathname.match(
      /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i
    )
  ) {
    event.respondWith(
      staleWhileRevalidate(request, CACHES.images)
    )
    return
  }

  // Everything else — network first
  event.respondWith(networkFirst(request))
})

// ─────────────────────────────────────────
// STRATEGY: NETWORK ONLY
// For API calls — never cache live data
// ─────────────────────────────────────────

const networkOnly = async (request) => {
  try {
    return await fetch(request)
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Network unavailable',
        offline: true
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// ─────────────────────────────────────────
// STRATEGY: CACHE FIRST
// For static assets and fonts
// Network fallback if not in cache
// ─────────────────────────────────────────

const cacheFirst = async (request, cacheName) => {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response(
      'Resource unavailable offline',
      { status: 503 }
    )
  }
}

// ─────────────────────────────────────────
// STRATEGY: NETWORK FIRST
// For HTML pages and dynamic content
// Falls back to cache on network failure
// ─────────────────────────────────────────

const networkFirst = async (
  request,
  cacheName = CACHES.pages
) => {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    return cached || new Response(
      'Resource unavailable offline',
      { status: 503 }
    )
  }
}

// ─────────────────────────────────────────
// STRATEGY: NETWORK FIRST WITH OFFLINE PAGE
// For HTML navigation requests
// Shows branded offline page if both fail
// ─────────────────────────────────────────

const networkFirstWithOfflineFallback = async (
  request
) => {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHES.pages)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Try cached version first
    const cached = await caches.match(request)
    if (cached) return cached

    // Try cached version without query string
    const url = new URL(request.url)
    const cleanRequest = new Request(url.pathname)
    const cleanCached = await caches.match(cleanRequest)
    if (cleanCached) return cleanCached

    // Return offline page as last resort
    const offlinePage = await caches.match(
      '/offline.html'
    )
    return offlinePage || new Response(
      `<!DOCTYPE html>
       <html>
       <head>
         <title>IntelReap — Offline</title>
         <meta name="viewport"
           content="width=device-width,
           initial-scale=1">
       </head>
       <body style="background:#05060a;
         color:#e8edf4;font-family:sans-serif;
         display:flex;align-items:center;
         justify-content:center;min-height:100vh;
         text-align:center;padding:20px;">
         <div>
           <p style="font-size:2rem;margin:0 0 16px">
             INTEL<span style="color:#00b4d8">REAP</span>
           </p>
           <p style="color:#7a8fa8">
             You are offline. Please check your
             connection and try again.
           </p>
         </div>
       </body>
       </html>`,
      {
        status: 503,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

// ─────────────────────────────────────────
// STRATEGY: STALE WHILE REVALIDATE
// For CDN libraries and images
// Returns cached immediately
// Updates cache in background
// ─────────────────────────────────────────

const staleWhileRevalidate = async (
  request,
  cacheName
) => {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Fetch in background regardless
  const networkFetch = fetch(request).then(
    response => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    }
  ).catch(() => null)

  // Return cached immediately if available
  // Otherwise wait for network
  return cached || networkFetch
}

// ─────────────────────────────────────────
// BACKGROUND SYNC
// Retries failed API calls when online
// ─────────────────────────────────────────

self.addEventListener('sync', (event) => {
  if (event.tag === 'ndic-retry-scan') {
    event.waitUntil(
      // Notify all clients to retry
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'BACKGROUND_SYNC',
            tag: 'ndic-retry-scan'
          })
        })
      })
    )
  }
})

// ─────────────────────────────────────────
// PUSH NOTIFICATIONS
// Reserved for future feature
// ─────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body || 'IntelReap intelligence update',
    icon: '/assets/images/icons/icon-192.png',
    badge: '/assets/images/icons/icon-96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/index.html'
    },
    actions: [
      {
        action: 'open',
        title: 'View Intelligence'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'IntelReap',
      options
    )
  )
})

self.addEventListener(
  'notificationclick',
  (event) => {
    event.notification.close()

    if (event.action === 'dismiss') return

    const url = event.notification.data?.url ||
      '/index.html'

    event.waitUntil(
      self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clients => {
        // Focus existing tab if open
        const existing = clients.find(
          c => c.url.includes('intelreap.com')
        )
        if (existing) {
          existing.focus()
          existing.navigate(url)
          return
        }
        // Open new tab
        return self.clients.openWindow(url)
      })
    )
  }
)

// ─────────────────────────────────────────
// MESSAGE HANDLER
// Receives messages from main thread
// ─────────────────────────────────────────

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {}

  switch (type) {

    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'GET_VERSION':
      event.ports[0]?.postMessage({
        type: 'VERSION',
        version: SW_VERSION
      })
      break

    case 'CACHE_URLS':
      if (payload?.urls) {
        caches.open(CACHES.runtime).then(cache => {
          cache.addAll(payload.urls).catch(() => {})
        })
      }
      break

    case 'CLEAR_CACHE':
      Promise.all(
        Object.values(CACHES).map(name =>
          caches.delete(name)
        )
      ).then(() => {
        event.ports[0]?.postMessage({
          type: 'CACHE_CLEARED'
        })
      })
      break

    default:
      break
  }
})
