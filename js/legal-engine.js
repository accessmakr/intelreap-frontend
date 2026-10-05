// ─────────────────────────────────────────
// INTELREAP LEGAL ENGINE
// Dynamic copyright year
// Footer legal links injection
// Cookie notice
// ─────────────────────────────────────────

const LegalEngine = (() => {

  // ─────────────────────────────────────
  // BUILD FOOTER
  // ─────────────────────────────────────

  const buildFooter = (basePath) => {
    const footer = document.querySelector(
      '#ndic-footer'
    )
    if (!footer) return
    // Static footer already in the HTML: keep it
    if (footer.querySelector('.ndic-footer-inner')) return

    const year =
      INTELREAP_CONFIG?.getCurrentYear() ||
      new Date().getFullYear()

    footer.innerHTML = `
      <div class="ndic-footer-inner">

        <div class="ndic-footer-brand">
          <a
            href="${basePath}index.html"
            class="ndic-footer-logo-link"
          >
            <span class="ndic-footer-wordmark">
              INTEL<span>REAP</span>
            </span>
          </a>
          <p class="ndic-footer-tagline">
            Real-time network and device intelligence.
          </p>
          <p class="ndic-footer-description">
            Free browser-based intelligence tool.
            No account required.
          </p>
        </div>

        <div class="ndic-footer-links">

          <div class="ndic-footer-col">
            <h4 class="ndic-footer-col-title">
              Intelligence
            </h4>
            <a href="${basePath}index.html">
              Intelligence Center
            </a>
            <a href="${basePath}intelligence/network-route.html">
              Network Route
            </a>
            <a href="${basePath}intelligence/security.html">
              Security Analysis
            </a>
            <a href="${basePath}intelligence/vpn-proxy.html">
              VPN and Proxy
            </a>
            <a href="${basePath}intelligence/scoreboard.html">
              Global Scoreboard
            </a>
          </div>

          <div class="ndic-footer-col">
            <h4 class="ndic-footer-col-title">
              Deep Dives
            </h4>
            <a href="${basePath}intelligence/device.html">
              Device Intelligence
            </a>
            <a href="${basePath}intelligence/performance.html">
              Performance
            </a>
            <a href="${basePath}intelligence/rendering-speed.html">
              Rendering Speed
            </a>
            <a href="${basePath}intelligence/capability.html">
              Capability Matrix
            </a>
            <a href="${basePath}intelligence/live-network.html">
              Live Network
            </a>
            <a href="${basePath}intelligence/fingerprinting.html">
              Fingerprint &amp; Leak Detection
            </a>
          </div>

          <div class="ndic-footer-col">
            <h4 class="ndic-footer-col-title">
              Legal
            </h4>
            <a href="${basePath}privacy-policy.html">
              Privacy Policy
            </a>
            <a href="${basePath}cookies-policy.html">
              Cookies Policy
            </a>
            <a href="${basePath}terms-of-use.html">
              Terms of Use
            </a>
            <a href="${basePath}about.html">
              About
            </a>
            <a href="${basePath}contact.html">
              Contact
            </a>
          </div>

          <div class="ndic-footer-col">
            <h4 class="ndic-footer-col-title">
              Connect
            </h4>
            <a
              href="https://twitter.com/intelreap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter / X
            </a>
          </div>

        </div>

      </div>

      <div class="ndic-footer-bottom">
        <div class="ndic-footer-copyright">
          <span class="copyright-year">
            © ${year} IntelReap
          </span>
          <span class="ndic-footer-sep">—</span>
          <span>
            Free to use. No account required.
          </span>
        </div>
        <div class="ndic-footer-legal-inline">
          <a href="${basePath}privacy-policy.html">
            Privacy
          </a>
          <a href="${basePath}cookies-policy.html">
            Cookies
          </a>
          <a href="${basePath}terms-of-use.html">
            Terms
          </a>
          <a
            href="${basePath}cookies-policy.html#cookie-settings"
            id="ndic-cookie-settings"
          >
            Cookie settings
          </a>
        </div>
      </div>
    `
  }

  // ─────────────────────────────────────
  // COOKIE NOTICE
  // Lightweight banner
  // ─────────────────────────────────────

  const CONSENT_KEY = 'ndic_analytics_consent'

  const readConsent = () => {
    try {
      return localStorage.getItem(CONSENT_KEY)
    } catch (e) {
      return null
    }
  }

  const writeConsent = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch (e) {
      // storage unavailable: choice applies to this page only
    }
  }

  const showCookieNotice = (basePath) => {
    if (document.getElementById('ndic-cookie-notice')) return

    const notice = document.createElement('div')
    notice.className = 'ndic-cookie-notice'
    notice.id = 'ndic-cookie-notice'
    notice.setAttribute('role', 'region')
    notice.setAttribute('aria-label', 'Cookie consent')

    notice.innerHTML = `
      <div class="ndic-cookie-inner">
        <p class="ndic-cookie-text">
          <span data-i18n="cookie.text">IntelReap saves your language and theme choices in your browser.
          With your permission it also uses Google Analytics cookies to measure how the site
          is used. Declining does not limit the tool.</span>
          <a
            href="${basePath}cookies-policy.html"
            class="ndic-cookie-link"
            data-i18n="cookie.policy_link"
          >Cookies Policy</a>
        </p>
        <div class="ndic-cookie-actions">
          <button
            class="ndic-cookie-accept"
            id="ndic-cookie-accept"
            data-i18n="cookie.accept"
          >Accept</button>
          <button
            class="ndic-cookie-decline"
            id="ndic-cookie-decline"
            data-i18n="cookie.decline"
          >Decline</button>
        </div>
      </div>
    `

    document.body.appendChild(notice)
    if (typeof I18nEngine !== 'undefined' && I18nEngine.renderToDOM) {
      I18nEngine.renderToDOM()
    }

    const decide = (granted) => {
      writeConsent(granted ? 'granted' : 'denied')
      if (window.IntelReapConsent) {
        if (granted) window.IntelReapConsent.grant()
        else window.IntelReapConsent.deny()
      }
      notice.classList.add('ndic-cookie-notice--hiding')
      setTimeout(() => notice.remove(), 400)
    }

    document
      .getElementById('ndic-cookie-accept')
      ?.addEventListener('click', () => decide(true))
    document
      .getElementById('ndic-cookie-decline')
      ?.addEventListener('click', () => decide(false))
  }

  const initCookieNotice = (basePath) => {
    if (readConsent()) return
    showCookieNotice(basePath)
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = () => {
    if (
      typeof INTELREAP_CONFIG === 'undefined'
    ) return

    const basePath =
      INTELREAP_CONFIG.getBasePath()

    buildFooter(basePath)
    initCookieNotice(basePath)

    document.addEventListener('click', (e) => {
      const link = e.target.closest &&
        e.target.closest('#ndic-cookie-settings')
      if (!link) return
      e.preventDefault()
      showCookieNotice(basePath)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    )
  } else {
    init()
  }

  return { init }

})()
