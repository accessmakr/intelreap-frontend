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
            No login. No data stored.
            Everything runs in your browser.
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
            <a
              href="https://github.com/accessmakr/intelreap-frontend"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
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
            All intelligence data processed
            locally in your browser.
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
        </div>
      </div>
    `
  }

  // ─────────────────────────────────────
  // COOKIE NOTICE
  // Lightweight banner
  // ─────────────────────────────────────

  const initCookieNotice = (basePath) => {
    const accepted = localStorage.getItem(
      'ndic_cookies_accepted'
    )
    if (accepted) return

    const notice = document.createElement('div')
    notice.className = 'ndic-cookie-notice'
    notice.id = 'ndic-cookie-notice'
    notice.setAttribute('role', 'banner')
    notice.setAttribute(
      'aria-label',
      'Cookie notice'
    )

    notice.innerHTML = `
      <div class="ndic-cookie-inner">
        <p class="ndic-cookie-text">
          IntelReap uses minimal local storage
          to save your language preference.
          No tracking. No third-party cookies.
          <a
            href="${basePath}cookies-policy.html"
            class="ndic-cookie-link"
          >
            Cookies Policy
          </a>
        </p>
        <div class="ndic-cookie-actions">
          <button
            class="ndic-cookie-accept"
            id="ndic-cookie-accept"
          >
            Accept
          </button>
          <button
            class="ndic-cookie-decline"
            id="ndic-cookie-decline"
          >
            Decline
          </button>
        </div>
      </div>
    `

    document.body.appendChild(notice)

    const acceptBtn =
      document.getElementById(
        'ndic-cookie-accept'
      )
    const declineBtn =
      document.getElementById(
        'ndic-cookie-decline'
      )

    const dismiss = (accepted) => {
      notice.classList.add(
        'ndic-cookie-notice--hiding'
      )
      setTimeout(() => notice.remove(), 400)
      if (accepted) {
        localStorage.setItem(
          'ndic_cookies_accepted',
          'true'
        )
      }
    }

    acceptBtn?.addEventListener(
      'click',
      () => dismiss(true)
    )
    declineBtn?.addEventListener(
      'click',
      () => dismiss(false)
    )
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
