// ─────────────────────────────────────────
// SCORE AND RATING HELPERS
// ─────────────────────────────────────────

const getScoreColor = (score) => {
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.excellent) {
    return 'var(--color-score-excellent)'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.healthy) {
    return 'var(--color-score-good)'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.fair) {
    return 'var(--color-score-fair)'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.poor) {
    return 'var(--color-score-poor)'
  }
  return 'var(--color-score-critical)'
}

const getScoreLabel = (score) => {
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.excellent) {
    return 'Excellent'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.healthy) {
    return 'Healthy'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.fair) {
    return 'Fair'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.poor) {
    return 'Poor'
  }
  return 'Critical'
}

const getHealthClassification = (score) => {
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.excellent) {
    return 'Excellent'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.healthy) {
    return 'Healthy'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.fair) {
    return 'Fair'
  }
  if (score >= NDIC_CONFIG.HEALTH_THRESHOLDS.poor) {
    return 'Poor'
  }
  return 'Critical'
}

const getRiskColor = (level) => {
  const map = {
    'Low':      'var(--color-success)',
    'Medium':   'var(--color-warning)',
    'High':     'var(--color-danger)',
    'Critical': 'var(--color-critical)'
  }
  return map[level] || 'var(--color-text-muted)'
}

const getVitalRating = (metric, value) => {
  const thresholds =
    NDIC_CONFIG.VITALS_THRESHOLDS[metric]
  if (!thresholds) return 'Unknown'

  if (metric === 'cls') {
    if (value <= thresholds.good) return 'Good'
    if (value <= thresholds.needsWork) {
      return 'Needs Improvement'
    }
    return 'Poor'
  }

  if (value <= thresholds.good) return 'Good'
  if (value <= thresholds.needsWork) {
    return 'Needs Improvement'
  }
  return 'Poor'
}

const getVitalColor = (rating) => {
  const map = {
    'Good':              'var(--color-success)',
    'Needs Improvement': 'var(--color-warning)',
    'Poor':              'var(--color-danger)'
  }
  return map[rating] || 'var(--color-text-muted)'
}

const getDetectionBadgeColor = (value) => {
  const map = {
    'yes':   'var(--color-danger)',
    'maybe': 'var(--color-warning)',
    'no':    'var(--color-success)'
  }
  return map[value] ||
    'var(--color-text-muted)'
}

const getPassFailColor = (value) => {
  if (value === 'PASS') {
    return 'var(--color-success)'
  }
  if (value === 'FAIL') {
    return 'var(--color-danger)'
  }
  return 'var(--color-text-muted)'
}

// ─────────────────────────────────────────
// FORMATTING HELPERS
// ─────────────────────────────────────────

const formatScore = (score) => {
  if (score === null || score === undefined) {
    return '—'
  }
  return Math.round(score).toString()
}

const formatLatency = (ms) => {
  if (ms === null || ms === undefined) {
    return '—'
  }
  return `${Math.round(ms)}ms`
}

const formatBandwidth = (mbps) => {
  if (mbps === null || mbps === undefined) {
    return '—'
  }
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(1)} Gbps`
  }
  return `${mbps.toFixed(1)} Mbps`
}

const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined) {
    return '—'
  }
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

const formatTime = (ms) => {
  if (ms === null || ms === undefined) {
    return '—'
  }
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

const formatUptime = (seconds) => {
  if (!seconds) return '0s'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

const formatTimestamp = (isoString) => {
  if (!isoString) return '—'
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString(
      'en-US',
      {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
    )
  } catch {
    return '—'
  }
}

const formatDateTime = (isoString) => {
  if (!isoString) return '—'
  try {
    const date = new Date(isoString)
    return date.toLocaleString(
      'en-US',
      {
        year:   'numeric',
        month:  'short',
        day:    'numeric',
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
    )
  } catch {
    return '—'
  }
}

const formatCoordinates = (lat, lng) => {
  if (
    lat === null || lat === undefined ||
    lng === null || lng === undefined
  ) {
    return '—'
  }
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return (
    `${Math.abs(lat).toFixed(4)}°${latDir}, ` +
    `${Math.abs(lng).toFixed(4)}°${lngDir}`
  )
}

const formatIPVersion = (version) => {
  if (!version) return '—'
  return version
}

const truncateString = (str, maxLength) => {
  if (!str) return '—'
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

const capitalizeFirst = (str) => {
  if (!str) return '—'
  return str.charAt(0).toUpperCase() +
    str.slice(1)
}

// ─────────────────────────────────────────
// NETWORK HELPERS
// ─────────────────────────────────────────

const getConnectionQuality = (rtt, bandwidth) => {
  if (rtt === null && bandwidth === null) {
    return 'Unknown'
  }

  const rttScore = rtt !== null
    ? rtt < 50 ? 100
    : rtt < 100 ? 80
    : rtt < 200 ? 60
    : rtt < 400 ? 40
    : 20
    : 50

  const bwScore = bandwidth !== null
    ? bandwidth > 50 ? 100
    : bandwidth > 25 ? 80
    : bandwidth > 10 ? 60
    : bandwidth > 5 ? 40
    : 20
    : 50

  const combined = (rttScore + bwScore) / 2

  if (combined >= 80) return 'Excellent'
  if (combined >= 60) return 'Good'
  if (combined >= 40) return 'Fair'
  return 'Poor'
}

const getConnectionQualityColor = (quality) => {
  const map = {
    'Excellent': 'var(--color-score-excellent)',
    'Good':      'var(--color-score-good)',
    'Fair':      'var(--color-score-fair)',
    'Poor':      'var(--color-score-poor)'
  }
  return map[quality] ||
    'var(--color-text-muted)'
}

const computeStabilityIndex = (rttHistory) => {
  if (!rttHistory || rttHistory.length < 2) {
    return 100
  }

  const values = rttHistory.filter(
    v => v !== null && v !== undefined
  )
  if (values.length < 2) return 100

  const mean = values.reduce(
    (a, b) => a + b, 0
  ) / values.length

  const variance = values.reduce(
    (sum, val) => sum + Math.pow(val - mean, 2),
    0
  ) / values.length

  const stdDev = Math.sqrt(variance)
  const cv = mean > 0 ? stdDev / mean : 0

  const stability = Math.max(
    0,
    Math.min(100, 100 - cv * 100)
  )

  return Math.round(stability)
}

const computeJitter = (rttHistory) => {
  if (!rttHistory || rttHistory.length < 2) {
    return 0
  }

  const values = rttHistory.filter(
    v => v !== null && v !== undefined
  )

  if (values.length < 2) return 0

  let totalDiff = 0
  for (let i = 1; i < values.length; i++) {
    totalDiff += Math.abs(
      values[i] - values[i - 1]
    )
  }

  return Math.round(
    totalDiff / (values.length - 1)
  )
}

// ─────────────────────────────────────────
// DEVICE HELPERS
// ─────────────────────────────────────────

const getDeviceTier = (cpuCores, ram) => {
  const tiers = NDIC_CONFIG.DEVICE_TIERS

  if (
    cpuCores >= tiers.flagship.minCores &&
    ram >= tiers.flagship.minRam
  ) {
    return 'Flagship'
  }
  if (
    cpuCores >= tiers.high.minCores &&
    ram >= tiers.high.minRam
  ) {
    return 'High'
  }
  if (
    cpuCores >= tiers.mid.minCores &&
    ram >= tiers.mid.minRam
  ) {
    return 'Mid'
  }
  return 'Low'
}

const getGraphicsTier = (score) => {
  const tiers = NDIC_CONFIG.GRAPHICS_TIERS

  if (score >= tiers.ultra) return 'Ultra'
  if (score >= tiers.advanced) return 'Advanced'
  if (score >= tiers.standard) return 'Standard'
  return 'Basic'
}

const getPerformancePercentile = (
  loadTime
) => {
  const b = NDIC_CONFIG.PERFORMANCE_BENCHMARKS

  if (loadTime <= b.top10) return 'Top 10%'
  if (loadTime <= b.top30) return 'Top 30%'
  if (loadTime <= b.top50) return 'Top 50%'
  if (loadTime <= b.bottom30) return 'Bottom 30%'
  return 'Bottom 10%'
}

// ─────────────────────────────────────────
// DOM HELPERS
// ─────────────────────────────────────────

const el = (id) =>
  document.getElementById(id)

const els = (selector) =>
  document.querySelectorAll(selector)

const setText = (id, value) => {
  const element = el(id)
  if (element) {
    element.textContent =
      value !== null &&
      value !== undefined
        ? String(value)
        : '—'
  }
}

const setHTML = (id, html) => {
  const element = el(id)
  if (element) {
    element.innerHTML = html || ''
  }
}

const setStyle = (id, property, value) => {
  const element = el(id)
  if (element) {
    element.style[property] = value
  }
}

const addClass = (id, className) => {
  const element = el(id)
  if (element) {
    element.classList.add(className)
  }
}

const removeClass = (id, className) => {
  const element = el(id)
  if (element) {
    element.classList.remove(className)
  }
}

const setColor = (id, color) => {
  setStyle(id, 'color', color)
}

const setBooleanIndicator = (
  id,
  value,
  trueLabel,
  falseLabel
) => {
  const element = el(id)
  if (!element) return

  const isTrue = value === true ||
    value === 'yes' ||
    value === 'true'

  element.textContent = isTrue
    ? (trueLabel || 'Yes')
    : (falseLabel || 'No')

  element.style.color = isTrue
    ? 'var(--color-success)'
    : 'var(--color-danger)'
}

const showLoading = (id) => {
  const element = el(id)
  if (element) {
    element.classList.add('ndic-loading')
    element.classList.remove('ndic-loaded')
  }
}

const hideLoading = (id) => {
  const element = el(id)
  if (element) {
    element.classList.remove('ndic-loading')
    element.classList.add('ndic-loaded')
  }
}

// ─────────────────────────────────────────
// FETCH HELPERS
// ─────────────────────────────────────────

const fetchWithTimeout = async (
  url,
  options = {},
  timeoutMs = NDIC_CONFIG.LIMITS.apiTimeoutMs
) => {
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    timeoutMs
  )

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeout)
    return response
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

const callBackend = async (
  endpoint,
  options = {}
) => {
  const url = NDIC_CONFIG.BACKEND_URL +
    NDIC_CONFIG.ENDPOINTS[endpoint]

  STATE.meta.apiCallCount++

  try {
    const response = await fetchWithTimeout(
      url,
      options
    )

    if (!response.ok) {
      throw new Error(
        `Backend error: ${response.status}`
      )
    }

    const data = await response.json()
    return data

  } catch (error) {
    STATE.meta.errorCount++
    throw error
  }
}

// ─────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────

const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms))

const debounce = (fn, delayMs) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(
      () => fn.apply(this, args),
      delayMs
    )
  }
}

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max)

const normalize = (value, min, max) => {
  if (max === min) return 0
  return clamp(
    (value - min) / (max - min) * 100,
    0,
    100
  )
}

const average = (arr) => {
  const valid = arr.filter(
    v => v !== null && v !== undefined
  )
  if (!valid.length) return 0
  return valid.reduce(
    (a, b) => a + b, 0
  ) / valid.length
}

const isPrivateIP = (ip) => {
  if (!ip) return false
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/
  ]
  return privateRanges.some(
    range => range.test(ip)
  )
}

const getBrowserLanguage = () => {
  return navigator.language ||
    navigator.languages?.[0] ||
    'en'
}

const getBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat()
      .resolvedOptions().timeZone
  } catch {
    return null
  }
}

const generateUID = () => {
  return Date.now().toString(36) +
    Math.random().toString(36).substr(2, 9)
}
