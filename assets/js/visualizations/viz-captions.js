// ─────────────────────────────────────────
// VIZ CAPTIONS
// A short "what you are looking at" note under the main
// visual of every panel, so each diagram is understandable
// without knowing the technical terms.
// ─────────────────────────────────────────
;(function () {
  var CAPTIONS = {
    "1": "What you are looking at: the path from your device to the internet. Each circle is one hop: your device, your internet provider, the network (ASN) that owns your address, an upstream provider, and the wider internet. The word on each line says how two hops connect (routing, transit or peering). The table below gives the exact ASN, owner, tier and registry.",
    "2": "What you are looking at: the place where location databases put your public IP address. The pin and circle show the approximate area. City-level IP location is only an estimate, and mobile networks often appear in a nearby city. The table gives the exact address, provider and coordinates.",
    "3": "What you are looking at: a trust score from 0 to 100. A higher score means your connection looks like an ordinary visitor. Points are lost when VPN, proxy, Tor or datacenter signals appear, or when your IP location does not match your device time zone and language. The table shows each check.",
    "4": "What you are looking at: your connection live. The top chart is latency (the time for a signal to go there and back); lower is better. The dial is your estimated download speed. The area chart is stability; a flat, high area means a steady connection and dips mean drops.",
    "5": "What you are looking at: a device tier (LOW, MID or HIGH) estimated from your processor cores, memory and screen. It is a rough summary of how powerful your device is. The table lists the operating system, browser and hardware details behind it.",
    "6": "What you are looking at: a graphics tier based on your GPU, WebGL support and shader precision. ADVANCED means your device can run demanding 3D and video features. The table lists the GPU vendor, renderer and limits.",
    "7": "What you are looking at: your security risk level (LOW, MEDIUM or HIGH). It is based on HTTPS, whether WebRTC leaks your local address, stored permissions and cookie settings. The table shows each check and what it found.",
    "8": "What you are looking at: a grid of browser features, grouped by category. Coloured tiles are supported by your browser; grey tiles are not. The score is the share of supported features.",
    "9": "What you are looking at: where the time went while this page loaded. Each bar is one stage (DNS lookup, connection, secure handshake, waiting for the first byte, response, page processing and resource loading), measured in milliseconds. Shorter bars are better. The dial is your responsiveness score.",
    "10": "What you are looking at: browser speed measures called Core Web Vitals (LCP, FCP, CLS, INP, TTFB, FID). Coloured bars are your measured values and grey bars are the recommended targets; shorter than the grey bar is good. The four dials score JavaScript, page updates, canvas drawing and memory access; a fuller arc is better.",
    "11": "What you are looking at: your overall score. The large doughnut is the combined score. In the rings, each ring is one of nine areas (network, identity, privacy, device, graphics, security, capability, performance, speed), and a fuller ring means a higher score. The nine small dials show the same scores one by one.",
    "12": "What you are looking at: a log of everything the scan did, newest first. Each line is one event with the time, a category (such as SYSTEM, SCORE or AI) and a short message. The table counts events, warnings and errors and shows whether the backend is healthy.",
    "13": "What you are looking at: where your IP address places you on a map. If you allow location access, a second pin shows your GPS position and a dashed line shows the distance between them. The bar and the table list the fingerprint signals that websites could use to recognise your device."
}

  var add = function () {
    var blocks = document.querySelectorAll('.ndic-canvas-viz')
    if (!blocks.length) return
    var eyebrow = document.querySelector('.ndic-deepdive-eyebrow')
    var single = null
    if (eyebrow) {
      var m = /Canvas\s+(\d+)/i.exec(eyebrow.textContent || '')
      if (m) single = parseInt(m[1], 10)
    }
    blocks.forEach(function (block, i) {
      if (block.nextElementSibling &&
          block.nextElementSibling.classList.contains('ndic-viz-caption')) return
      var n = blocks.length === 1 && single ? single : i + 1
      var text = CAPTIONS[n]
      if (!text) return
      var p = document.createElement('p')
      p.className = 'ndic-viz-caption'
      p.textContent = text
      block.parentNode.insertBefore(p, block.nextSibling)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', add)
  } else {
    add()
  }
})()
