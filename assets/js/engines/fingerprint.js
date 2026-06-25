// ─────────────────────────────────────────
// FINGERPRINT ENGINE
// Powers Canvas 13 — Advanced Fingerprint
// and Leak Detection
// Collects: audio/canvas/font/ClientRects
// fingerprints, bot/automation signals,
// incognito detection, ad blocker detection,
// HTTP header echo, IPv6 leak test,
// geolocation GPS, CSS media query probe,
// extension detection, speech synthesis
// voices, media device counts, and a math
// engine fingerprint.
// ─────────────────────────────────────────

const FingerprintEngine = (() => {

  // ───────────────────────────────────────
  // SHARED HASH HELPER
  // Uses Web Crypto SHA-256, available in
  // every modern browser over HTTPS
  // ───────────────────────────────────────

  const sha256Hex = async (str) => {
    try {
      const buf = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(str)
      )
      return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    } catch {
      return null
    }
  }

  // ───────────────────────────────────────
  // 1. AUDIO FINGERPRINT
  // Renders a short triangle wave through
  // a heavily-compressed signal chain in an
  // offline (silent) audio context. Hardware
  // and driver differences produce subtly
  // different floating-point output, which
  // we hash into a stable fingerprint.
  // ───────────────────────────────────────

  const collectAudioFingerprint = async () => {
    try {
      if (typeof OfflineAudioContext === 'undefined') {
        return { audioSupported: false }
      }

      const ctx = new OfflineAudioContext(1, 44100, 44100)
      const osc = ctx.createOscillator()
      const comp = ctx.createDynamicsCompressor()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(10000, ctx.currentTime)

      comp.threshold.setValueAtTime(-50, ctx.currentTime)
      comp.knee.setValueAtTime(40, ctx.currentTime)
      comp.ratio.setValueAtTime(12, ctx.currentTime)
      comp.attack.setValueAtTime(0, ctx.currentTime)
      comp.release.setValueAtTime(0.25, ctx.currentTime)

      osc.connect(comp)
      comp.connect(ctx.destination)
      osc.start(0)

      const buffer = await ctx.startRendering()
      const data = buffer.getChannelData(0)

      let sum = 0
      for (let i = 4500; i < 5000; i++) {
        sum += Math.abs(data[i])
      }

      const hash = await sha256Hex(sum.toString())

      // Heuristic only — we have no population
      // database to measure true rarity against,
      // so this estimates variance from the raw
      // precision of the floating-point output
      // rather than a verified uniqueness rank.
      const decimalPlaces =
        (sum.toString().split('.')[1] || '').length
      const entropyScore =
        decimalPlaces >= 14 ? 'High' :
        decimalPlaces >= 8  ? 'Medium' :
        'Low'

      return {
        audioSupported: true,
        audioHash: hash,
        audioSampleRate: ctx.sampleRate,
        audioEntropyScore: entropyScore,
        audioHardwareVariance: decimalPlaces >= 8
      }

    } catch (error) {
      return {
        audioSupported: false,
        audioHash: null
      }
    }
  }

  // ───────────────────────────────────────
  // 2. CANVAS FINGERPRINT
  // Renders text and shapes to a hidden
  // 2D canvas and hashes the resulting
  // pixel data URL. Anti-aliasing and font
  // rendering differ subtly across GPUs
  // and operating systems.
  // ───────────────────────────────────────

  const collectCanvasFingerprint = async () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 220
      canvas.height = 30
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        return { canvasSupported: false }
      }

      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(0, 0, 100, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('IntelReap fingerprint test', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('IntelReap fingerprint test', 4, 17)

      const dataURL = canvas.toDataURL()
      const hash = await sha256Hex(dataURL)

      return {
        canvasSupported: true,
        canvasHash: hash,
        // An unusually short data URL often
        // means rendering was blocked or
        // spoofed by a privacy extension
        canvasAnomalyDetected: dataURL.length < 100
      }

    } catch (error) {
      return {
        canvasSupported: false,
        canvasHash: null
      }
    }
  }

  // ───────────────────────────────────────
  // 3. FONT FINGERPRINT
  // Measures rendered text dimensions
  // against a known font list compared to
  // generic baseline fonts. A size mismatch
  // means that specific font is installed.
  // ───────────────────────────────────────

  const TEST_FONTS = [
    'Arial', 'Verdana', 'Times New Roman',
    'Courier New', 'Georgia', 'Comic Sans MS',
    'Impact', 'Tahoma', 'Trebuchet MS',
    'Calibri', 'Cambria', 'Consolas',
    'Helvetica', 'Segoe UI', 'Roboto',
    'San Francisco', 'Ubuntu', 'Noto Sans',
    'Droid Sans', 'Lucida Console'
  ]

  const collectFontFingerprint = () => {
    try {
      const baseFonts = ['monospace', 'sans-serif', 'serif']
      const testString = 'mmmmmmmmmmlli'

      const span = document.createElement('span')
      span.style.fontSize = '72px'
      span.style.position = 'absolute'
      span.style.left = '-9999px'
      span.style.top = '-9999px'
      span.textContent = testString
      document.body.appendChild(span)

      const baseSizes = {}
      baseFonts.forEach(base => {
        span.style.fontFamily = base
        baseSizes[base] = {
          width: span.offsetWidth,
          height: span.offsetHeight
        }
      })

      const detected = []
      TEST_FONTS.forEach(font => {
        let isDetected = false
        for (const base of baseFonts) {
          span.style.fontFamily = `'${font}', ${base}`
          if (
            span.offsetWidth !== baseSizes[base].width ||
            span.offsetHeight !== baseSizes[base].height
          ) {
            isDetected = true
            break
          }
        }
        if (isDetected) detected.push(font)
      })

      document.body.removeChild(span)

      const uniquenessScore = Math.round(
        (detected.length / TEST_FONTS.length) * 100
      )

      return {
        fontCount: detected.length,
        fontTotalChecked: TEST_FONTS.length,
        fontUniquenessScore: uniquenessScore,
        fontDetectionMethod: 'width-height-comparison',
        fontsDetected: detected
      }

    } catch (error) {
      return {
        fontCount: null,
        fontsDetected: []
      }
    }
  }

  // ───────────────────────────────────────
  // 4. CLIENTRECTS FINGERPRINT
  // Measures sub-pixel rendering precision
  // of a text element's bounding box, which
  // varies slightly by rendering engine,
  // OS font hinting, and zoom level.
  // ───────────────────────────────────────

  const collectClientRectsFingerprint = async () => {
    try {
      const div = document.createElement('div')
      div.style.position = 'absolute'
      div.style.left = '-9999px'
      div.style.top = '-9999px'
      div.innerHTML =
        '<span style="font-size:13px;">' +
        'IntelReap ClientRects test 0123456789' +
        '</span>'
      document.body.appendChild(div)

      const rect = div.firstChild.getBoundingClientRect()
      const raw =
        `${rect.width.toFixed(2)}-` +
        `${rect.height.toFixed(2)}-` +
        `${rect.top.toFixed(2)}-` +
        `${rect.left.toFixed(2)}`

      document.body.removeChild(div)

      const hash = await sha256Hex(raw)

      return {
        clientRectsSupported: true,
        clientRectsHash: hash,
        clientRectsVariance: raw
      }

    } catch (error) {
      return {
        clientRectsSupported: false,
        clientRectsHash: null
      }
    }
  }

  // ───────────────────────────────────────
  // 5. BOT AND AUTOMATION DETECTION
  // Checks well-known signals that headless
  // or automated browsers expose. None of
  // these alone is conclusive, so we report
  // a confidence level rather than a flat
  // yes/no.
  // ───────────────────────────────────────

  const collectBotSignals = () => {
    const signals = []
    let webdriverDetected = false

    try {
      if (navigator.webdriver === true) {
        webdriverDetected = true
        signals.push('navigator.webdriver is true')
      }
    } catch {}

    try {
      if (
        navigator.languages &&
        navigator.languages.length === 0
      ) {
        signals.push('empty navigator.languages array')
      }
    } catch {}

    try {
      if (/HeadlessChrome/.test(navigator.userAgent)) {
        webdriverDetected = true
        signals.push('HeadlessChrome in user agent')
      }
    } catch {}

    try {
      if (
        window.outerWidth === 0 &&
        window.outerHeight === 0
      ) {
        signals.push('zero outer window dimensions')
      }
    } catch {}

    const botConfidence =
      webdriverDetected ? 'High' :
      signals.length > 0 ? 'Medium' :
      'Low'

    return {
      webdriverDetected,
      botSignals: signals,
      botConfidence
    }
  }

  // ───────────────────────────────────────
  // 6. INCOGNITO / PRIVATE BROWSING
  // DETECTION
  // Heuristic based on storage quota — most
  // browsers report a much smaller quota in
  // private sessions than normal ones. Not
  // a certainty, reported as a heuristic.
  // ───────────────────────────────────────

  const collectIncognitoDetection = async () => {
    try {
      if (!navigator.storage?.estimate) {
        return {
          incognitoDetected: null,
          incognitoMethod: 'unsupported'
        }
      }

      const { quota } = await navigator.storage.estimate()
      const quotaMB = quota
        ? Math.round(quota / (1024 * 1024))
        : null

      const likelyIncognito =
        quotaMB !== null && quotaMB < 120

      return {
        incognitoDetected: likelyIncognito,
        incognitoQuotaMB: quotaMB,
        incognitoMethod: 'storage-quota-heuristic'
      }

    } catch (error) {
      return {
        incognitoDetected: null,
        incognitoMethod: 'error'
      }
    }
  }

  // ───────────────────────────────────────
  // 7. AD BLOCKER DETECTION
  // Inserts a hidden "bait" element using
  // classic ad-related class names. Ad
  // blockers that hide elements by class
  // name will collapse it to zero size.
  // ───────────────────────────────────────

  const collectAdBlockerDetection = () => {
    return new Promise(resolve => {
      try {
        const bait = document.createElement('div')
        bait.className =
          'ad-banner ads advertisement adsbox ' +
          'doubleclick ad-placement'
        bait.style.cssText =
          'position:absolute;left:-9999px;' +
          'top:-9999px;width:1px;height:1px;'
        document.body.appendChild(bait)

        setTimeout(() => {
          let blocked = false
          try {
            blocked = (
              bait.offsetParent === null ||
              bait.offsetHeight === 0 ||
              bait.offsetWidth === 0 ||
              window.getComputedStyle(bait)
                .display === 'none'
            )
          } catch {}

          if (bait.parentNode) {
            document.body.removeChild(bait)
          }

          resolve({
            adBlockerDetected: blocked,
            adBlockerMethod: 'bait-element-css-probe'
          })
        }, 100)

      } catch (error) {
        resolve({
          adBlockerDetected: null,
          adBlockerMethod: 'error'
        })
      }
    })
  }

  // ───────────────────────────────────────
  // 8. RAW HTTP HEADERS
  // Page JavaScript cannot see the headers
  // its own request sent — only the server
  // can. This calls a small backend echo
  // endpoint that returns req.headers back
  // to the page.
  // ───────────────────────────────────────

  const collectHttpHeaders = async () => {
    try {
      const data = await callBackend('headersEcho')
      const headers = data.headers || {}

      return {
        acceptLanguageHeader:
          headers['accept-language'] || '—',
        acceptEncodingHeader:
          headers['accept-encoding'] || '—',
        totalHeadersSent: Object.keys(headers).length,
        fullHeaders: headers
      }

    } catch (error) {
      return {
        acceptLanguageHeader: '—',
        acceptEncodingHeader: '—',
        totalHeadersSent: null,
        fullHeaders: null
      }
    }
  }

  // ───────────────────────────────────────
  // 9. IPv6 LEAK TEST
  // Calls a backend endpoint that reports
  // whether the inbound request arrived
  // over IPv4 or IPv6. NOTE: reliability of
  // this specific test depends on whether
  // the hosting platform's edge network
  // actually terminates IPv6 connections —
  // confirmed as an open question on Vercel
  // at the time this was written. Treat
  // results with that caveat until verified
  // against a real deployment.
  // ───────────────────────────────────────

  const collectIPv6Check = async () => {
    try {
      const data = await callBackend('ipv6Check')

      return {
        ipv6Connectivity:
          data.ipVersion === 6
            ? 'IPv6 Active'
            : 'IPv4 Only',
        ipv6LeakDetected: data.ipVersion === 6,
        ipv6Source: data.ipVersion
          ? 'backend-echo'
          : 'unavailable'
      }

    } catch (error) {
      return {
        ipv6Connectivity: 'Unknown',
        ipv6LeakDetected: null,
        ipv6Source: 'unavailable'
      }
    }
  }

  // ───────────────────────────────────────
  // 10. GEOLOCATION GPS
  // Deliberately passive — this never
  // triggers a fresh permission prompt of
  // its own. It only reads real coordinates
  // if geolocation permission was already
  // granted elsewhere. If not yet decided,
  // it just reports the permission state,
  // matching how the rest of this tool
  // observes permissions without requesting
  // new ones.
  // ───────────────────────────────────────

  const collectGeolocation = () => {
    return new Promise(resolve => {
      if (!navigator.geolocation) {
        resolve({ geoPermission: 'unsupported' })
        return
      }

      if (!navigator.permissions?.query) {
        // Can't check state without prompting,
        // so we decline to probe at all
        resolve({ geoPermission: 'unknown' })
        return
      }

      navigator.permissions
        .query({ name: 'geolocation' })
        .then(status => {
          if (status.state !== 'granted') {
            resolve({ geoPermission: status.state })
            return
          }

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const identity = STATE.identity
              const ipLat = identity.latitude
              const ipLng = identity.longitude

              let geoIpMatch = null
              if (ipLat !== null && ipLng !== null) {
                // Roughly compare GPS vs IP location —
                // ~1 degree is a generous threshold
                // since IP geolocation is city-level
                // at best, not GPS-precise
                const latDiff = Math.abs(
                  pos.coords.latitude - ipLat
                )
                const lngDiff = Math.abs(
                  pos.coords.longitude - ipLng
                )
                geoIpMatch = (
                  latDiff < 1 && lngDiff < 1
                )
              }

              resolve({
                geoPermission: 'granted',
                geoLatitude: pos.coords.latitude,
                geoLongitude: pos.coords.longitude,
                geoAccuracy: pos.coords.accuracy,
                geoIpMatch
              })
            },
            () => {
              resolve({
                geoPermission: 'granted',
                geoLatitude: null
              })
            },
            { timeout: 8000, maximumAge: 60000 }
          )
        })
        .catch(() => {
          resolve({ geoPermission: 'unknown' })
        })
    })
  }

  // ───────────────────────────────────────
  // 11. CSS MEDIA QUERY DETECTION
  // Pure JS via matchMedia — no stylesheet
  // needed. Probes a fixed list of media
  // features and reports how many match.
  // ───────────────────────────────────────

  const MEDIA_QUERIES_TO_TEST = [
    '(prefers-color-scheme: dark)',
    '(prefers-color-scheme: light)',
    '(prefers-reduced-motion: reduce)',
    '(prefers-contrast: more)',
    '(prefers-contrast: less)',
    '(display-mode: standalone)',
    '(display-mode: fullscreen)',
    '(hover: hover)',
    '(pointer: fine)',
    '(pointer: coarse)',
    '(any-pointer: fine)',
    '(orientation: portrait)',
    '(min-resolution: 2dppx)',
    '(forced-colors: active)',
    '(inverted-colors: inverted)'
  ]

  const collectMediaQueryFingerprint = () => {
    try {
      const results = {}
      let matchedCount = 0

      MEDIA_QUERIES_TO_TEST.forEach(query => {
        try {
          const matches = window
            .matchMedia(query).matches
          results[query] = matches
          if (matches) matchedCount++
        } catch {
          results[query] = null
        }
      })

      const modes = [
        'standalone', 'fullscreen',
        'minimal-ui', 'browser'
      ]
      const displayMode = modes.find(mode =>
        window
          .matchMedia(`(display-mode: ${mode})`)
          .matches
      ) || 'browser'

      return {
        mediaQueriesTested: MEDIA_QUERIES_TO_TEST.length,
        mediaQueriesMatched: matchedCount,
        displayMode,
        colorSchemePreference:
          results['(prefers-color-scheme: dark)']
            ? 'dark'
            : 'light',
        reducedMotionPreference:
          results['(prefers-reduced-motion: reduce)'] ||
          false
      }

    } catch (error) {
      return {
        mediaQueriesTested: null,
        mediaQueriesMatched: null
      }
    }
  }

  // ───────────────────────────────────────
  // 12. CHROME EXTENSION DETECTION
  // Probes for known extension IDs via
  // their web-accessible resources. Only
  // works in Chromium-based browsers —
  // reports zero/not-applicable elsewhere.
  // ───────────────────────────────────────

  const KNOWN_EXTENSIONS = [
    {
      name: 'uBlock Origin',
      id: 'cjpalhdlnbpafiamejdnhcphjbkeiagm',
      resource: 'img/icon_38.png'
    },
    {
      name: 'AdBlock Plus',
      id: 'cfhdojbkjhnklbpkdaibdccddilifddb',
      resource: 'icons/detected-adblock/icon19.png'
    },
    {
      name: 'Grammarly',
      id: 'kbfnbcaeplbcioakkpcpgfkobkghlhen',
      resource: 'manifest.json'
    },
    {
      name: 'LastPass',
      id: 'hdokiejnpimakedhajhdlcegeplioahd',
      resource: 'manifest.json'
    },
    {
      name: 'MetaMask',
      id: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
      resource: 'manifest.json'
    },
    {
      name: 'Dark Reader',
      id: 'eimadpbcbfnmbkopoojfekhnkhdbieeh',
      resource: 'manifest.json'
    }
  ]

  const checkExtension = (ext) => {
    return new Promise(resolve => {
      try {
        const img = new Image()
        const timeout = setTimeout(
          () => resolve(false),
          300
        )
        img.onload = () => {
          clearTimeout(timeout)
          resolve(true)
        }
        img.onerror = () => {
          clearTimeout(timeout)
          resolve(false)
        }
        img.src =
          `chrome-extension://${ext.id}/${ext.resource}`
      } catch {
        resolve(false)
      }
    })
  }

  const collectExtensionFingerprint = async () => {
    try {
      if (!/Chrome|Chromium|Edg/.test(navigator.userAgent)) {
        return {
          extensionCount: 0,
          extensionNames: [],
          extensionDetectionMethod: 'not-applicable'
        }
      }

      const results = await Promise.all(
        KNOWN_EXTENSIONS.map(ext => checkExtension(ext))
      )
      const detected = KNOWN_EXTENSIONS.filter(
        (_, i) => results[i]
      )

      return {
        extensionCount: detected.length,
        extensionNames: detected.map(e => e.name),
        extensionDetectionMethod:
          'web-accessible-resource-probe'
      }

    } catch (error) {
      return {
        extensionCount: 0,
        extensionNames: [],
        extensionDetectionMethod: 'error'
      }
    }
  }

  // ───────────────────────────────────────
  // 13. SPEECH SYNTHESIS VOICE FINGERPRINT
  // The exact list of installed TTS voices
  // varies by OS and language packs
  // installed, making it a useful signal.
  // ───────────────────────────────────────

  const collectSpeechFingerprint = () => {
    return new Promise(resolve => {
      try {
        if (!window.speechSynthesis) {
          resolve({
            voiceCount: 0,
            defaultVoice: '—'
          })
          return
        }

        const getVoices = () => {
          const voices = window.speechSynthesis.getVoices()

          if (voices.length === 0) {
            resolve({
              voiceCount: 0,
              defaultVoice: '—'
            })
            return
          }

          const names = voices
            .map(v => v.name)
            .sort()
            .join('|')

          sha256Hex(names).then(hash => {
            resolve({
              voiceCount: voices.length,
              voiceListHash: hash,
              defaultVoice:
                voices.find(v => v.default)?.name ||
                voices[0]?.name ||
                '—'
            })
          })
        }

        if (window.speechSynthesis.getVoices().length > 0) {
          getVoices()
        } else {
          window.speechSynthesis.onvoiceschanged = getVoices
          // Fallback in case the event never fires
          setTimeout(getVoices, 500)
        }

      } catch (error) {
        resolve({
          voiceCount: null,
          defaultVoice: '—'
        })
      }
    })
  }

  // ───────────────────────────────────────
  // 14. MEDIA DEVICE ENUMERATION
  // Device counts are visible without any
  // camera/microphone permission grant —
  // only device labels require permission.
  // ───────────────────────────────────────

  const collectMediaDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        return {
          mediaAudioInputs: null,
          mediaAudioOutputs: null,
          mediaVideoInputs: null
        }
      }

      const devices =
        await navigator.mediaDevices.enumerateDevices()

      return {
        mediaAudioInputs: devices
          .filter(d => d.kind === 'audioinput').length,
        mediaAudioOutputs: devices
          .filter(d => d.kind === 'audiooutput').length,
        mediaVideoInputs: devices
          .filter(d => d.kind === 'videoinput').length
      }

    } catch (error) {
      return {
        mediaAudioInputs: null,
        mediaAudioOutputs: null,
        mediaVideoInputs: null
      }
    }
  }

  // ───────────────────────────────────────
  // 15. MATH ENGINE FINGERPRINT
  // Transcendental function results
  // (tan, sin, exp, log) can differ in
  // their final bits across JS engines
  // and CPU architectures.
  // ───────────────────────────────────────

  const collectMathFingerprint = async () => {
    try {
      const ops = [
        Math.tan(-1e300),
        Math.sin(7.123456789),
        Math.exp(43),
        Math.pow(2, 0.5),
        Math.atan2(1, 2),
        Math.log(1.5)
      ]
      const combined = ops.join(',')
      const hash = await sha256Hex(combined)

      return {
        mathEngineHash: hash,
        mathEngineConsistent: true
      }

    } catch (error) {
      return {
        mathEngineHash: null,
        mathEngineConsistent: null
      }
    }
  }

  // ───────────────────────────────────────
  // COMPOSITE UNIQUENESS SCORE
  // Heuristic, not a verified population
  // statistic — counts how many signals
  // came back as distinctive/non-default
  // and scales a 0-100 score from that.
  // ───────────────────────────────────────

  const computeUniquenessScore = (fp) => {
    let points = 0
    let possible = 0

    possible++
    if (fp.audioEntropyScore === 'High') points++

    possible++
    if (fp.canvasAnomalyDetected === false) points++

    possible++
    if (fp.fontUniquenessScore !== null) {
      points += fp.fontUniquenessScore > 60 ? 1 : 0
    }

    possible++
    if (fp.clientRectsSupported) points++

    possible++
    if (
      fp.extensionCount !== null &&
      fp.extensionCount > 0
    ) points++

    possible++
    if (fp.voiceCount && fp.voiceCount > 0) points++

    return possible > 0
      ? Math.round((points / possible) * 100)
      : null
  }

  // ───────────────────────────────────────
  // COLLECT
  // Runs every sub-collector and writes
  // the combined result into STATE
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem(
      'INFO',
      'Fingerprint engine starting'
    )

    const results = await Promise.allSettled([
      collectAudioFingerprint(),
      collectCanvasFingerprint(),
      Promise.resolve(collectFontFingerprint()),
      collectClientRectsFingerprint(),
      Promise.resolve(collectBotSignals()),
      collectIncognitoDetection(),
      collectAdBlockerDetection(),
      collectHttpHeaders(),
      collectIPv6Check(),
      collectGeolocation(),
      Promise.resolve(collectMediaQueryFingerprint()),
      collectExtensionFingerprint(),
      collectSpeechFingerprint(),
      collectMediaDevices(),
      collectMathFingerprint()
    ])

    let combined = {}
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        combined = { ...combined, ...result.value }
      }
    })

    combined.uniquenessScore =
      computeUniquenessScore(combined)

    updateFingerprinting(combined)

    logSystem(
      'INFO',
      'Fingerprint engine complete — ' +
      `uniqueness score ${combined.uniquenessScore}/100`
    )

    return combined
  }

  return {
    collect,
    sha256Hex,
    collectAudioFingerprint,
    collectCanvasFingerprint,
    collectFontFingerprint,
    collectClientRectsFingerprint
  }

})()
