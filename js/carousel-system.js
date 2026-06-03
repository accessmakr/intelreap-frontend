// ─────────────────────────────────────────
// INTELREAP CAROUSEL SYSTEM
// Affiliate and ad slot carousel
// Reads from AD_SLOTS configuration
// Multiple zones per page
// Auto-rotate with touch support
// Injects into .ndic-ad-carousel elements
// ─────────────────────────────────────────

const CarouselSystem = (() => {

  // ─────────────────────────────────────
  // ACTIVE CAROUSELS REGISTRY
  // ─────────────────────────────────────

  const activeCarousels = new Map()

  // ─────────────────────────────────────
  // BUILD CAROUSEL ITEM
  // ─────────────────────────────────────

  const buildCarouselItem = (item) => {
    const slide = document.createElement('div')
    slide.className = 'ndic-carousel-slide'
    slide.setAttribute('role', 'listitem')

    // Badge
    const badgeHTML = item.badge
      ? `<span class="ndic-carousel-badge">
          ${item.badge}
         </span>`
      : ''

    // Disclosure (required for paid placements)
    const disclosureHTML = item.type === 'affiliate'
      ? `<span class="ndic-carousel-disclosure">
          Sponsored
         </span>`
      : ''

    slide.innerHTML = `
      
        href="${item.url}"
        class="ndic-carousel-card"
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label="${item.title} — ${item.description}"
      >
        <div class="ndic-carousel-card-inner">
          ${badgeHTML}
          ${disclosureHTML}
          <div class="ndic-carousel-content">
            <p class="ndic-carousel-title">
              ${item.title}
            </p>
            <p class="ndic-carousel-description">
              ${item.description}
            </p>
          </div>
          <div class="ndic-carousel-cta">
            <span class="ndic-carousel-cta-text">
              ${item.cta || 'Learn More'}
            </span>
            <span class="ndic-carousel-cta-arrow"
              aria-hidden="true">
              →
            </span>
          </div>
        </div>
      </a>
    `

    return slide
  }

  // ─────────────────────────────────────
  // BUILD CAROUSEL
  // ─────────────────────────────────────

  const buildCarousel = (container, items) => {
    if (!items || items.length === 0) {
      container.style.display = 'none'
      return null
    }

    container.setAttribute('role', 'region')
    container.setAttribute(
      'aria-label',
      'Sponsored content'
    )

    const wrapper = document.createElement('div')
    wrapper.className = 'ndic-carousel-wrapper'

    const track = document.createElement('div')
    track.className = 'ndic-carousel-track'
    track.setAttribute('role', 'list')

    items.forEach(item => {
      track.appendChild(buildCarouselItem(item))
    })

    wrapper.appendChild(track)

    // Navigation dots
    const dotsContainer =
      document.createElement('div')
    dotsContainer.className = 'ndic-carousel-dots'
    dotsContainer.setAttribute('role', 'tablist')

    items.forEach((_, index) => {
      const dot = document.createElement('button')
      dot.className = index === 0
        ? 'ndic-carousel-dot ndic-carousel-dot--active'
        : 'ndic-carousel-dot'
      dot.setAttribute('aria-label',
        `Go to slide ${index + 1}`
      )
      dot.setAttribute('role', 'tab')
      dot.setAttribute(
        'aria-selected',
        String(index === 0)
      )
      dotsContainer.appendChild(dot)
    })

    // Prev/Next buttons
    const prevBtn = document.createElement('button')
    prevBtn.className = 'ndic-carousel-prev'
    prevBtn.setAttribute('aria-label', 'Previous')
    prevBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'ndic-carousel-next'
    nextBtn.setAttribute('aria-label', 'Next')
    nextBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>'

    container.appendChild(wrapper)
    container.appendChild(dotsContainer)
    container.appendChild(prevBtn)
    container.appendChild(nextBtn)

    // ─── STATE AND LOGIC ───────────────

    let currentIndex = 0
    let autoInterval = null
    const dots = Array.from(
      dotsContainer.querySelectorAll(
        '.ndic-carousel-dot'
      )
    )
    const slides = Array.from(
      track.querySelectorAll(
        '.ndic-carousel-slide'
      )
    )

    const goTo = (index) => {
      const total = slides.length
      currentIndex =
        ((index % total) + total) % total

      // Translate track
      track.style.transform =
        `translateX(-${currentIndex * 100}%)`

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle(
          'ndic-carousel-dot--active',
          i === currentIndex
        )
        dot.setAttribute(
          'aria-selected',
          String(i === currentIndex)
        )
      })
    }

    const next = () => goTo(currentIndex + 1)
    const prev = () => goTo(currentIndex - 1)

    const startAuto = () => {
      stopAuto()
      if (slides.length > 1) {
        autoInterval = setInterval(next, 5000)
      }
    }

    const stopAuto = () => {
      if (autoInterval) {
        clearInterval(autoInterval)
        autoInterval = null
      }
    }

    // Button events
    nextBtn.addEventListener('click', () => {
      next()
      stopAuto()
      startAuto()
    })

    prevBtn.addEventListener('click', () => {
      prev()
      stopAuto()
      startAuto()
    })

    // Dot events
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goTo(index)
        stopAuto()
        startAuto()
      })
    })

    // Touch support
    let touchStartX = 0
    let touchEndX = 0

    track.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true }
    )

    track.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        const diff = touchStartX - touchEndX

        if (Math.abs(diff) > 50) {
          diff > 0 ? next() : prev()
          stopAuto()
          startAuto()
        }
      },
      { passive: true }
    )

    // Pause on hover
    container.addEventListener(
      'mouseenter',
      stopAuto
    )
    container.addEventListener(
      'mouseleave',
      startAuto
    )

    // Pause when not visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          entry.isIntersecting
            ? startAuto()
            : stopAuto()
        },
        { threshold: 0.5 }
      )
      observer.observe(container)
    } else {
      startAuto()
    }

    // Keyboard accessibility
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    })

    // Store reference for cleanup
    return { goTo, next, prev, stopAuto, startAuto }
  }

  // ─────────────────────────────────────
  // INJECT INTO ALL CONTAINERS
  // ─────────────────────────────────────

  const injectAll = () => {
    if (typeof AD_SLOTS === 'undefined') {
      return
    }

    const containers = document.querySelectorAll(
      '.ndic-ad-carousel'
    )

    containers.forEach(container => {
      if (container.dataset.carouselInjected) {
        return
      }

      const zone = container.dataset.zone
      if (!zone) return

      const zoneConfig = AD_SLOTS.zones[zone]
      if (
        !zoneConfig ||
        !zoneConfig.items ||
        zoneConfig.items.length === 0
      ) {
        container.style.display = 'none'
        return
      }

      const carousel = buildCarousel(
        container,
        zoneConfig.items
      )

      if (carousel) {
        activeCarousels.set(zone, carousel)
      }

      container.dataset.carouselInjected = 'true'
    })
  }

  // ─────────────────────────────────────
  // DESTROY ALL
  // ─────────────────────────────────────

  const destroyAll = () => {
    activeCarousels.forEach(carousel => {
      carousel.stopAuto()
    })
    activeCarousels.clear()
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = () => {
    injectAll()

    window.addEventListener(
      'beforeunload',
      destroyAll
    )
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    )
  } else {
    init()
  }

  return {
    init,
    injectAll,
    destroyAll
  }

})()
