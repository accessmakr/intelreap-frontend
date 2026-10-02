// ─────────────────────────────────────────
// REDACTION
// Removes identifying fields from a scan
// snapshot before it is sent to the AI
// summary service. The visitor still sees
// all of their own results on screen.
// ─────────────────────────────────────────
const IntelReapRedact = (() => {
  const EXACT = new Set([
    'ip', 'city', 'region', 'postal',
    'latitude', 'longitude',
    'geoLatitude', 'geoLongitude', 'geoAccuracy',
    'localIp', 'ipRange', 'ipv6Source',
    'fullHeaders', 'acceptLanguageHeader',
    'acceptEncodingHeader',
    'extensionNames', 'fontsDetected',
    'defaultVoice'
  ])
  const HASH = /hash$/i
  const IPV4 = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  const IPV6 =
    /\b(?:[0-9a-f]{1,4}:){4,7}[0-9a-f]{1,4}\b|\b(?:[0-9a-f]{1,4}:){1,6}:(?:[0-9a-f]{1,4})?\b/gi

  const scrub = (text) =>
    text.replace(IPV4, '[redacted]').replace(IPV6, '[redacted]')

  const walk = (node) => {
    if (Array.isArray(node)) return node.map(walk)
    if (node && typeof node === 'object') {
      const out = {}
      Object.keys(node).forEach((k) => {
        const v = node[k]
        const sensitive = EXACT.has(k) || HASH.test(k)
        if (sensitive && typeof v !== 'boolean') {
          out[k] = null
        } else {
          out[k] = walk(v)
        }
      })
      return out
    }
    if (typeof node === 'string') return scrub(node)
    return node
  }

  const safe = (snapshot) => {
    const clean = walk(snapshot)
    if (clean && typeof clean === 'object') clean.events = []
    return clean
  }

  const api = { safe, walk, scrub }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api
  }
  return api
})()
