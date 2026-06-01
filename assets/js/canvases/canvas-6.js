// ─────────────────────────────────────────
// CANVAS 6 RENDERER
// Graphics Engine Panel
// How Powerful Is Your Device?
// ─────────────────────────────────────────

const Canvas6 = (() => {

  const render = () => {
    const g = STATE.graphics
    const s = STATE.scores

    setText('c6-gpu-vendor', g.gpuVendor || '—')
    setText('c6-gpu-renderer',
      g.gpuRenderer || '—'
    )

    // WebGL version badge
    const webglEl = el('c6-webgl-version')
    if (webglEl) {
      webglEl.textContent =
        g.webglVersion || 'Not Supported'
      webglEl.setAttribute(
        'data-version',
        String(g.webglVersionNumber || 0)
      )
      webglEl.style.color =
        g.webglVersionNumber === 2
          ? 'var(--color-score-excellent)'
          : g.webglVersionNumber === 1
          ? 'var(--color-score-good)'
          : 'var(--color-score-critical)'
    }

    setText('c6-webgl-support-level',
      g.webglSupportLevel || '—'
    )

    // Hardware acceleration badge
    const hwAccEl = el('c6-hardware-acceleration')
    if (hwAccEl) {
      hwAccEl.textContent =
        g.hardwareAcceleration || '—'
      hwAccEl.style.color =
        g.hardwareAcceleration === 'Enabled'
          ? 'var(--color-success)'
          : 'var(--color-danger)'
    }

    setText('c6-max-texture-size',
      g.maxTextureSize
        ? `${g.maxTextureSize}px`
        : '—'
    )

    setText('c6-max-viewport-size',
      g.maxViewportSize || '—'
    )

    setText('c6-shader-precision',
      g.shaderPrecision || '—'
    )

    setText('c6-extensions-count',
      g.extensionsCount !== null
        ? String(g.extensionsCount)
        : '—'
    )

    setText('c6-glsl-version', g.glslVersion || '—')

    setBooleanIndicator(
      'c6-antialiasing',
      g.antialiasingSupport,
      'Yes', 'No'
    )

    setText('c6-depth-buffer-bits',
      g.depthBufferBits !== null
        ? `${g.depthBufferBits}-bit`
        : '—'
    )

    setText('c6-stencil-buffer-bits',
      g.stencilBufferBits !== null
        ? `${g.stencilBufferBits}-bit`
        : '—'
    )

    setText('c6-max-anisotropy',
      g.maxAnisotropy !== null
        ? `${g.maxAnisotropy}x`
        : '—'
    )

    // WebGPU support
    setBooleanIndicator(
      'c6-webgpu-supported',
      g.webgpuSupported,
      'Supported', 'Not Supported'
    )

    if (g.webgpuAdapter) {
      setText('c6-webgpu-vendor',
        g.webgpuAdapter.vendor || '—'
      )
      setText('c6-webgpu-architecture',
        g.webgpuAdapter.architecture || '—'
      )
    }

    // Extension capabilities
    setBooleanIndicator(
      'c6-has-anisotropy',
      g.hasAnisotropy, 'Yes', 'No'
    )
    setBooleanIndicator(
      'c6-has-float-textures',
      g.hasFloatTextures, 'Yes', 'No'
    )
    setBooleanIndicator(
      'c6-has-depth-textures',
      g.hasDepthTextures, 'Yes', 'No'
    )
    setBooleanIndicator(
      'c6-has-draw-buffers',
      g.hasDrawBuffers, 'Yes', 'No'
    )
    setBooleanIndicator(
      'c6-has-instancing',
      g.hasInstancing, 'Yes', 'No'
    )
    setBooleanIndicator(
      'c6-has-compressed-textures',
      g.hasCompressedTextures, 'Yes', 'No'
    )

    // Rendering score
    const renderScoreEl = el('c6-rendering-score')
    if (renderScoreEl) {
      renderScoreEl.textContent =
        g.renderingScore !== null
          ? `${g.renderingScore}/100`
          : '—'
      renderScoreEl.style.color =
        getScoreColor(g.renderingScore || 0)
    }

    // Graphics tier badge
    const tierEl = el('c6-graphics-tier')
    if (tierEl) {
      tierEl.textContent = g.graphicsTier || '—'
      const tierColors = {
        'Ultra':    'var(--color-score-excellent)',
        'Advanced': 'var(--color-score-good)',
        'Standard': 'var(--color-score-fair)',
        'Basic':    'var(--color-score-poor)'
      }
      tierEl.style.color =
        tierColors[g.graphicsTier] ||
        'var(--color-text-muted)'
    }

    // Canvas score
    setText('c6-score',
      s.graphicsScore
        ? `${s.graphicsScore}/100`
        : '—'
    )
    setColor('c6-score',
      getScoreColor(s.graphicsScore || 0)
    )

    const deepDiveLink = el('c6-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas6
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas6
    }

    if (g.gpuVendor) {
      MonitoringEngine.revealCanvas('canvas-6')
    }
  }

  return { render }
})()
