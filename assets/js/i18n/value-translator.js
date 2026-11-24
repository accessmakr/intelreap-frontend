/*!
 * IntelReap value translator
 * Translates scan values and labels that other scripts insert into the page
 * as plain English text (Yes, Good, Supported, Clean, "Deep dive into ...").
 * It only changes what is displayed. Script logic and data are untouched.
 * The English -> key table below is generated from the English strings file.
 */
(function () {
  'use strict'

  var MAP = {
    "acceleration": "labels.acceleration",
    "advanced": "labels.advanced",
    "ai & compute": "canvas8.categories.ai_compute",
    "basic": "labels.basic",
    "clean": "canvas3.values.route_clean",
    "communication": "canvas8.categories.communication",
    "content security policy": "canvas7.params.csp_presence",
    "critical": "canvas11.health.critical",
    "datacenter": "labels.datacenter",
    "deep dive into your browser capability analysis": "canvas8.deep_dive",
    "deep dive into your device analysis": "canvas5.deep_dive",
    "deep dive into your global score analysis": "canvas11.deep_dive",
    "deep dive into your graphics engine analysis": "canvas6.deep_dive",
    "deep dive into your live intelligence feed": "canvas12.deep_dive",
    "deep dive into your live network analysis": "canvas4.deep_dive",
    "deep dive into your network identity analysis": "canvas2.deep_dive",
    "deep dive into your network infrastructure analysis": "canvas1.deep_dive",
    "deep dive into your performance analysis": "canvas9.deep_dive",
    "deep dive into your rendering speed analysis": "canvas10.deep_dive",
    "deep dive into your security and privacy analysis": "canvas7.deep_dive",
    "deep dive into your vpn and routing analysis": "canvas3.deep_dive",
    "degraded": "canvas12.values.degraded",
    "do not track": "canvas7.params.do_not_track",
    "does not match": "labels.does_not_match",
    "excellent": "canvas11.health.excellent",
    "exposed": "values.exposed",
    "fair": "canvas11.health.fair",
    "flagship": "labels.flagship",
    "global": "labels.global",
    "global score": "canvas11.params.global_score",
    "good": "canvas10.ratings.good",
    "good limit": "labels.good_limit",
    "graphics chip": "labels.graphics_chip",
    "healthy": "canvas11.health.healthy",
    "high": "labels.high",
    "high risk": "canvas3.values.route_high_risk",
    "https connection": "labels.https_connection",
    "internet": "labels.internet",
    "internet service provider": "canvas2.params.isp",
    "language": "labels.language",
    "largest texture": "labels.largest_texture",
    "latency (ms)": "labels.latency_ms",
    "latency over time (ms): lower is better": "labels.latency_over_time_ms_lower_is_better",
    "likely allowed": "labels.likely_allowed",
    "local network address": "labels.local_network_address",
    "low": "labels.low",
    "mbps download": "labels.mbps_download",
    "medium": "labels.medium",
    "memory": "labels.memory",
    "mid": "labels.mid",
    "mixed content": "canvas7.params.mixed_content",
    "needs improvement": "canvas10.ratings.needs_improvement",
    "network (asn)": "labels.network_asn",
    "no": "canvas3.values.vpn_no",
    "no leak": "labels.no_leak",
    "none detected": "canvas12.values.none_detected",
    "none found": "labels.none_found",
    "not applicable": "labels.not_applicable",
    "not checked": "labels.not_checked",
    "not detectable": "labels.not_detectable",
    "not secure": "values.not_secure",
    "not set": "labels.not_set",
    "not supported": "canvas8.values.not_supported",
    "offline": "canvas12.values.offline",
    "online": "canvas12.values.online",
    "poor": "canvas10.ratings.poor",
    "processor": "labels.processor",
    "proxy": "labels.proxy",
    "rendering": "canvas8.categories.rendering",
    "resource fetch": "labels.resource_fetch",
    "response": "labels.response",
    "responsiveness / 100": "labels.responsiveness_100",
    "risk level": "canvas7.params.risk_level",
    "safe": "values.safe",
    "screen": "labels.screen",
    "secure": "values.secure",
    "secure context": "canvas7.params.secure_context",
    "stability over time: higher and steadier is better": "labels.stability_over_time_higher_and_steadier_is_better",
    "standard": "labels.standard",
    "storage": "canvas8.categories.storage",
    "supported": "canvas8.values.supported",
    "suspect": "canvas3.values.route_suspect",
    "system": "canvas8.categories.system",
    "tcp connect": "labels.tcp_connect",
    "third-party cookies": "canvas7.params.third_party_cookies",
    "time to first byte": "canvas10.vitals.ttfb",
    "time zone": "labels.time_zone",
    "tor exit node": "labels.tor_exit_node",
    "touch": "labels.touch",
    "ultra": "labels.ultra",
    "unknown": "canvas10.ratings.unknown",
    "upstream": "labels.upstream",
    "upstream provider": "labels.upstream_provider",
    "vpn": "labels.vpn",
    "webgl": "labels.webgl",
    "webrtc address": "labels.webrtc_address",
    "webrtc leak": "labels.webrtc_leak",
    "where the page load time went (ms): shorter is better": "labels.where_the_page_load_time_went_ms_shorter_is_better",
    "yes": "canvas3.values.vpn_yes",
    "your device": "labels.your_device",
    "your isp": "labels.your_isp",
    "your result": "labels.your_result",
    "your result against the \"good\" limit (grey): lower than grey is good": "labels.your_result_against_the_good_limit_grey_lower_than_grey_is_good"
  }

  var SKIP_TAGS = {
    SCRIPT: 1, STYLE: 1, TEXTAREA: 1, OPTION: 1, TITLE: 1,
    NOSCRIPT: 1, CODE: 1, PRE: 1, INPUT: 1
  }
  var shown = new Map() // text node -> { en, tr }
  var pending = new Set()
  var scheduled = false

  function lang () {
    try { return I18nEngine.getLang() } catch (e) { return 'en' }
  }

  function lookup (en) {
    var key = MAP[en.toLowerCase()]
    if (!key || lang() === 'en') return null
    try {
      var v = I18nEngine.t(key, null)
      return v && v !== key && v !== en ? v : null
    } catch (e) {
      return null
    }
  }

  function managed (node) {
    var el = node.parentElement
    if (!el || SKIP_TAGS[el.tagName]) return true
    return !!el.closest('[data-i18n],[data-i18n-html]')
  }

  function process (node) {
    if (!node || node.nodeType !== 3 || managed(node)) return
    var text = node.nodeValue
    var trimmed = text.trim()
    if (!trimmed || trimmed.length > 140) return
    var rec = shown.get(node)
    if (rec && trimmed === rec.tr) return // our own write
    var tr = lookup(trimmed)
    if (tr) {
      shown.set(node, { en: trimmed, tr: tr })
      node.nodeValue = text.replace(trimmed, tr)
    } else if (rec) {
      shown.delete(node)
    }
  }

  function walk (root) {
    if (!root) return
    if (root.nodeType === 3) { process(root); return }
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    var n
    while ((n = w.nextNode())) process(n)
  }

  function relang () {
    var english = lang() === 'en'
    shown.forEach(function (rec, node) {
      if (!node.isConnected) { shown.delete(node); return }
      var next = english ? rec.en : lookup(rec.en)
      if (next && node.nodeValue.indexOf(rec.tr) !== -1) {
        node.nodeValue = node.nodeValue.replace(rec.tr, next)
        rec.tr = next
      }
    })
    walk(document.body)
  }

  function flush () {
    scheduled = false
    pending.forEach(process)
    pending.clear()
  }

  function queue (node) {
    pending.add(node)
    if (!scheduled) {
      scheduled = true
      window.requestAnimationFrame(flush)
    }
  }

  function start () {
    walk(document.body)
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i]
        if (m.type === 'characterData') queue(m.target)
        else {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var a = m.addedNodes[j]
            if (a.nodeType === 3) queue(a)
            else if (a.nodeType === 1) walk(a)
          }
        }
      }
    }).observe(document.body, {
      childList: true, subtree: true, characterData: true
    })
    window.addEventListener('ndic-i18n-ready', relang)
    window.addEventListener('ndic-language-changed', relang)
    setTimeout(relang, 1500)
    setTimeout(relang, 4000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
