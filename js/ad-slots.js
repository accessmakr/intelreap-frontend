// ─────────────────────────────────────────
// INTELREAP AD SLOTS CONFIGURATION
// Controls all ad carousels
// Empty items array = carousel hidden
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
      ]
    },

    // ── Zone 2: Below Tool Section ──────
    // Appears between the NDIC tool
    // and the Logic section
    'tool-below': {
      label: 'Tool Below',
      items: [
      ]
    },

    // ── Zone 3: Above FAQ Section ────────
    // High-visibility placement
    // just before FAQ accordion
    'faq-above': {
      label: 'FAQ Above',
      items: [
      ]
    },

    // ── Zone 4: Sidebar (Deep Dive) ─────
    // Appears in the right sidebar
    // on deep dive pages only
    'sidebar': {
      label: 'Sidebar',
      items: [
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
