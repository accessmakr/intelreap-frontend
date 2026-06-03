// ─────────────────────────────────────────
// INTELREAP AD SLOTS CONFIGURATION
// Controls all affiliate and ad carousels
// Empty items array = carousel hidden
// type: 'affiliate' shows Sponsored badge
// type: 'ad' shows no disclosure badge
// ─────────────────────────────────────────

const AD_SLOTS = {

  // ─────────────────────────────────────
  // ZONE DEFINITIONS
  // Each zone maps to a page placement
  // data-zone attribute on carousel div
  // ─────────────────────────────────────

  zones: {

    // ── Zone 1: Below Hero CTA ──────────
    // Appears immediately after hero
    // CTA buttons on all pages
    'hero-below': {
      label: 'Hero Below',
      items: [
        // Add affiliate or ad items here
        // Example structure shown below
        // Remove example and add real items
        // when ready to monetize

        // {
        //   id: 'nordvpn-1',
        //   type: 'affiliate',
        //   title: 'Protect Your Connection',
        //   description: 'Your scan shows your real IP. A VPN keeps it private.',
        //   cta: 'Get Protected',
        //   url: 'https://go.nordvpn.net/...',
        //   badge: 'Recommended'
        // },
        // {
        //   id: 'expressvpn-1',
        //   type: 'affiliate',
        //   title: 'Faster, Private Browsing',
        //   description: 'World-class encryption. 3,000+ servers in 94 countries.',
        //   cta: 'Start Free Trial',
        //   url: 'https://...',
        //   badge: null
        // }
      ]
    },

    // ── Zone 2: Below Tool Section ──────
    // Appears between the NDIC tool
    // and the Logic section
    'tool-below': {
      label: 'Tool Below',
      items: [
        // {
        //   id: 'cloudflare-1',
        //   type: 'affiliate',
        //   title: 'Cloudflare for Teams',
        //   description: 'Your network intelligence reveals connection risks. Cloudflare fixes them.',
        //   cta: 'Explore Free Plan',
        //   url: 'https://...',
        //   badge: 'Free Tier'
        // }
      ]
    },

    // ── Zone 3: Above FAQ Section ────────
    // High-visibility placement
    // just before FAQ accordion
    'faq-above': {
      label: 'FAQ Above',
      items: [
        // {
        //   id: 'ad-slot-1',
        //   type: 'ad',
        //   title: 'Your Ad Here',
        //   description: 'Reach a technical audience interested in networking and security.',
        //   cta: 'Book This Space',
        //   url: 'mailto:hello@intelreap.com',
        //   badge: 'Available'
        // }
      ]
    },

    // ── Zone 4: Sidebar (Deep Dive) ─────
    // Appears in the right sidebar
    // on deep dive pages only
    'sidebar': {
      label: 'Sidebar',
      items: [
        // {
        //   id: 'protonvpn-1',
        //   type: 'affiliate',
        //   title: 'ProtonVPN',
        //   description: 'Swiss privacy. No-logs policy. Built by CERN scientists.',
        //   cta: 'Get Proton Free',
        //   url: 'https://...',
        //   badge: 'Free Forever'
        // }
      ]
    },

    // ── Zone 5: After Share Block ────────
    // Below share pills section
    'share-below': {
      label: 'Share Below',
      items: []
    },

    // ── Zone 6: Footer Above ─────────────
    // Just above the main footer
    // Low intent but high visibility
    'footer-above': {
      label: 'Footer Above',
      items: []
    }

  },

  // ─────────────────────────────────────
  // GLOBAL SETTINGS
  // ─────────────────────────────────────

  settings: {
    // Milliseconds between auto-advance
    autoPlayInterval: 5000,

    // Show carousel even if only 1 item
    showSingleItem: true,

    // Show prev/next buttons
    showNavButtons: true,

    // Show dot indicators
    showDots: true
  }
}

// Freeze configuration
Object.freeze(AD_SLOTS)
