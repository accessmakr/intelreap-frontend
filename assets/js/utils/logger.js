// ─────────────────────────────────────────
// LIVE INTELLIGENCE FEED LOGGER
// Powers Canvas 12 — Live Intelligence Feed
// ─────────────────────────────────────────

// Event categories
const LOG_CATEGORIES = {
  NETWORK:     'NETWORK',
  SECURITY:    'SECURITY',
  SYSTEM:      'SYSTEM',
  API:         'API',
  SCORE:       'SCORE',
  DEVICE:      'DEVICE',
  PERFORMANCE: 'PERFORMANCE',
  VPN:         'VPN',
  AI:          'AI',
  ERROR:       'ERROR'
}

// Event severity levels
const LOG_SEVERITY = {
  INFO:     'INFO',
  WARNING:  'WARNING',
  CRITICAL: 'CRITICAL'
}

// Color map for categories
const CATEGORY_COLORS = {
  NETWORK:     'var(--color-accent-primary)',
  SECURITY:    'var(--color-danger)',
  SYSTEM:      'var(--color-score-good)',
  API:         'var(--color-accent-secondary)',
  SCORE:       'var(--color-accent-tertiary)',
  DEVICE:      'var(--color-score-good)',
  PERFORMANCE: 'var(--color-warning)',
  VPN:         'var(--color-warning)',
  AI:          'var(--color-accent-tertiary)',
  ERROR:       'var(--color-critical)'
}

// Color map for severity
const SEVERITY_COLORS = {
  INFO:     'var(--color-info)',
  WARNING:  'var(--color-warning)',
  CRITICAL: 'var(--color-critical)'
}

// Core log function
const log = (
  category,
  severity,
  message,
  data = null
) => {
  // Validate inputs
  const validCategory =
    LOG_CATEGORIES[category] ||
    LOG_CATEGORIES.SYSTEM
  const validSeverity =
    LOG_SEVERITY[severity] ||
    LOG_SEVERITY.INFO

  // Build event object
  const event = {
    category: validCategory,
    severity: validSeverity,
    message: message,
    data: data,
    categoryColor:
      CATEGORY_COLORS[validCategory] ||
      'var(--color-text-muted)',
    severityColor:
      SEVERITY_COLORS[validSeverity] ||
      'var(--color-text-muted)'
  }

  // Add to STATE events array
  addEvent(event)

  // Also log to console in development
  const consolePrefix =
    `[${validCategory}][${validSeverity}]`

  if (validSeverity === 'CRITICAL') {
    console.error(consolePrefix, message, data)
  } else if (validSeverity === 'WARNING') {
    console.warn(consolePrefix, message, data)
  } else {
    console.log(consolePrefix, message, data)
  }

  // Render to Canvas 12 feed
  renderFeedEvent(event)
}

// Render single event to Canvas 12
const renderFeedEvent = (event) => {
  const feed = el('canvas12-feed')
  if (!feed) return

  const entry = document.createElement('div')
  entry.className = 'ndic-feed-entry'
  entry.setAttribute(
    'data-severity',
    event.severity
  )

  const time = formatTimestamp(
    new Date().toISOString()
  )

  entry.innerHTML = `
    <span class="ndic-feed-time">
      ${time}
    </span>
    <span
      class="ndic-feed-category"
      style="color: ${event.categoryColor}"
    >
      ${event.category}
    </span>
    <span
      class="ndic-feed-severity"
      style="color: ${event.severityColor}"
    >
      ${event.severity}
    </span>
    <span class="ndic-feed-message">
      ${event.message}
    </span>
  `

  // Prepend to feed
  feed.insertBefore(entry, feed.firstChild)

  // Enforce max entries in DOM
  const entries = feed.querySelectorAll(
    '.ndic-feed-entry'
  )
  if (
    entries.length >
    NDIC_CONFIG.LIMITS.maxFeedEvents
  ) {
    feed.removeChild(
      feed.lastChild
    )
  }

  // Auto scroll if at top
  if (feed.scrollTop === 0) {
    feed.scrollTop = 0
  }
}

// Convenience log functions
// One per category for clean calling

const logNetwork = (severity, message, data) =>
  log('NETWORK', severity, message, data)

const logSecurity = (severity, message, data) =>
  log('SECURITY', severity, message, data)

const logSystem = (severity, message, data) =>
  log('SYSTEM', severity, message, data)

const logAPI = (severity, message, data) =>
  log('API', severity, message, data)

const logScore = (severity, message, data) =>
  log('SCORE', severity, message, data)

const logDevice = (severity, message, data) =>
  log('DEVICE', severity, message, data)

const logPerformance = (severity, message, data) =>
  log('PERFORMANCE', severity, message, data)

const logVPN = (severity, message, data) =>
  log('VPN', severity, message, data)

const logAI = (severity, message, data) =>
  log('AI', severity, message, data)

const logError = (message, data) =>
  log('ERROR', 'CRITICAL', message, data)

// System lifecycle events
const logScanStart = () =>
  logSystem('INFO',
    'Intelligence scan initialized'
  )

const logEngineComplete = (engineName) =>
  logSystem('INFO',
    `${engineName} engine complete`
  )

const logBackendResponse = (
  endpoint,
  responseTime,
  fromCache
) =>
  logAPI('INFO',
    `${endpoint} response received` +
    ` in ${responseTime}` +
    (fromCache ? ' (cached)' : '')
  )

const logBackendError = (endpoint, error) =>
  logAPI('WARNING',
    `${endpoint} failed: ${error}`
  )

const logNetworkChange = (
  oldType,
  newType
) =>
  logNetwork('WARNING',
    `Connection changed: ` +
    `${oldType || 'unknown'} → ${newType}`
  )

const logOffline = () =>
  logNetwork('CRITICAL',
    'Connection lost — offline'
  )

const logOnline = () =>
  logNetwork('INFO',
    'Connection restored — online'
  )

const logSecurityFlag = (flag, detail) =>
  logSecurity('WARNING',
    `Security flag raised: ` +
    `${flag}${detail ? ' — ' + detail : ''}`
  )

const logVPNDetected = (type) =>
  logVPN('WARNING',
    `${type} detected on connection`
  )

const logScoreUpdate = (
  area,
  oldScore,
  newScore
) =>
  logScore('INFO',
    `${area} score updated: ` +
    `${oldScore} → ${newScore}`
  )

const logGlobalScore = (score, health) =>
  logScore('INFO',
    `Global score computed: ` +
    `${score}/100 — ${health}`
  )

const logAISummary = (source, canvasId) =>
  logAI('INFO',
    `Summary generated via ${source}` +
    (canvasId ? ` for ${canvasId}` : '')
  )

const logWebRTCExposure = (localIP) =>
  logSecurity('CRITICAL',
    `WebRTC exposing local IP: ${localIP}`
  )

const logPermissionChange = (
  permission,
  status
) =>
  logSecurity('INFO',
    `Permission changed: ` +
    `${permission} → ${status}`
  )

// Render full feed from STATE.events
// Used when Canvas 12 first initializes
const renderFullFeed = () => {
  const feed = el('canvas12-feed')
  if (!feed) return

  feed.innerHTML = ''

  STATE.events.forEach(event => {
    renderFeedEvent(event)
  })
}

// Clear the feed display
const clearFeed = () => {
  const feed = el('canvas12-feed')
  if (feed) feed.innerHTML = ''
  STATE.events = []
}

// Get events by category
const getEventsByCategory = (category) => {
  return STATE.events.filter(
    e => e.category === category
  )
}

// Get events by severity
const getEventsBySeverity = (severity) => {
  return STATE.events.filter(
    e => e.severity === severity
  )
}

// Count critical events
const getCriticalCount = () => {
  return STATE.events.filter(
    e => e.severity === 'CRITICAL'
  ).length
}

// Count warnings
const getWarningCount = () => {
  return STATE.events.filter(
    e => e.severity === 'WARNING'
  ).length
}
