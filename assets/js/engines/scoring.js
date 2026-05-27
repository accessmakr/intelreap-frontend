// ─────────────────────────────────────────
// SCORING ENGINE
// Powers Canvas 11 — Global Intelligence
// Scoreboard
// Computes all 9 sub-scores and the
// global environment score from STATE data
// ─────────────────────────────────────────

const ScoringEngine = (() => {

  // ───────────────────────────────────────
  // NETWORK SCORE
  // Based on Canvas 1 data
  // ASN tier, health and route quality
  // ───────────────────────────────────────

  const computeNetworkScore = () => {
    const n = STATE.network

    if (!n.networkHealthScore &&
        !n.networkTierNumber) {
      return 0
    }

    let score = 0

    // Network health score (50 points)
    if (n.networkHealthScore) {
      score += Math.round(
        n.networkHealthScore * 0.5
      )
    }

    // Network tier (30 points)
    const tierScores = {
      1: 30,
      2: 20,
      3: 10
    }
    score += tierScores[n.networkTierNumber] || 5

    // BGP status (10 points)
    if (n.bgpRouteStatus === 'active') {
      score += 10
    }

    // Route origin (10 points)
    const routeScores = {
      'Direct ISP':    10,
      'Mobile Network': 8,
      'CDN Edge':       7,
      'Cloud Hosted':   5,
      'Satellite':      4
    }
    score += routeScores[n.routeOrigin] || 5

    return Math.min(100, Math.max(0, score))
  }

  // ───────────────────────────────────────
  // IDENTITY SCORE
  // Based on Canvas 2 data
  // Data completeness and IP version
  // ───────────────────────────────────────

  const computeIdentityScore = () => {
    const i = STATE.identity

    if (!i.ip) return 0

    let score = 40 // Base for having IP

    // Data completeness
    const fields = [
      'isp', 'country', 'city',
      'timezone', 'latitude', 'longitude',
      'region', 'countryCode'
    ]

    const populated = fields.filter(
      f => i[f] !== null &&
           i[f] !== undefined &&
           i[f] !== ''
    ).length

    score += Math.round(
      (populated / fields.length) * 40
    )

    // IPv6 support (20 points)
    if (i.ipVersion === 'IPv6') {
      score += 20
    } else if (i.ipVersion === 'IPv4') {
      score += 10
    }

    return Math.min(100, Math.max(0, score))
  }

  // ───────────────────────────────────────
  // PRIVACY SCORE
  // Based on Canvas 3 data
  // Trust score and route classification
  // ───────────────────────────────────────

  const computePrivacyScore = () => {
    const v = STATE.vpn

    if (v.trustScore === null) return 50

    let score = 0

    // Trust score is primary input (60 points)
    score += Math.round(v.trustScore * 0.6)

    // Route classification (20 points)
    const routeScores = {
      'Clean':     20,
      'Suspect':   10,
      'High Risk':  0
    }
    score += routeScores[
      v.routeClassification
    ] ?? 10

    // Timezone match (10 points)
    if (v.timezoneMatch === 'PASS') {
      score += 10
    } else if (v.timezoneMatch === 'FAIL') {
      score -= 5
    }

    // Language match (10 points)
    if (v.languageMatch === 'PASS') {
      score += 10
    } else if (v.languageMatch === 'FAIL') {
      score -= 5
    }

    // TOR detection reduces privacy score
    // because it indicates high-risk routing
    if (v.torDetected === 'yes') {
      score -= 20
    }

    return Math.min(100, Math.max(0, score))
  }

  // ───────────────────────────────────────
  // DEVICE SCORE
  // Based on Canvas 5 data
  // CPU, RAM, device tier
  // ───────────────────────────────────────

  const computeDeviceScore = () => {
    const d = STATE.device

    if (!d.cpuCores && !d.ram) return 0

    let score = 0

    // CPU cores (35 points)
    const cpuScores = {
      16: 35, 12: 32, 10: 30,
      8: 28, 6: 22, 4: 15,
      2: 8,  1: 4
    }
    const cpuKey = d.cpuCores || 0
    score += cpuScores[cpuKey] ||
      (cpuKey > 16 ? 35 : 4)

    // RAM (35 points)
    const ramScores = {
      8: 35, 4: 28, 2: 18,
      1: 10, 0.5: 5, 0.25: 2
    }
    score += ramScores[d.ram] || 15

    // Capability tier (20 points)
    const tierScores = {
      'Flagship': 20,
      'High':     15,
      'Mid':      10,
      'Low':       5
    }
    score += tierScores[d.capabilityTier] || 5

    // Pixel ratio bonus (10 points)
    if (d.pixelRatio >= 3) score += 10
    else if (d.pixelRatio >= 2) score += 7
    else if (d.pixelRatio >= 1.5) score += 4
    else score += 2

    return Math.min(100, Math.max(0, score))
  }

  // ───────────────────────────────────────
  // GRAPHICS SCORE
  // Based on Canvas 6 data
  // Uses pre-computed renderingScore
  // ───────────────────────────────────────

  const computeGraphicsScore = () => {
    const g = STATE.graphics

    if (g.renderingScore !== null &&
        g.renderingScore !== undefined) {
      return Math.min(100, Math.max(
        0, g.renderingScore
      ))
    }

    // Fallback computation
    let score = 0

    if (g.webglVersionNumber === 2) score += 40
    else if (g.webglVersionNumber === 1) {
      score += 20
    }

    if (g.hardwareAcceleration === 'Enabled') {
      score += 30
    }

    if (g.shaderPrecision === 'High') {
      score += 20
    } else if (
      g.shaderPrecision === 'Medium'
    ) {
      score += 10
    }

    if (g.webgpuSupported) score += 10

    return Math.min(100, Math.max(0, score))
  }

  // ───────────────────────────────────────
  // SECURITY SCORE
  // Based on Canvas 7 data
  // Uses pre-computed securityScore
  // ───────────────────────────────────────

  const computeSecurityScore = () => {
    const s = STATE.security

    if (s.securityScore !== null &&
        s.securityScore !== undefined) {
      return Math.min(100, Math.max(
        0, s.securityScore
      ))
    }

    return 0
  }

  // ───────────────────────────────────────
  // CAPABILITY SCORE
  // Based on Canvas 8 data
  // Uses pre-computed capabilityScore
  // ───────────────────────────────────────

  const computeCapabilityScore = () => {
    const c = STATE.capabilities

    if (c.capabilityScore !== null &&
        c.capabilityScore !== undefined) {
      return Math.min(100, Math.max(
        0, c.capabilityScore
      ))
    }

    return 0
  }

  // ───────────────────────────────────────
  // PERFORMANCE SCORE
  // Based on Canvas 9 data
  // Uses pre-computed performanceScore
  // ───────────────────────────────────────

  const computePerformanceScore = () => {
    const p = STATE.performance

    if (p.performanceScore !== null &&
        p.performanceScore !== undefined) {
      return Math.min(100, Math.max(
        0, p.performanceScore
      ))
    }

    // Fallback from raw timing
    if (!p.pageLoadTime) return 0

    const b = NDIC_CONFIG.PERFORMANCE_BENCHMARKS

    if (p.pageLoadTime <= b.top10) return 95
    if (p.pageLoadTime <= b.top30) return 80
    if (p.pageLoadTime <= b.top50) return 60
    if (p.pageLoadTime <= b.bottom30) return 35
    return 15
  }

  // ───────────────────────────────────────
  // SPEED SCORE
  // Based on Canvas 10 data
  // Uses pre-computed speedScore
  // ───────────────────────────────────────

  const computeSpeedScore = () => {
    const s = STATE.speed

    if (s.speedScore !== null &&
        s.speedScore !== undefined) {
      return Math.min(100, Math.max(
        0, s.speedScore
      ))
    }

    // Fallback from LCP alone
    if (s.lcp !== null) {
      const t = NDIC_CONFIG.VITALS_THRESHOLDS.lcp
      if (s.lcp <= t.good) return 90
      if (s.lcp <= t.needsWork) return 60
      return 30
    }

    return 0
  }

  // ───────────────────────────────────────
  // GLOBAL SCORE
  // Weighted average of all 9 sub-scores
  // ───────────────────────────────────────

  const computeGlobalScore = (subScores) => {
    const weights = NDIC_CONFIG.SCORING_WEIGHTS

    let totalWeight = 0
    let weightedSum = 0

    const scoreMap = {
      network:     subScores.networkScore,
      identity:    subScores.identityScore,
      privacy:     subScores.privacyScore,
      device:      subScores.deviceScore,
      graphics:    subScores.graphicsScore,
      security:    subScores.securityScore,
      capability:  subScores.capabilityScore,
      performance: subScores.performanceScore,
      speed:       subScores.speedScore
    }

    for (const [key, weight] of
      Object.entries(weights)
    ) {
      const score = scoreMap[key]
      if (
        score !== null &&
        score !== undefined &&
        score > 0
      ) {
        weightedSum += score * weight
        totalWeight += weight
      }
    }

    if (totalWeight === 0) return 0

    return Math.round(
      weightedSum / totalWeight
    )
  }

  // ───────────────────────────────────────
  // STRONGEST AND WEAKEST AREA
  // ───────────────────────────────────────

  const computeExtremes = (subScores) => {
    const areas = {
      'Network Infrastructure':
        subScores.networkScore,
      'Network Identity':
        subScores.identityScore,
      'Privacy and Routing':
        subScores.privacyScore,
      'Device Capability':
        subScores.deviceScore,
      'Graphics Engine':
        subScores.graphicsScore,
      'Security Posture':
        subScores.securityScore,
      'Browser Capabilities':
        subScores.capabilityScore,
      'Page Performance':
        subScores.performanceScore,
      'Rendering Speed':
        subScores.speedScore
    }

    // Filter out zeros and nulls
    const valid = Object.entries(areas)
      .filter(([, v]) =>
        v !== null &&
        v !== undefined &&
        v > 0
      )

    if (valid.length === 0) {
      return {
        strongestArea: 'Unknown',
        weakestArea: 'Unknown',
        improvementPriority: 'Unknown'
      }
    }

    valid.sort(([, a], [, b]) => b - a)

    const strongest = valid[0][0]
    const weakest = valid[valid.length - 1][0]

    // Improvement priority is the weakest
    // area with highest scoring weight
    const weightedWeak = valid
      .slice(-3)
      .map(([name]) => {
        const weightKeys = {
          'Network Infrastructure': 'network',
          'Network Identity':       'identity',
          'Privacy and Routing':    'privacy',
          'Device Capability':      'device',
          'Graphics Engine':        'graphics',
          'Security Posture':       'security',
          'Browser Capabilities':   'capability',
          'Page Performance':       'performance',
          'Rendering Speed':        'speed'
        }
        const wKey = weightKeys[name]
        const weight =
          NDIC_CONFIG.SCORING_WEIGHTS[wKey] || 0
        return { name, weight }
      })
      .sort((a, b) => b.weight - a.weight)

    const improvementPriority =
      weightedWeak[0]?.name || weakest

    return {
      strongestArea: strongest,
      weakestArea: weakest,
      improvementPriority: improvementPriority
    }
  }

  // ───────────────────────────────────────
  // HEALTH CLASSIFICATION
  // ───────────────────────────────────────

  const classifyHealth = (globalScore) => {
    return getHealthClassification(globalScore)
  }

  // ───────────────────────────────────────
  // UPDATE HEADER SCORE PILL
  // Shows global score in page header
  // ───────────────────────────────────────

  const updateHeaderScore = (
    score,
    health
  ) => {
    const scorePill = el('header-score-pill')
    if (!scorePill) return

    scorePill.textContent =
      `${score}/100 — ${health}`
    scorePill.style.color =
      getScoreColor(score)
  }

  // ───────────────────────────────────────
  // MAIN COMPUTE FUNCTION
  // Called after each engine completes
  // and on every UI refresh interval
  // ───────────────────────────────────────

  const compute = () => {
    // Compute all sub-scores
    const networkScore = computeNetworkScore()
    const identityScore = computeIdentityScore()
    const privacyScore = computePrivacyScore()
    const deviceScore = computeDeviceScore()
    const graphicsScore = computeGraphicsScore()
    const securityScore = computeSecurityScore()
    const capabilityScore =
      computeCapabilityScore()
    const performanceScore =
      computePerformanceScore()
    const speedScore = computeSpeedScore()

    const subScores = {
      networkScore,
      identityScore,
      privacyScore,
      deviceScore,
      graphicsScore,
      securityScore,
      capabilityScore,
      performanceScore,
      speedScore
    }

    // Compute global score
    const globalScore =
      computeGlobalScore(subScores)

    // Health classification
    const healthClassification =
      classifyHealth(globalScore)

    // Strongest and weakest areas
    const extremes = computeExtremes(subScores)

    const allScores = {
      ...subScores,
      globalScore,
      healthClassification,
      strongestArea: extremes.strongestArea,
      weakestArea: extremes.weakestArea,
      improvementPriority:
        extremes.improvementPriority
    }

    // Update STATE.scores
    updateScores(allScores)

    // Mark engine complete
    markEngineComplete('scoring')

    // Update header score pill
    updateHeaderScore(
      globalScore,
      healthClassification
    )

    // Log global score
    logGlobalScore(
      globalScore,
      healthClassification
    )

    logScore(
      'INFO',
      `Scores — ` +
      `Net:${networkScore} ` +
      `Priv:${privacyScore} ` +
      `Dev:${deviceScore} ` +
      `Sec:${securityScore} ` +
      `Cap:${capabilityScore} ` +
      `Perf:${performanceScore} ` +
      `Speed:${speedScore} ` +
      `→ Global:${globalScore}`
    )

    return allScores
  }

  return {
    compute,
    computeNetworkScore,
    computeIdentityScore,
    computePrivacyScore,
    computeDeviceScore,
    computeGraphicsScore,
    computeSecurityScore,
    computeCapabilityScore,
    computePerformanceScore,
    computeSpeedScore,
    computeGlobalScore,
    computeExtremes,
    classifyHealth
  }

})()
