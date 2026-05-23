const STATE = {

  network: {
    asn: null,
    asnNumber: null,
    asnOwner: null,
    asnType: null,
    asnCategory: null,
    networkTier: null,
    networkTierNumber: null,
    ipRange: null,
    allocationRegistry: null,
    routeOrigin: null,
    estimatedPeeringCount: null,
    upstreamProvider: null,
    announcementStatus: null,
    bgpRouteStatus: null,
    networkHealthScore: null,
    classificationSource: null,
    classificationConfidence: null,
    isHosting: null,
    isMobile: null,
    isProxy: null,
    peeringdbData: null
  },

  identity: {
    ip: null,
    ipVersion: null,
    isp: null,
    org: null,
    country: null,
    countryCode: null,
    region: null,
    city: null,
    postal: null,
    latitude: null,
    longitude: null,
    timezone: null,
    utcOffset: null,
    connectionType: null,
    mobile: null,
    proxy: null,
    hosting: null,
    continent: null,
    source: null
  },

  vpn: {
    vpnDetected: null,
    proxyDetected: null,
    torDetected: null,
    datacenterDetected: null,
    ipClassification: null,
    asnOwnershipType: null,
    timezoneMatch: null,
    languageMatch: null,
    webrtcMatch: null,
    reverseDnsMatch: null,
    fraudScore: null,
    abuseScore: null,
    botDetected: null,
    trustScore: null,
    routeClassification: null,
    detectionFlags: [],
    confidence: null,
    primarySource: null,
    orgAnalysis: null,
    mismatchAnalysis: null,
    paidAPIConsulted: null
  },

  liveNetwork: {
    currentRtt: null,
    averageRtt: null,
    peakRtt: null,
    lowestRtt: null,
    bandwidth: null,
    effectiveType: null,
    saveData: null,
    stabilityIndex: null,
    packetLossEstimate: null,
    qualityRating: null,
    jitterEstimate: null,
    uptimeSinceLoad: 0,
    rttHistory: [],
    bandwidthHistory: [],
    connectionChangeCount: 0
  },

  device: {
    os: null,
    osVersion: null,
    browser: null,
    browserVersion: null,
    browserEngine: null,
    deviceType: null,
    deviceBrand: null,
    cpuCores: null,
    ram: null,
    screenWidth: null,
    screenHeight: null,
    viewportWidth: null,
    viewportHeight: null,
    pixelRatio: null,
    touchSupport: null,
    maxTouchPoints: null,
    orientationSupport: null,
    capabilityTier: null,
    colorDepth: null,
    colorGamut: null
  },

  graphics: {
    gpuVendor: null,
    gpuRenderer: null,
    webglVersion: null,
    webglSupportLevel: null,
    hardwareAcceleration: null,
    maxTextureSize: null,
    maxViewportSize: null,
    shaderPrecision: null,
    extensionsCount: null,
    glslVersion: null,
    antialiasingSupport: null,
    depthBufferBits: null,
    stencilBufferBits: null,
    maxAnisotropy: null,
    renderingScore: null,
    graphicsTier: null,
    supportedExtensions: []
  },

  security: {
    httpsStatus: null,
    secureContext: null,
    mixedContent: null,
    webrtcExposure: null,
    localIp: null,
    webrtcIpMatch: null,
    cookieAccess: null,
    localStorageAccess: null,
    sessionStorageAccess: null,
    indexedDbAccess: null,
    cameraPermission: null,
    microphonePermission: null,
    locationPermission: null,
    notificationPermission: null,
    thirdPartyCookies: null,
    doNotTrack: null,
    referrerPolicy: null,
    cspPresence: null,
    securityScore: null,
    riskLevel: null
  },

  capabilities: {
    // AI and Compute
    webgpu: null,
    wasm: null,
    wasmThreads: null,
    sharedArrayBuffer: null,
    // Communication
    webrtc: null,
    websockets: null,
    serverSentEvents: null,
    pushApi: null,
    webBluetooth: null,
    webUsb: null,
    webNfc: null,
    // Storage
    indexedDb: null,
    cacheApi: null,
    fileSystemAccess: null,
    storageManager: null,
    // Rendering
    canvas2d: null,
    webgl: null,
    webgl2: null,
    offscreenCanvas: null,
    // System
    serviceWorker: null,
    backgroundSync: null,
    webShare: null,
    paymentRequest: null,
    credentialManagement: null,
    geolocation: null,
    gamepad: null,
    battery: null,
    // Score
    capabilityScore: null,
    capabilityCount: null,
    totalChecked: null
  },

  performance: {
    pageLoadTime: null,
    domContentLoaded: null,
    domInteractive: null,
    ttfb: null,
    dnsLookup: null,
    tcpConnection: null,
    tlsHandshake: null,
    requestTime: null,
    responseTime: null,
    domProcessing: null,
    resourceFetchTime: null,
    resourceCount: null,
    pageWeight: null,
    scriptCount: null,
    stylesheetCount: null,
    imageCount: null,
    fontCount: null,
    cacheHitRate: null,
    runtimeScore: null,
    percentileRating: null
  },

  speed: {
    // Core Web Vitals
    lcp: null,
    lcpRating: null,
    fcp: null,
    fcpRating: null,
    cls: null,
    clsRating: null,
    inp: null,
    inpRating: null,
    ttfb: null,
    ttfbRating: null,
    fid: null,
    fidRating: null,
    // Browser benchmarks
    jsExecutionScore: null,
    domManipulationScore: null,
    canvasRenderScore: null,
    memoryAccessScore: null,
    cssAnimationScore: null,
    eventLoopScore: null,
    benchmarkScore: null,
    // Comparisons
    vsAverageMobile: null,
    vsAverageDesktop: null,
    vsTopTier: null,
    percentileRanking: null
  },

  scores: {
    networkScore: 0,
    identityScore: 0,
    privacyScore: 0,
    deviceScore: 0,
    graphicsScore: 0,
    securityScore: 0,
    capabilityScore: 0,
    performanceScore: 0,
    speedScore: 0,
    globalScore: 0,
    healthClassification: null,
    strongestArea: null,
    weakestArea: null,
    improvementPriority: null
  },

  events: [],

  summaries: {
    canvas1: null,
    canvas2: null,
    canvas3: null,
    canvas4: null,
    canvas5: null,
    canvas6: null,
    canvas7: null,
    canvas8: null,
    canvas9: null,
    canvas10: null,
    canvas11: null,
    canvas12: null,
    fullSystem: null,
    lastUpdated: null,
    source: null
  },

  meta: {
    scanStartTime: null,
    lastFullScan: null,
    lastNetworkChange: null,
    isOnline: true,
    backendUrl: null,
    backendHealthy: false,
    apiCallCount: 0,
    errorCount: 0,
    cacheHits: 0,
    initialized: false,
    enginesComplete: {
      device: false,
      graphics: false,
      capability: false,
      security: false,
      performance: false,
      speed: false,
      network: false,
      ip: false,
      proxy: false,
      scoring: false
    }
  }
}

// State update functions
// Each updates a specific section
// and triggers canvas re-renders

const updateState = (section, data) => {
  if (!STATE[section]) {
    console.warn(
      `State section not found: ${section}`
    )
    return
  }

  Object.assign(STATE[section], data)
}

const updateNetwork = (data) =>
  updateState('network', data)

const updateIdentity = (data) =>
  updateState('identity', data)

const updateVPN = (data) =>
  updateState('vpn', data)

const updateLiveNetwork = (data) =>
  updateState('liveNetwork', data)

const updateDevice = (data) =>
  updateState('device', data)

const updateGraphics = (data) =>
  updateState('graphics', data)

const updateSecurity = (data) =>
  updateState('security', data)

const updateCapabilities = (data) =>
  updateState('capabilities', data)

const updatePerformance = (data) =>
  updateState('performance', data)

const updateSpeed = (data) =>
  updateState('speed', data)

const updateScores = (data) =>
  updateState('scores', data)

const updateSummaries = (data) =>
  updateState('summaries', data)

const updateMeta = (data) =>
  updateState('meta', data)

const addEvent = (event) => {
  STATE.events.unshift({
    ...event,
    id: Date.now() +
      Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  })

  // Keep events within limit
  if (
    STATE.events.length >
    NDIC_CONFIG.LIMITS.maxFeedEvents
  ) {
    STATE.events = STATE.events.slice(
      0,
      NDIC_CONFIG.LIMITS.maxFeedEvents
    )
  }
}

const markEngineComplete = (engineName) => {
  if (
    STATE.meta.enginesComplete
      .hasOwnProperty(engineName)
  ) {
    STATE.meta.enginesComplete[engineName] = true
  }
}

const areAllEnginesComplete = () => {
  return Object.values(
    STATE.meta.enginesComplete
  ).every(Boolean)
}

const getStateSnapshot = () => {
  return JSON.parse(JSON.stringify(STATE))
}

const resetState = () => {
  Object.keys(STATE).forEach(key => {
    if (key === 'events') {
      STATE.events = []
    } else if (key === 'meta') {
      STATE.meta.scanStartTime = null
      STATE.meta.lastFullScan = null
      STATE.meta.apiCallCount = 0
      STATE.meta.errorCount = 0
      STATE.meta.initialized = false
      Object.keys(
        STATE.meta.enginesComplete
      ).forEach(engine => {
        STATE.meta.enginesComplete[engine] =
          false
      })
    }
  })
}
