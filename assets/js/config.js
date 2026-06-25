const NDIC_CONFIG = {

  // Backend URL
  // Confirmed working and tested
  BACKEND_URL: 'https://intelreap-backend.vercel.app',

  // API endpoints
  ENDPOINTS: {
    health:             '/api/health',
    ipIdentity:         '/api/ip-identity',
    ipDeep:             '/api/ip-deep',
    proxyIntelligence:  '/api/proxy-intelligence',
    aiSummary:          '/api/ai-summary',
    headersEcho:        '/api/headers-echo',
    ipv6Check:          '/api/ipv6-check'
  },

  // Scan intervals in milliseconds
  INTERVALS: {
    networkTick:        3000,   // 3 seconds
    uiRefresh:          5000,   // 5 seconds
    aiSummaryRefresh:   60000,  // 60 seconds
    uptimeCounter:      1000,   // 1 second
    latencyHistory:     3000    // 3 seconds
  },

  // Cache and history settings
  LIMITS: {
    rttHistoryLength:   60,
    maxFeedEvents:      200,
    apiTimeoutMs:       10000,
    retryAttempts:      3,
    retryDelayMs:       2000
  },

  // Scoring weights
  // Must total 100
  SCORING_WEIGHTS: {
    network:      15,
    identity:     5,
    privacy:      10,
    device:       15,
    graphics:     5,
    security:     20,
    capability:   10,
    performance:  10,
    speed:        10
  },

  // Health classification thresholds
  HEALTH_THRESHOLDS: {
    excellent:    90,
    healthy:      70,
    fair:         50,
    poor:         30
  },

  // Core Web Vitals thresholds
  // Based on Google official values
  VITALS_THRESHOLDS: {
    lcp: {
      good:       2500,
      needsWork:  4000
    },
    fcp: {
      good:       1800,
      needsWork:  3000
    },
    cls: {
      good:       0.1,
      needsWork:  0.25
    },
    inp: {
      good:       200,
      needsWork:  500
    },
    ttfb: {
      good:       800,
      needsWork:  1800
    },
    fid: {
      good:       100,
      needsWork:  300
    }
  },

  // Performance percentile benchmarks
  // Load time in milliseconds
  PERFORMANCE_BENCHMARKS: {
    top10:        1000,
    top30:        2000,
    top50:        3000,
    bottom30:     5000
  },

  // Device capability tier thresholds
  DEVICE_TIERS: {
    flagship: {
      minCores:   8,
      minRam:     8
    },
    high: {
      minCores:   6,
      minRam:     4
    },
    mid: {
      minCores:   4,
      minRam:     2
    }
  },

  // Graphics tier score thresholds
  GRAPHICS_TIERS: {
    ultra:        90,
    advanced:     70,
    standard:     40
  },

  // Deep dive page URLs
  DEEP_DIVE_URLS: {
    canvas1:  '/intelligence/network-route',
    canvas2:  '/intelligence/network-identity',
    canvas3:  '/intelligence/vpn-proxy',
    canvas4:  '/intelligence/live-network',
    canvas5:  '/intelligence/device',
    canvas6:  '/intelligence/graphics',
    canvas7:  '/intelligence/security',
    canvas8:  '/intelligence/capability',
    canvas9:  '/intelligence/performance',
    canvas10: '/intelligence/rendering-speed',
    canvas11: '/intelligence/scoreboard',
    canvas12: '/intelligence/live-feed',
    canvas13: '/intelligence/fingerprinting'
  },

  // Deep dive link text per canvas
  DEEP_DIVE_LABELS: {
    canvas1:  'Deep dive into your network infrastructure analysis',
    canvas2:  'Deep dive into your network identity analysis',
    canvas3:  'Deep dive into your VPN and routing analysis',
    canvas4:  'Deep dive into your live network analysis',
    canvas5:  'Deep dive into your device analysis',
    canvas6:  'Deep dive into your graphics engine analysis',
    canvas7:  'Deep dive into your security and privacy analysis',
    canvas8:  'Deep dive into your browser capability analysis',
    canvas9:  'Deep dive into your performance analysis',
    canvas10: 'Deep dive into your rendering speed analysis',
    canvas11: 'Deep dive into your global score analysis',
    canvas12: 'Deep dive into your live intelligence feed',
    canvas13: 'Deep dive into your fingerprint and leak exposure analysis'
  },

  // Canvas headings
  CANVAS_HEADINGS: {
    canvas1: {
      technical: 'ASN & Network Route Intelligence',
      plain:     'What Network Are You On?'
    },
    canvas2: {
      technical: 'Network Identity Panel',
      plain:     'Who Are You On The Internet?'
    },
    canvas3: {
      technical: 'VPN, Proxy & Routing Intelligence',
      plain:     'Are You Hidden Online?'
    },
    canvas4: {
      technical: 'Live Network Monitor',
      plain:     'How Fast Is Your Connection?'
    },
    canvas5: {
      technical: 'Device Intelligence Panel',
      plain:     'What Device Are You Using?'
    },
    canvas6: {
      technical: 'Graphics Engine Panel',
      plain:     'How Powerful Is Your Device?'
    },
    canvas7: {
      technical: 'Security & Privacy Panel',
      plain:     'How Safe Are You Right Now?'
    },
    canvas8: {
      technical: 'Capability Matrix',
      plain:     'What Can Your Browser Do?'
    },
    canvas9: {
      technical: 'Performance Intelligence Panel',
      plain:     'How Fast Is Your Browser?'
    },
    canvas10: {
      technical: 'Browser & Rendering Speed Intelligence',
      plain:     'How Fast Does Your Device Render?'
    },
    canvas11: {
      technical: 'Global Intelligence Scoreboard',
      plain:     'Your Overall Score'
    },
    canvas12: {
      technical: 'Live Intelligence Feed',
      plain:     'What Just Happened?'
    },
    canvas13: {
      technical: 'Advanced Fingerprint & Leak Detection',
      plain:     'How Easily Can You Be Tracked?'
    }
  },

  // System version
  VERSION: '1.0.0',

  // Environment
  ENV: 'production'
}

// Freeze config to prevent
// accidental mutation
Object.freeze(NDIC_CONFIG)
Object.freeze(NDIC_CONFIG.ENDPOINTS)
Object.freeze(NDIC_CONFIG.INTERVALS)
Object.freeze(NDIC_CONFIG.LIMITS)
Object.freeze(NDIC_CONFIG.SCORING_WEIGHTS)
Object.freeze(NDIC_CONFIG.HEALTH_THRESHOLDS)
Object.freeze(NDIC_CONFIG.VITALS_THRESHOLDS)
Object.freeze(NDIC_CONFIG.DEVICE_TIERS)
Object.freeze(NDIC_CONFIG.DEEP_DIVE_URLS)
Object.freeze(NDIC_CONFIG.CANVAS_HEADINGS)
