// ─────────────────────────────────────────
// PANEL VISUALS (canvases 3, 5, 6 and 7)
// These four panels used to show a single word or number.
// This draws a real visual from the scan data instead:
//   3  VPN and proxy  — trust gauge + check chips
//   5  Device         — tier meter + hardware tiles
//   6  Graphics       — tier meter + GPU tiles
//   7  Security       — risk meter + safety checklist
// The old elements stay in the page (other code writes to
// them) but are hidden by CSS once the visual is shown.
// ─────────────────────────────────────────
;(function () {
  var esc = function (t) {
    return String(t === null || t === undefined ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  var has = function (v) {
    return v !== null && v !== undefined && v !== '' && v !== '—'
  }

  // score colour name (matches the design system tokens)
  var scoreVar = function (n) {
    if (n >= 80) return 'var(--color-score-excellent)'
    if (n >= 60) return 'var(--color-score-good)'
    if (n >= 40) return 'var(--color-score-fair)'
    return 'var(--color-score-poor)'
  }

  var STATE_COLOR = {
    ok: 'var(--color-score-excellent)',
    warn: 'var(--color-score-fair)',
    bad: 'var(--color-score-poor)',
    unknown: 'var(--color-text-muted)'
  }
  var STATE_ICON = { ok: '✓', warn: '!', bad: '✕', unknown: '–' }

  // A row of tier boxes with the active one highlighted
  var meter = function (levels, active, colors) {
    var idx = -1
    levels.forEach(function (l, i) {
      if (String(active || '').toLowerCase() === l.toLowerCase()) idx = i
    })
    return '<div class="ndic-pv-meter" role="img" aria-label="' +
      esc(active || 'unknown') + ' out of ' + esc(levels.join(', ')) + '">' +
      levels.map(function (l, i) {
        var on = i === idx
        var c = colors[i]
        return '<div class="ndic-pv-seg' + (on ? ' is-active' : '') +
          '" style="--seg:' + c + '">' +
          '<span class="ndic-pv-seg-name">' + esc(l) + '</span>' +
          (on ? '<span class="ndic-pv-seg-mark">▲</span>' : '') +
          '</div>'
      }).join('') + '</div>'
  }

  var tile = function (label, value, sub) {
    return '<div class="ndic-pv-tile">' +
      '<span class="ndic-pv-tile-label">' + esc(label) + '</span>' +
      '<span class="ndic-pv-tile-value">' + esc(has(value) ? value : '—') + '</span>' +
      (sub ? '<span class="ndic-pv-tile-sub">' + esc(sub) + '</span>' : '') +
      '</div>'
  }

  var chip = function (label, state, text) {
    return '<div class="ndic-pv-chip" style="--chip:' + STATE_COLOR[state] + '">' +
      '<span class="ndic-pv-chip-icon" aria-hidden="true">' + STATE_ICON[state] + '</span>' +
      '<span class="ndic-pv-chip-label">' + esc(label) + '</span>' +
      '<span class="ndic-pv-chip-text">' + esc(text) + '</span></div>'
  }

  var num = function (v, unit) {
    if (!has(v)) return null
    if (typeof v !== 'number') return String(v)
    var u = v === 1 ? unit.replace(/s$/, '') : unit
    return v + ' ' + u
  }

  // ─── PANEL 3 ─────────────────────────────
  var detection = function (v) {
    v = String(v || '').toLowerCase()
    if (v === 'no') return ['ok', 'none found']
    if (v === 'yes') return ['bad', 'detected']
    if (v === 'maybe') return ['warn', 'possible']
    return ['unknown', 'not checked']
  }
  var matchState = function (v) {
    v = String(v || '').toUpperCase()
    if (v === 'PASS') return ['ok', 'matches']
    if (v === 'FAIL') return ['warn', 'does not match']
    return ['unknown', 'not checked']
  }

  var panel3 = function (S) {
    var v = S.vpn || {}
    var score = typeof v.trustScore === 'number' ? v.trustScore : null
    var shown = score === null ? 0 : Math.max(0, Math.min(100, score))
    var color = score === null ? 'var(--color-text-muted)' : scoreVar(score)
    var d = function (k) { return detection(v[k]) }
    var m = function (k) { return matchState(v[k]) }
    var chips = [
      ['VPN', d('vpnDetected')], ['Proxy', d('proxyDetected')],
      ['Tor exit node', d('torDetected')], ['Datacenter', d('datacenterDetected')],
      ['Time zone', m('timezoneMatch')], ['Language', m('languageMatch')],
      ['WebRTC address', m('webrtcMatch')]
    ]
    return '<div class="ndic-pv-gauge">' +
      '<svg viewBox="0 0 200 118" role="img" aria-label="Trust score ' +
      (score === null ? 'unknown' : score + ' out of 100') + '">' +
      '<path d="M20 100 A80 80 0 0 1 180 100" pathLength="100" class="ndic-pv-gauge-track"/>' +
      '<path d="M20 100 A80 80 0 0 1 180 100" pathLength="100" class="ndic-pv-gauge-fill" ' +
      'style="stroke:' + color + ';stroke-dasharray:' + shown + ' 100"/>' +
      '<text x="100" y="86" text-anchor="middle" class="ndic-pv-gauge-num" ' +
      'style="fill:' + color + '">' + (score === null ? '—' : score) + '</text>' +
      '<text x="100" y="108" text-anchor="middle" class="ndic-pv-gauge-cap">TRUST SCORE OUT OF 100</text>' +
      '<text x="20" y="116" text-anchor="middle" class="ndic-pv-gauge-end">0</text>' +
      '<text x="180" y="116" text-anchor="middle" class="ndic-pv-gauge-end">100</text>' +
      '</svg></div>' +
      '<div class="ndic-pv-chips">' + chips.map(function (c) {
        return chip(c[0], c[1][0], c[1][1])
      }).join('') + '</div>'
  }

  // ─── PANEL 5 ─────────────────────────────
  var panel5 = function (S) {
    var d = S.device || {}
    var screen = has(d.screenWidth) ? d.screenWidth + ' × ' + d.screenHeight : null
    var touch = String(d.touchSupport || '').toLowerCase()
    return meter(['Low', 'Mid', 'High', 'Flagship'], d.capabilityTier, [
      'var(--color-score-poor)', 'var(--color-score-fair)',
      'var(--color-score-good)', 'var(--color-score-excellent)']) +
      '<div class="ndic-pv-tiles">' +
      tile('Processor', num(d.cpuCores, 'cores'), 'CPU threads available') +
      tile('Memory', num(d.ram, 'GB'), 'estimate from the browser') +
      tile('Screen', screen, has(d.pixelRatio) ? 'pixel ratio ' + d.pixelRatio + '×' : '') +
      tile('Touch', touch === 'yes' || touch === 'true' ? 'Yes' : (touch ? 'No' : null),
        has(d.maxTouchPoints) ? d.maxTouchPoints + (Number(d.maxTouchPoints) === 1 ? ' touch point' : ' touch points') : '') +
      '</div>'
  }

  // ─── PANEL 6 ─────────────────────────────
  var panel6 = function (S) {
    var g = S.graphics || {}
    var renderer = String(g.gpuRenderer || '')
    if (renderer.length > 26) renderer = renderer.slice(0, 25) + '…'
    return meter(['Basic', 'Standard', 'Advanced', 'Ultra'], g.graphicsTier, [
      'var(--color-score-poor)', 'var(--color-score-fair)',
      'var(--color-score-good)', 'var(--color-score-excellent)']) +
      '<div class="ndic-pv-tiles">' +
      tile('Graphics chip', g.gpuVendor, renderer) +
      tile('WebGL', g.webglVersion, g.webglSupportLevel ? String(g.webglSupportLevel).slice(0, 28) : '') +
      tile('Acceleration', g.hardwareAcceleration, 'GPU does the drawing') +
      tile('Largest texture', num(g.maxTextureSize, 'px'), 'bigger = more detail') +
      '</div>'
  }

  // ─── PANEL 7 ─────────────────────────────
  var panel7 = function (S) {
    var s = S.security || {}
    var yes = function (v, good) { return String(v) === good }
    var items = [
      ['HTTPS connection', yes(s.httpsStatus, 'Secure') ? ['ok', 'secure'] : (has(s.httpsStatus) ? ['bad', 'not secure'] : ['unknown', 'unknown'])],
      ['Secure context', s.secureContext === 'Yes' ? ['ok', 'yes'] : (has(s.secureContext) ? ['warn', 'no'] : ['unknown', 'unknown'])],
      ['Mixed content', /none/i.test(String(s.mixedContent)) ? ['ok', 'none found'] : (has(s.mixedContent) && !/n\/a/i.test(String(s.mixedContent)) ? ['warn', 'found'] : ['unknown', 'not applicable'])],
      ['WebRTC leak', s.webrtcExposure === 'Safe' ? ['ok', 'no leak'] : (s.webrtcExposure === 'Exposed' ? ['bad', 'exposed'] : ['unknown', 'unknown'])],
      ['Local network address', /not exposed/i.test(String(s.localIp)) ? ['ok', 'hidden'] : (has(s.localIp) ? ['bad', 'visible'] : ['unknown', 'unknown'])],
      ['Third-party cookies', /enabled/i.test(String(s.thirdPartyCookies)) ? ['warn', 'likely allowed'] : (has(s.thirdPartyCookies) ? ['ok', 'blocked'] : ['unknown', 'unknown'])],
      ['Do Not Track', /not set/i.test(String(s.doNotTrack)) ? ['warn', 'not set'] : (has(s.doNotTrack) ? ['ok', 'on'] : ['unknown', 'unknown'])],
      ['Content security policy', /not detect|none/i.test(String(s.cspPresence)) ? ['unknown', 'not detectable'] : (has(s.cspPresence) ? ['ok', 'present'] : ['unknown', 'unknown'])]
    ]
    return meter(['Low', 'Medium', 'High', 'Critical'], s.riskLevel, [
      'var(--color-score-excellent)', 'var(--color-score-fair)',
      'var(--color-score-poor)', 'var(--color-score-critical, var(--color-score-poor))']) +
      '<p class="ndic-pv-note">Risk level: how likely your setup is to leak or expose information.</p>' +
      '<div class="ndic-pv-chips">' + items.map(function (i) {
        return chip(i[0], i[1][0], i[1][1])
      }).join('') + '</div>'
  }

  var BUILDERS = { 3: panel3, 5: panel5, 6: panel6, 7: panel7 }
  var KEYS = { 3: 'vpn', 5: 'device', 6: 'graphics', 7: 'security' }
  var last = {}

  var viz = function (n) {
    var anchor = document.getElementById({
      3: 'c3-trust-score', 5: 'c5-capability-tier',
      6: 'c6-graphics-tier', 7: 'c7-risk-level'
    }[n])
    return anchor ? anchor.closest('.ndic-canvas-viz') : null
  }

  var update = function () {
    if (typeof STATE === 'undefined') return
    ;[3, 5, 6, 7].forEach(function (n) {
      var host = viz(n)
      if (!host) return
      var sig
      try { sig = JSON.stringify(STATE[KEYS[n]]) } catch (e) { return }
      if (last[n] === sig && host.querySelector('.ndic-pv')) return
      last[n] = sig
      var box = host.querySelector('.ndic-pv')
      if (!box) {
        box = document.createElement('div')
        box.className = 'ndic-pv'
        host.appendChild(box)
        host.setAttribute('data-pv', '1')
      }
      try { box.innerHTML = BUILDERS[n](STATE) } catch (e) { /* keep old */ }
    })
  }

  var start = function () {
    update()
    setInterval(update, 1000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
