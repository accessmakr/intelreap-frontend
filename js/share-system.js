// ─────────────────────────────────────────
// INTELREAP SHARE SYSTEM
// 16 platform share pills
// Neutral styling — no colored branding
// Toast on clipboard copy
// Injects into any .ndic-share-container
// ─────────────────────────────────────────

const ShareSystem = (() => {

  // ─────────────────────────────────────
  // TOAST NOTIFICATION
  // Uses #toast-container
  // ─────────────────────────────────────

  const showToast = (message, type = 'success') => {
    const container = document.getElementById(
      'toast-container'
    )
    if (!container) return

    const toast = document.createElement('div')
    toast.className = `ndic-toast ndic-toast--${type}`
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'polite')

    toast.innerHTML = `
      <span class="ndic-toast-icon">
        ${type === 'success' ? '✓' : '✕'}
      </span>
      <span class="ndic-toast-message">
        ${message}
      </span>
    `

    container.appendChild(toast)

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('ndic-toast--visible')
    })

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('ndic-toast--visible')
      toast.classList.add('ndic-toast--hiding')
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 400)
    }, 3000)
  }

  // ─────────────────────────────────────
  // SHARE PLATFORMS
  // All using window.location.href
  // and document.title dynamically
  // ─────────────────────────────────────

  const getPlatforms = () => {
    const url = encodeURIComponent(
      window.location.href
    )
    const title = encodeURIComponent(
      document.title
    )
    const shortTitle = encodeURIComponent(
      'Check what IntelReap reveals about your network and device — free real-time intelligence'
    )
    const hashtags = encodeURIComponent(
      'IntelReap,NetworkIntelligence,Privacy'
    )
    const rawUrl = window.location.href

    return [
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        url: `https://api.whatsapp.com/send?text=${shortTitle}%20${url}`,
        target: '_blank'
      },
      {
        id: 'facebook',
        label: 'Facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${shortTitle}`,
        target: '_blank'
      },
      {
        id: 'twitter',
        label: 'X',
        url: `https://twitter.com/intent/tweet?url=${url}&text=${shortTitle}&hashtags=${hashtags}`,
        target: '_blank'
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        target: '_blank'
      },
      {
        id: 'reddit',
        label: 'Reddit',
        url: `https://reddit.com/submit?url=${url}&title=${title}`,
        target: '_blank'
      },
      {
        id: 'quora',
        label: 'Quora',
        url: `https://www.quora.com/share?url=${url}&title=${title}`,
        target: '_blank'
      },
      {
        id: 'medium',
        label: 'Medium',
        url: `https://medium.com/new-story?url=${url}`,
        target: '_blank'
      },
      {
        id: 'instagram',
        label: 'Instagram',
        url: null,
        action: () => {
          copyToClipboard(rawUrl)
          showToast(
            'Link copied — paste it in Instagram',
            'success'
          )
        }
      },
      {
        id: 'tiktok',
        label: 'TikTok',
        url: null,
        action: () => {
          copyToClipboard(rawUrl)
          showToast(
            'Link copied — paste it in TikTok',
            'success'
          )
        }
      },
      {
        id: 'telegram',
        label: 'Telegram',
        url: `https://t.me/share/url?url=${url}&text=${shortTitle}`,
        target: '_blank'
      },
      {
        id: 'pinterest',
        label: 'Pinterest',
        url: `https://pinterest.com/pin/create/button/?url=${url}&description=${shortTitle}`,
        target: '_blank'
      },
      {
        id: 'discord',
        label: 'Discord',
        url: null,
        action: () => {
          copyToClipboard(
            `${decodeURIComponent(shortTitle)} ${rawUrl}`
          )
          showToast(
            'Copied for Discord',
            'success'
          )
        }
      },
      {
        id: 'vimeo',
        label: 'Vimeo',
        url: `https://vimeo.com/log_in?next=${url}`,
        target: '_blank'
      },
      {
        id: 'snapchat',
        label: 'Snapchat',
        url: `https://www.snapchat.com/scan?attachmentUrl=${url}`,
        target: '_blank'
      },
      {
        id: 'email',
        label: 'Email',
        url: `mailto:?subject=${title}&body=${shortTitle}%0A%0A${url}`,
        target: '_self'
      },
      {
        id: 'copy',
        label: 'Copy Link',
        url: null,
        action: () => {
          copyToClipboard(rawUrl)
          showToast(
            'Link copied to clipboard',
            'success'
          )
        }
      }
    ]
  }

  // ─────────────────────────────────────
  // CLIPBOARD COPY
  // ─────────────────────────────────────

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback
        const textarea =
          document.createElement('textarea')
        textarea.value = text
        textarea.style.cssText =
          'position:fixed;opacity:0;pointer-events:none;'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    } catch (error) {
      showToast('Copy failed — try manually', 'error')
    }
  }

  // ─────────────────────────────────────
  // BUILD SHARE BLOCK
  // ─────────────────────────────────────

  const buildShareBlock = (container) => {
    const platforms = getPlatforms()

    const wrapper = document.createElement('div')
    wrapper.className = 'ndic-share-wrapper'

    const label = document.createElement('div')
    label.className = 'ndic-share-label'
    label.textContent = 'Share this tool'
    wrapper.appendChild(label)

    const pillsRow = document.createElement('div')
    pillsRow.className = 'ndic-share-pills'

    platforms.forEach(platform => {
      const pill = document.createElement('button')
      pill.className = `ndic-share-pill ndic-share-pill--${platform.id}`
      pill.setAttribute('aria-label',
        `Share on ${platform.label}`
      )
      pill.setAttribute('type', 'button')
      pill.textContent = platform.label

      if (platform.url) {
        pill.addEventListener('click', () => {
          window.open(
            platform.url,
            platform.target === '_blank'
              ? '_blank'
              : '_self',
            'noopener,noreferrer,width=600,height=500'
          )
        })
      } else if (platform.action) {
        pill.addEventListener('click', () => {
          platform.action()

          // Visual feedback on pill
          pill.classList.add(
            'ndic-share-pill--copied'
          )
          setTimeout(() => {
            pill.classList.remove(
              'ndic-share-pill--copied'
            )
          }, 1500)
        })
      }

      pillsRow.appendChild(pill)
    })

    wrapper.appendChild(pillsRow)
    container.appendChild(wrapper)
  }

  // ─────────────────────────────────────
  // INJECT INTO ALL CONTAINERS
  // ─────────────────────────────────────

  const injectAll = () => {
    const containers = document.querySelectorAll(
      '.ndic-share-container'
    )
    containers.forEach(container => {
      // Only inject once
      if (container.dataset.shareInjected) return
      buildShareBlock(container)
      container.dataset.shareInjected = 'true'
    })
  }

  // ─────────────────────────────────────
  // NATIVE SHARE API
  // Falls back to pills if unavailable
  // ─────────────────────────────────────

  const nativeShare = async () => {
    if (!navigator.share) return false

    try {
      await navigator.share({
        title: document.title,
        text: 'Check what IntelReap reveals about your network and device.',
        url: window.location.href
      })
      return true
    } catch {
      return false
    }
  }

  // ─────────────────────────────────────
  // PUBLIC SHOW TOAST
  // Exposed so other systems can use it
  // ─────────────────────────────────────

  const toast = (message, type) => {
    showToast(message, type)
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────

  const init = () => {
    injectAll()

    // Also wire up any native share buttons
    document.querySelectorAll(
      '.ndic-native-share'
    ).forEach(btn => {
      btn.addEventListener('click', async () => {
        const used = await nativeShare()
        if (!used) {
          // Scroll to share pills
          const pills = document.querySelector(
            '.ndic-share-container'
          )
          if (pills) {
            pills.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
        }
      })
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

  return {
    init,
    injectAll,
    toast,
    copyToClipboard,
    nativeShare
  }

})()
