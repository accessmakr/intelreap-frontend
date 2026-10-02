// ─────────────────────────────────────────
// ANALYTICS CONSENT
// Google Analytics loads only after the
// visitor chooses Accept. Until then,
// consent defaults to denied and no request
// is made to Google.
// ─────────────────────────────────────────
;(function () {
  var GA_ID = 'G-187W4NTBS7'
  var KEY = 'ndic_analytics_consent'
  var loaded = false

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = window.gtag || gtag

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  })

  function read() {
    try {
      return localStorage.getItem(KEY)
    } catch (e) {
      return null
    }
  }

  function load() {
    if (loaded) return
    loaded = true
    var s = document.createElement('script')
    s.async = true
    s.src =
      'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
    document.head.appendChild(s)
    gtag('js', new Date())
    gtag('config', GA_ID)
  }

  function clearGaCookies() {
    var host = location.hostname
    var parts = host.split('.')
    var domains = [host, '.' + host]
    if (parts.length > 2) {
      domains.push('.' + parts.slice(-2).join('.'))
    }
    var expired = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim()
      var isGa =
        name === '_ga' ||
        name === '_gid' ||
        name.indexOf('_ga_') === 0
      if (!isGa) return
      document.cookie = name + expired
      domains.forEach(function (d) {
        document.cookie = name + expired + '; domain=' + d
      })
    })
  }

  function grant() {
    gtag('consent', 'update', { analytics_storage: 'granted' })
    load()
  }

  function deny() {
    gtag('consent', 'update', { analytics_storage: 'denied' })
    clearGaCookies()
  }

  window.IntelReapConsent = {
    grant: grant,
    deny: deny,
    read: read,
    key: KEY
  }

  if (read() === 'granted') grant()
})()
