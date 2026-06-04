// ─────────────────────────────────────────
// INTELREAP SERVICE WORKER REGISTRATION
// Handles install prompt, update detection
// and offline status notification
// ─────────────────────────────────────────

const SWRegister = (() => {

  // ─────────────────────────────────────
  // INTERNAL STATE
  // ─────────────────────────────────────

  let registration = null
  let deferredInstallPrompt = null
  let isUpdateAvailable = false

  // ─────────────────────────────────────
  // REGISTER SERVICE WORKER
  // ─────────────────────────────────────

  const register = async () => {
    if (!('serviceWorker' in navigator)) {
      console.log(
        '[SW] Service workers not supported'
      )
      return
    }

    try {
      registration =
        await navigator.serviceWorker.register(
          '/service-worker.js',
          {
            scope: '/',
            updateViaCache: 'none'
          }
        )

      console.log(
        '[SW] Registered successfully:',
        registration.scope
      )

      // Check for updates
      registration.addEventListener(
        'updatefound',
        handleUpdateFound
      )

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener(
        'message',
        handleSWMessage
      )

      // Detect controller change
      // (new SW took over)
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        handleControllerChange
      )

      // Check for waiting worker
      // on every page load
      if (registration.waiting) {
        handleWaitingWorker(registration.waiting)
      }

      return registration

    } catch (error) {
      console.error(
        '[SW] Registration failed:',
        error
      )
    }
  }

  // ─────────────────────────────────────
  // UPDATE FOUND
  // New service worker downloading
  // ─────────────────────────────────────

  const handleUpdateFound = () => {
    const newWorker = registration.installing
    if (!newWorker) return

    newWorker.addEventListener(
      'statechange',
      () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          handleWaitingWorker(newWorker)
        }
      }
    )
  }

  // ─────────────────────────────────────
  // WAITING WORKER
  // Show update available notification
  // ─────────────────────────────────────

  const handleWaitingWorker = (worker) => {
    isUpdateAvailable = true

    // Show update toast if available
    if (typeof ShareSystem !== 'undefined') {
      ShareSystem.toast(
        'Update available — reload to apply',
        'success'
      )
    }

    // Inject update banner
    injectUpdateBanner(worker)
  }

  const injectUpdateBanner = (worker) => {
    // Don't inject twice
    if (document.getElementById('ndic-update-banner')) {
      return
    }

    const banner = document.createElement('div')
    banner.id = 'ndic-update-banner'
    banner.style.cssText = `
      position: fixed;
      inset-block-end: 80px;
      inset-inline-end: 24px;
      z-index: 500;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #161d28;
      border: 1px solid rgba(255,255,255,0.10);
      border-inline-start: 3px solid #00b4d8;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.7);
      font-family: 'Be Vietnam Pro', sans-serif;
      font-size: 12px;
      color: #e8edf4;
      max-width: 300px;
      animation: slideUp 300ms ease both;
    `

    banner.innerHTML = `
      <span style="flex:1;line-height:1.5;">
        A new version of IntelReap is available.
      </span>
      <button
        id="ndic-update-btn"
        style="
          padding: 6px 12px;
          background: #00b4d8;
          color: #05060a;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
        "
      >
        Update
      </button>
      <button
        id="ndic-update-dismiss"
        style="
          background: none;
          border: none;
          color: #3d4f62;
          cursor: pointer;
          font-size: 16px;
          padding: 0 4px;
          line-height: 1;
        "
        aria-label="Dismiss update"
      >
        ✕
      </button>
    `

    document.body.appendChild(banner)

    document.getElementById('ndic-update-btn')
      ?.addEventListener('click', () => {
        worker.postMessage({
          type: 'SKIP_WAITING'
        })
        banner.remove()
      })

    document.getElementById('ndic-update-dismiss')
      ?.addEventListener('click', () => {
        banner.remove()
      })

    // Auto dismiss after 10 seconds
    setTimeout(() => {
      if (banner.parentNode) {
        banner.style.opacity = '0'
        banner.style.transition = 'opacity 300ms'
        setTimeout(() => banner.remove(), 300)
      }
    }, 10000)
  }

  // ─────────────────────────────────────
  // CONTROLLER CHANGE
  // Reload page after SW update
  // ─────────────────────────────────────

  let isRefreshing = false

  const handleControllerChange = () => {
    if (isRefreshing) return
    isRefreshing = true
    window.location.reload()
  }

  // ─────────────────────────────────────
  // SW MESSAGE HANDLER
  // ─────────────────────────────────────

  const handleSWMessage = (event) => {
    const { type } = event.data || {}

    switch (type) {
      case 'BACKGROUND_SYNC':
        // SW asking us to retry scan
        if (
          typeof CoreEngine !== 'undefined' &&
          navigator.onLine
        ) {
          CoreEngine.initialize()
        }
        break

      case 'CACHE_CLEARED':
        console.log('[SW] Cache cleared')
        break

      default:
        break
    }
  }

  // ─────────────────────────────────────
  // PWA INSTALL PROMPT
  // Captures and stores beforeinstallprompt
  // ─────────────────────────────────────

  const initInstallPrompt = () => {
    window.addEventListener(
      'beforeinstallprompt',
      (event) => {
        // Prevent Chrome mini-infobar
        event.preventDefault()
        deferredInstallPrompt = event

        // Show install button if exists
        const installBtn =
          document.getElementById('ndic-install-btn')
        if (installBtn) {
          installBtn.style.display = 'flex'
          installBtn.addEventListener(
            'click',
            showInstallPrompt
          )
        }

        console.log(
          '[SW] Install prompt available'
        )
      }
    )

    // Track successful install
    window.addEventListener(
      'appinstalled',
      () => {
        deferredInstallPrompt = null
        console.log('[SW] App installed')

        if (typeof ShareSystem !== 'undefined') {
          ShareSystem.toast(
            'IntelReap installed successfully',
            'success'
          )
        }
      }
    )
  }

  // Show native install prompt
  const showInstallPrompt = async () => {
    if (!deferredInstallPrompt) return

    deferredInstallPrompt.prompt()

    const { outcome } =
      await deferredInstallPrompt.userChoice

    console.log('[SW] Install outcome:', outcome)

    deferredInstallPrompt = null

    // Hide install button
    const installBtn =
      document.getElementById('ndic-install-btn')
    if (installBtn) {
      installBtn.style.display = 'none'
    }
  }

  // ─────────────────────────────────────
  // ONLINE / OFFLINE DETECTION
  // ─────────────────────────────────────

  const initNetworkDetection = () => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine

      // Update body class
      document.body.classList.toggle(
        'ndic-offline',
        !isOnline
      )

      // Update meta
      if (
        typeof updateMeta !== 'undefined'
      ) {
        updateMeta({ isOnline })
      }

      if (!isOnline) {
        console.log('[SW] Device went offline')
      } else {
        console.log('[SW] Device back online')
      }
    }

    window.addEventListener(
      'online',
      updateOnlineStatus
    )
    window.addEventListener(
      'offline',
      updateOnlineStatus
    )

    // Set initial state
    updateOnlineStatus()
  }

  // ─────────────────────────────────────
  // CHECK FOR SW UPDATE PERIODICALLY
  // ─────────────────────────────────────

  const startUpdateCheck = () => {
    // Check for SW updates every 60 minutes
    setInterval(async () => {
      if (registration) {
        try {
          await registration.update()
        } catch {
          // Fail silently
        }
      }
    }, 3600000)
  }

  // ─────────────────────────────────────
  // GET SW VERSION
  // ─────────────────────────────────────

  const getVersion = () => {
    return new Promise((resolve) => {
      if (
        !navigator.serviceWorker?.controller
      ) {
        resolve(null)
        return
      }

      const channel = new MessageChannel()
      channel.port1.onmessage = (event) => {
        resolve(event.data?.version || null)
      }

      navigator.serviceWorker.controller
        .postMessage(
          { type: 'GET_VERSION' },
          [channel.port2]
        )

      // Timeout after 2 seconds
      setTimeout(() => resolve(null), 2000)
    })
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = async () => {
    initInstallPrompt()
    initNetworkDetection()

    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        async () => {
          await register()
          startUpdateCheck()
        }
      )
    } else {
      await register()
      startUpdateCheck()
    }
  }

  // Auto initialize
  init()

  return {
    register,
    showInstallPrompt,
    getVersion,
    isUpdateAvailable: () => isUpdateAvailable
  }

})()
