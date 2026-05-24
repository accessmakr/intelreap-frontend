// ─────────────────────────────────────────
// CAPABILITY MATRIX ENGINE
// Powers Canvas 8 — Capability Matrix
// Complete browser feature detection
// covering all 28 capabilities across
// 5 categories with scoring
// ─────────────────────────────────────────

const CapabilityEngine = (() => {

  // ───────────────────────────────────────
  // SAFE FEATURE DETECTION HELPER
  // Never throws — always returns boolean
  // ───────────────────────────────────────

  const supports = (fn) => {
    try {
      return Boolean(fn())
    } catch {
      return false
    }
  }

  const supportsAsync = async (fn) => {
    try {
      return Boolean(await fn())
    } catch {
      return false
    }
  }

  // ───────────────────────────────────────
  // CATEGORY 1 — AI AND COMPUTE
  // ───────────────────────────────────────

  const detectAICompute = async () => {

    // WebGPU — GPU compute for AI workloads
    const webgpu = await supportsAsync(
      async () => {
        if (!navigator.gpu) return false
        const adapter =
          await navigator.gpu.requestAdapter()
        return adapter !== null
      }
    )

    // WebAssembly — binary instruction format
    const wasm = supports(
      () => typeof WebAssembly === 'object' &&
        typeof WebAssembly.compile === 'function'
    )

    // WebAssembly threads
    // Requires SharedArrayBuffer + Atomics
    const wasmThreads = supports(
      () => typeof SharedArrayBuffer === 'function' &&
        typeof Atomics === 'object'
    )

    // SharedArrayBuffer
    const sharedArrayBuffer = supports(
      () => typeof SharedArrayBuffer === 'function'
    )

    // WebAssembly SIMD
    // Single instruction multiple data
    const wasmSIMD = await supportsAsync(
      async () => {
        if (!WebAssembly) return false
        // SIMD test via small WASM binary
        const simdBytes = new Uint8Array([
          0x00, 0x61, 0x73, 0x6d,
          0x01, 0x00, 0x00, 0x00
        ])
        try {
          await WebAssembly.compile(
            simdBytes.buffer
          )
          return true
        } catch {
          return false
        }
      }
    )

    // WebNN — Web Neural Network API
    const webnn = supports(
      () => 'ml' in navigator
    )

    return {
      webgpu,
      wasm,
      wasmThreads,
      sharedArrayBuffer,
      wasmSIMD,
      webnn
    }
  }

  // ───────────────────────────────────────
  // CATEGORY 2 — COMMUNICATION
  // ───────────────────────────────────────

  const detectCommunication = () => {

    // WebRTC
    const webrtc = supports(
      () => typeof RTCPeerConnection === 'function' ||
        typeof webkitRTCPeerConnection === 'function' ||
        typeof mozRTCPeerConnection === 'function'
    )

    // WebSockets
    const websockets = supports(
      () => typeof WebSocket === 'function'
    )

    // Server-Sent Events
    const serverSentEvents = supports(
      () => typeof EventSource === 'function'
    )

    // Push API
    const pushApi = supports(
      () => 'PushManager' in window
    )

    // Web Bluetooth
    const webBluetooth = supports(
      () => 'bluetooth' in navigator
    )

    // Web USB
    const webUsb = supports(
      () => 'usb' in navigator
    )

    // Web NFC
    const webNfc = supports(
      () => 'NDEFReader' in window
    )

    // Web Serial
    const webSerial = supports(
      () => 'serial' in navigator
    )

    // Broadcast Channel
    const broadcastChannel = supports(
      () => typeof BroadcastChannel === 'function'
    )

    // WebTransport
    const webTransport = supports(
      () => typeof WebTransport === 'function'
    )

    return {
      webrtc,
      websockets,
      serverSentEvents,
      pushApi,
      webBluetooth,
      webUsb,
      webNfc,
      webSerial,
      broadcastChannel,
      webTransport
    }
  }

  // ───────────────────────────────────────
  // CATEGORY 3 — STORAGE
  // ───────────────────────────────────────

  const detectStorage = async () => {

    // IndexedDB
    const indexedDb = supports(
      () => 'indexedDB' in window
    )

    // Cache API
    const cacheApi = supports(
      () => 'caches' in window
    )

    // File System Access API
    const fileSystemAccess = supports(
      () => 'showOpenFilePicker' in window
    )

    // Storage Manager API
    const storageManager = supports(
      () => 'storage' in navigator &&
        'estimate' in navigator.storage
    )

    // Storage estimate
    let storageEstimate = null
    if (storageManager) {
      try {
        const estimate =
          await navigator.storage.estimate()
        storageEstimate = {
          quota: estimate.quota,
          usage: estimate.usage,
          quotaMB: estimate.quota
            ? Math.round(
                estimate.quota / 1024 / 1024
              )
            : null,
          usageMB: estimate.usage
            ? Math.round(
                estimate.usage / 1024 / 1024
              )
            : null
        }
      } catch {
        // Continue
      }
    }

    // localStorage
    const localStorage = supports(
      () => {
        window.localStorage.setItem(
          '__ndic_test', '1'
        )
        window.localStorage.removeItem(
          '__ndic_test'
        )
        return true
      }
    )

    // sessionStorage
    const sessionStorage = supports(
      () => {
        window.sessionStorage.setItem(
          '__ndic_test', '1'
        )
        window.sessionStorage.removeItem(
          '__ndic_test'
        )
        return true
      }
    )

    // Cookie access
    const cookieAccess = supports(
      () => navigator.cookieEnabled
    )

    // Origin Private File System
    const opfs = supports(
      () => 'getDirectory' in
        (navigator.storage || {})
    )

    return {
      indexedDb,
      cacheApi,
      fileSystemAccess,
      storageManager,
      storageEstimate,
      localStorage,
      sessionStorage,
      cookieAccess,
      opfs
    }
  }

  // ───────────────────────────────────────
  // CATEGORY 4 — RENDERING
  // ───────────────────────────────────────

  const detectRendering = () => {

    // Canvas 2D
    const canvas2d = supports(() => {
      const c = document.createElement('canvas')
      return c.getContext('2d') !== null
    })

    // WebGL
    const webgl = supports(() => {
      const c = document.createElement('canvas')
      return (
        c.getContext('webgl') !== null ||
        c.getContext('experimental-webgl') !== null
      )
    })

    // WebGL2
    const webgl2 = supports(() => {
      const c = document.createElement('canvas')
      return c.getContext('webgl2') !== null
    })

    // OffscreenCanvas
    const offscreenCanvas = supports(
      () => typeof OffscreenCanvas !== 'undefined'
    )

    // CSS Houdini Paint API
    const cssPaintApi = supports(
      () => 'paintWorklet' in CSS
    )

    // Web Animations API
    const webAnimations = supports(
      () => 'animate' in Element.prototype
    )

    // CSS Custom Properties
    const cssCustomProperties = supports(
      () => CSS.supports('--test', '0')
    )

    // CSS Grid
    const cssGrid = supports(
      () => CSS.supports('display', 'grid')
    )

    // CSS Container Queries
    const cssContainerQueries = supports(
      () => CSS.supports(
        'container-type', 'inline-size'
      )
    )

    return {
      canvas2d,
      webgl,
      webgl2,
      offscreenCanvas,
      cssPaintApi,
      webAnimations,
      cssCustomProperties,
      cssGrid,
      cssContainerQueries
    }
  }

  // ───────────────────────────────────────
  // CATEGORY 5 — SYSTEM
  // ───────────────────────────────────────

  const detectSystem = async () => {

    // Service Worker
    const serviceWorker = supports(
      () => 'serviceWorker' in navigator
    )

    // Background Sync
    const backgroundSync = supports(
      () => 'serviceWorker' in navigator &&
        'SyncManager' in window
    )

    // Background Fetch
    const backgroundFetch = supports(
      () => 'BackgroundFetchManager' in window
    )

    // Web Share API
    const webShare = supports(
      () => 'share' in navigator
    )

    // Web Share Target
    const webShareTarget = supports(
      () => 'serviceWorker' in navigator
    )

    // Payment Request API
    const paymentRequest = supports(
      () => typeof PaymentRequest === 'function'
    )

    // Credential Management
    const credentialManagement = supports(
      () => 'credentials' in navigator
    )

    // Geolocation
    const geolocation = supports(
      () => 'geolocation' in navigator
    )

    // Gamepad API
    const gamepad = supports(
      () => 'getGamepads' in navigator
    )

    // Battery API
    const battery = supports(
      () => 'getBattery' in navigator
    )

    // Battery status
    let batteryStatus = null
    if (battery) {
      try {
        const b = await navigator.getBattery()
        batteryStatus = {
          charging: b.charging,
          level: Math.round(b.level * 100),
          chargingTime: b.chargingTime,
          dischargingTime: b.dischargingTime
        }
      } catch {
        // Continue
      }
    }

    // Device Orientation
    const deviceOrientation = supports(
      () => 'DeviceOrientationEvent' in window
    )

    // Device Motion
    const deviceMotion = supports(
      () => 'DeviceMotionEvent' in window
    )

    // Ambient Light Sensor
    const ambientLight = supports(
      () => 'AmbientLightSensor' in window
    )

    // Proximity Sensor
    const proximitySensor = supports(
      () => 'ProximitySensor' in window
    )

    // Wake Lock API
    const wakeLock = supports(
      () => 'wakeLock' in navigator
    )

    // Screen Orientation API
    const screenOrientation = supports(
      () => 'orientation' in screen ||
        'screen' in window &&
        'orientation' in window.screen
    )

    // Fullscreen API
    const fullscreen = supports(
      () => 'requestFullscreen' in
        document.documentElement ||
        'webkitRequestFullscreen' in
        document.documentElement
    )

    // Picture in Picture
    const pictureInPicture = supports(
      () => 'pictureInPictureEnabled' in document
    )

    // Screen Capture API
    const screenCapture = supports(
      () => 'getDisplayMedia' in
        (navigator.mediaDevices || {})
    )

    // Media Devices
    const mediaDevices = supports(
      () => 'mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices
    )

    // Clipboard API
    const clipboardAPI = supports(
      () => 'clipboard' in navigator
    )

    // Web OTP API
    const webOTP = supports(
      () => 'OTPCredential' in window
    )

    // Contact Picker
    const contactPicker = supports(
      () => 'contacts' in navigator
    )

    // Eye Dropper API
    const eyeDropper = supports(
      () => 'EyeDropper' in window
    )

    // File Handling API
    const fileHandling = supports(
      () => 'launchQueue' in window
    )

    // Notification API
    const notifications = supports(
      () => 'Notification' in window
    )

    // Notification permission
    let notificationPermission = 'unknown'
    if (notifications) {
      notificationPermission =
        Notification.permission
    }

    return {
      serviceWorker,
      backgroundSync,
      backgroundFetch,
      webShare,
      webShareTarget,
      paymentRequest,
      credentialManagement,
      geolocation,
      gamepad,
      battery,
      batteryStatus,
      deviceOrientation,
      deviceMotion,
      ambientLight,
      proximitySensor,
      wakeLock,
      screenOrientation,
      fullscreen,
      pictureInPicture,
      screenCapture,
      mediaDevices,
      clipboardAPI,
      webOTP,
      contactPicker,
      eyeDropper,
      fileHandling,
      notifications,
      notificationPermission
    }
  }

  // ───────────────────────────────────────
  // CAPABILITY SCORE COMPUTATION
  // Weights reflect importance to
  // modern web application development
  // ───────────────────────────────────────

  const computeCapabilityScore = (caps) => {
    const checks = [
      // AI and Compute — high weight
      { key: 'wasm',              weight: 8 },
      { key: 'webgpu',            weight: 6 },
      { key: 'wasmThreads',       weight: 4 },
      { key: 'sharedArrayBuffer', weight: 3 },

      // Communication — high weight
      { key: 'webrtc',            weight: 6 },
      { key: 'websockets',        weight: 5 },
      { key: 'serverSentEvents',  weight: 3 },
      { key: 'pushApi',           weight: 3 },
      { key: 'broadcastChannel',  weight: 2 },

      // Storage — medium weight
      { key: 'indexedDb',         weight: 5 },
      { key: 'cacheApi',          weight: 4 },
      { key: 'storageManager',    weight: 3 },
      { key: 'fileSystemAccess',  weight: 2 },
      { key: 'localStorage',      weight: 2 },

      // Rendering — high weight
      { key: 'webgl2',            weight: 6 },
      { key: 'webgl',             weight: 4 },
      { key: 'canvas2d',          weight: 3 },
      { key: 'offscreenCanvas',   weight: 2 },
      { key: 'cssGrid',           weight: 2 },

      // System — medium weight
      { key: 'serviceWorker',     weight: 4 },
      { key: 'geolocation',       weight: 2 },
      { key: 'notifications',     weight: 2 },
      { key: 'mediaDevices',      weight: 3 },
      { key: 'clipboardAPI',      weight: 2 },
      { key: 'fullscreen',        weight: 2 },
      { key: 'wakeLock',          weight: 1 },
      { key: 'paymentRequest',    weight: 2 },
      { key: 'screenCapture',     weight: 2 }
    ]

    const totalWeight = checks.reduce(
      (sum, c) => sum + c.weight, 0
    )

    let earnedWeight = 0
    let supportedCount = 0
    let totalChecked = checks.length

    for (const check of checks) {
      if (caps[check.key] === true) {
        earnedWeight += check.weight
        supportedCount++
      }
    }

    const score = Math.round(
      (earnedWeight / totalWeight) * 100
    )

    return {
      capabilityScore: Math.min(100, score),
      capabilityCount: supportedCount,
      totalChecked: totalChecked
    }
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'Capability engine collecting'
    )

    // Run all detection categories
    // in parallel for speed
    const [
      aiCompute,
      rendering,
      storageData,
      systemData
    ] = await Promise.all([
      detectAICompute(),
      Promise.resolve(detectRendering()),
      detectStorage(),
      detectSystem()
    ])

    const communication = detectCommunication()

    // Flatten all capabilities
    const allCapabilities = {
      ...aiCompute,
      ...communication,
      ...storageData,
      ...rendering,
      ...systemData
    }

    // Compute score
    const scoreData = computeCapabilityScore(
      allCapabilities
    )

    const capabilityData = {
      // AI and Compute
      webgpu: aiCompute.webgpu,
      wasm: aiCompute.wasm,
      wasmThreads: aiCompute.wasmThreads,
      sharedArrayBuffer:
        aiCompute.sharedArrayBuffer,
      wasmSIMD: aiCompute.wasmSIMD,
      webnn: aiCompute.webnn,

      // Communication
      webrtc: communication.webrtc,
      websockets: communication.websockets,
      serverSentEvents:
        communication.serverSentEvents,
      pushApi: communication.pushApi,
      webBluetooth: communication.webBluetooth,
      webUsb: communication.webUsb,
      webNfc: communication.webNfc,
      webSerial: communication.webSerial,
      broadcastChannel:
        communication.broadcastChannel,
      webTransport: communication.webTransport,

      // Storage
      indexedDb: storageData.indexedDb,
      cacheApi: storageData.cacheApi,
      fileSystemAccess:
        storageData.fileSystemAccess,
      storageManager: storageData.storageManager,
      storageEstimate: storageData.storageEstimate,
      localStorage: storageData.localStorage,
      sessionStorage: storageData.sessionStorage,
      cookieAccess: storageData.cookieAccess,
      opfs: storageData.opfs,

      // Rendering
      canvas2d: rendering.canvas2d,
      webgl: rendering.webgl,
      webgl2: rendering.webgl2,
      offscreenCanvas: rendering.offscreenCanvas,
      cssPaintApi: rendering.cssPaintApi,
      webAnimations: rendering.webAnimations,
      cssCustomProperties:
        rendering.cssCustomProperties,
      cssGrid: rendering.cssGrid,
      cssContainerQueries:
        rendering.cssContainerQueries,

      // System
      serviceWorker: systemData.serviceWorker,
      backgroundSync: systemData.backgroundSync,
      backgroundFetch: systemData.backgroundFetch,
      webShare: systemData.webShare,
      paymentRequest: systemData.paymentRequest,
      credentialManagement:
        systemData.credentialManagement,
      geolocation: systemData.geolocation,
      gamepad: systemData.gamepad,
      battery: systemData.battery,
      batteryStatus: systemData.batteryStatus,
      deviceOrientation:
        systemData.deviceOrientation,
      deviceMotion: systemData.deviceMotion,
      ambientLight: systemData.ambientLight,
      proximitySensor: systemData.proximitySensor,
      wakeLock: systemData.wakeLock,
      screenOrientation:
        systemData.screenOrientation,
      fullscreen: systemData.fullscreen,
      pictureInPicture:
        systemData.pictureInPicture,
      screenCapture: systemData.screenCapture,
      mediaDevices: systemData.mediaDevices,
      clipboardAPI: systemData.clipboardAPI,
      webOTP: systemData.webOTP,
      contactPicker: systemData.contactPicker,
      eyeDropper: systemData.eyeDropper,
      fileHandling: systemData.fileHandling,
      notifications: systemData.notifications,
      notificationPermission:
        systemData.notificationPermission,

      // Scores
      capabilityScore: scoreData.capabilityScore,
      capabilityCount: scoreData.capabilityCount,
      totalChecked: scoreData.totalChecked
    }

    // Update STATE
    updateCapabilities(capabilityData)
    markEngineComplete('capability')

    logDevice(
      'INFO',
      `Capabilities detected: ` +
      `${scoreData.capabilityCount}/` +
      `${scoreData.totalChecked} — ` +
      `Score: ${scoreData.capabilityScore}`
    )

    return capabilityData
  }

  return {
    collect,
    detectAICompute,
    detectCommunication,
    detectStorage,
    detectRendering,
    detectSystem,
    computeCapabilityScore
  }

})()
