// ─────────────────────────────────────────
// GRAPHICS INTELLIGENCE ENGINE
// Powers Canvas 6 — Graphics Engine Panel
// Complete GPU, WebGL and rendering
// capability detection
// ─────────────────────────────────────────

const GraphicsEngine = (() => {

  // ───────────────────────────────────────
  // WEBGL CONTEXT ACQUISITION
  // Tries WebGL2 first then WebGL1
  // ───────────────────────────────────────

  const acquireWebGLContext = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    const contextOptions = {
      antialias: true,
      depth: true,
      stencil: true,
      alpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    }

    // Try WebGL2 first
    let gl = canvas.getContext(
      'webgl2',
      contextOptions
    )
    let version = 2

    if (!gl) {
      // Fall back to WebGL1
      gl = canvas.getContext(
        'webgl',
        contextOptions
      ) || canvas.getContext(
        'experimental-webgl',
        contextOptions
      )
      version = gl ? 1 : 0
    }

    return { gl, version, canvas }
  }

  // ───────────────────────────────────────
  // GPU VENDOR AND RENDERER EXTRACTION
  // ───────────────────────────────────────

  const extractGPUInfo = (gl) => {
    if (!gl) {
      return {
        gpuVendor: 'Not Available',
        gpuRenderer: 'Not Available',
        gpuVendorRaw: null,
        gpuRendererRaw: null
      }
    }

    // Try debug renderer info extension
    const debugInfo = gl.getExtension(
      'WEBGL_debug_renderer_info'
    )

    let vendorRaw = null
    let rendererRaw = null

    if (debugInfo) {
      vendorRaw = gl.getParameter(
        debugInfo.UNMASKED_VENDOR_WEBGL
      )
      rendererRaw = gl.getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL
      )
    }

    // Fall back to masked values
    if (!vendorRaw) {
      vendorRaw = gl.getParameter(gl.VENDOR)
    }
    if (!rendererRaw) {
      rendererRaw = gl.getParameter(gl.RENDERER)
    }

    return {
      gpuVendor: normalizeGPUVendor(vendorRaw),
      gpuRenderer: normalizeGPURenderer(
        rendererRaw
      ),
      gpuVendorRaw: vendorRaw,
      gpuRendererRaw: rendererRaw
    }
  }

  // Normalize vendor string to clean name
  const normalizeGPUVendor = (raw) => {
    if (!raw) return 'Unknown'
    const r = raw.toLowerCase()

    if (r.includes('nvidia')) return 'NVIDIA'
    if (r.includes('amd') ||
        r.includes('ati')) return 'AMD'
    if (r.includes('intel')) return 'Intel'
    if (r.includes('apple')) return 'Apple'
    if (r.includes('qualcomm') ||
        r.includes('adreno')) return 'Qualcomm'
    if (r.includes('arm') ||
        r.includes('mali')) return 'ARM'
    if (r.includes('imagination') ||
        r.includes('powervr')) {
      return 'Imagination Technologies'
    }
    if (r.includes('vivante')) return 'Vivante'
    if (r.includes('broadcom')) return 'Broadcom'
    if (r.includes('microsoft') ||
        r.includes('warp')) {
      return 'Microsoft (Software Render)'
    }
    if (r.includes('google')) return 'Google'
    if (r.includes('mesa') ||
        r.includes('llvmpipe') ||
        r.includes('softpipe')) {
      return 'Mesa (Software Render)'
    }

    // Return first significant word
    // if no match found
    const words = raw.trim().split(/\s+/)
    return words[0] || raw
  }

  // Normalize renderer string
  const normalizeGPURenderer = (raw) => {
    if (!raw) return 'Unknown'

    // Remove noise patterns
    return raw
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/OpenGL.*$/i, '')
      .replace(/Direct3D.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim() || raw
  }

  // ───────────────────────────────────────
  // WEBGL PARAMETER COLLECTION
  // ───────────────────────────────────────

  const collectWebGLParameters = (gl) => {
    if (!gl) return {}

    const safeGet = (param) => {
      try {
        return gl.getParameter(param)
      } catch {
        return null
      }
    }

    return {
      maxTextureSize: safeGet(
        gl.MAX_TEXTURE_SIZE
      ),
      maxViewportDims: safeGet(
        gl.MAX_VIEWPORT_DIMS
      ),
      maxRenderbufferSize: safeGet(
        gl.MAX_RENDERBUFFER_SIZE
      ),
      maxCombinedTextureImageUnits: safeGet(
        gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
      ),
      maxTextureImageUnits: safeGet(
        gl.MAX_TEXTURE_IMAGE_UNITS
      ),
      maxVertexTextureImageUnits: safeGet(
        gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS
      ),
      maxVertexAttribs: safeGet(
        gl.MAX_VERTEX_ATTRIBS
      ),
      maxVertexUniformVectors: safeGet(
        gl.MAX_VERTEX_UNIFORM_VECTORS
      ),
      maxFragmentUniformVectors: safeGet(
        gl.MAX_FRAGMENT_UNIFORM_VECTORS
      ),
      maxVaryingVectors: safeGet(
        gl.MAX_VARYING_VECTORS
      ),
      maxCubeMapTextureSize: safeGet(
        gl.MAX_CUBE_MAP_TEXTURE_SIZE
      ),
      depthBits: safeGet(
        gl.DEPTH_BITS
      ),
      stencilBits: safeGet(
        gl.STENCIL_BITS
      ),
      alphaBits: safeGet(
        gl.ALPHA_BITS
      ),
      redBits: safeGet(
        gl.RED_BITS
      ),
      greenBits: safeGet(
        gl.GREEN_BITS
      ),
      blueBits: safeGet(
        gl.BLUE_BITS
      )
    }
  }

  // ───────────────────────────────────────
  // SHADER PRECISION DETECTION
  // ───────────────────────────────────────

  const detectShaderPrecision = (gl) => {
    if (!gl) return 'Not Available'

    const precisionTypes = [
      'highp', 'mediump', 'lowp'
    ]
    const shaderTypes = [
      gl.VERTEX_SHADER,
      gl.FRAGMENT_SHADER
    ]

    let highPrecisionSupported = false
    let mediumPrecisionSupported = false

    for (const shaderType of shaderTypes) {
      for (const precision of precisionTypes) {
        try {
          const info = gl.getShaderPrecisionFormat(
            shaderType,
            precision === 'highp'
              ? gl.HIGH_FLOAT
              : precision === 'mediump'
              ? gl.MEDIUM_FLOAT
              : gl.LOW_FLOAT
          )
          if (info && info.precision > 0) {
            if (precision === 'highp') {
              highPrecisionSupported = true
            }
            if (precision === 'mediump') {
              mediumPrecisionSupported = true
            }
          }
        } catch {
          // Continue
        }
      }
    }

    if (highPrecisionSupported) return 'High'
    if (mediumPrecisionSupported) return 'Medium'
    return 'Low'
  }

  // ───────────────────────────────────────
  // EXTENSION DETECTION
  // ───────────────────────────────────────

  const collectExtensions = (gl) => {
    if (!gl) return { count: 0, list: [] }

    try {
      const extensions =
        gl.getSupportedExtensions() || []
      return {
        count: extensions.length,
        list: extensions,
        hasAnisotropy: extensions.some(e =>
          e.includes('texture_filter_anisotropic')
        ),
        hasFloatTextures: extensions.some(e =>
          e.includes('OES_texture_float')
        ),
        hasDepthTextures: extensions.some(e =>
          e.includes('WEBGL_depth_texture')
        ),
        hasDrawBuffers: extensions.some(e =>
          e.includes('WEBGL_draw_buffers')
        ),
        hasInstancing: extensions.some(e =>
          e.includes('ANGLE_instanced_arrays')
        ),
        hasVAO: extensions.some(e =>
          e.includes('OES_vertex_array_object')
        ),
        hasCompressedTextures: extensions.some(e =>
          e.includes('texture_compression')
        )
      }
    } catch {
      return { count: 0, list: [] }
    }
  }

  // ───────────────────────────────────────
  // MAX ANISOTROPY DETECTION
  // ───────────────────────────────────────

  const detectMaxAnisotropy = (gl) => {
    if (!gl) return null

    try {
      const ext = gl.getExtension(
        'EXT_texture_filter_anisotropic'
      ) || gl.getExtension(
        'MOZ_EXT_texture_filter_anisotropic'
      ) || gl.getExtension(
        'WEBKIT_EXT_texture_filter_anisotropic'
      )

      if (ext) {
        return gl.getParameter(
          ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT
        )
      }
    } catch {
      // Continue
    }

    return null
  }

  // ───────────────────────────────────────
  // GLSL VERSION DETECTION
  // ───────────────────────────────────────

  const detectGLSLVersion = (gl, version) => {
    if (!gl) return 'Not Available'

    try {
      const glslVersion = gl.getParameter(
        gl.SHADING_LANGUAGE_VERSION
      )
      return glslVersion || (
        version === 2
          ? 'GLSL ES 3.00'
          : 'GLSL ES 1.00'
      )
    } catch {
      return version === 2
        ? 'GLSL ES 3.00'
        : 'GLSL ES 1.00'
    }
  }

  // ───────────────────────────────────────
  // HARDWARE ACCELERATION DETECTION
  // ───────────────────────────────────────

  const detectHardwareAcceleration = (
    vendorRaw
  ) => {
    if (!vendorRaw) return 'Unknown'

    const v = vendorRaw.toLowerCase()

    // Software renderers
    const softwareIndicators = [
      'microsoft basic render',
      'warp',
      'llvmpipe',
      'softpipe',
      'mesa offscreen',
      'software',
      'swiftshader'
    ]

    const isSoftware = softwareIndicators.some(
      indicator => v.includes(indicator)
    )

    return isSoftware ? 'Disabled' : 'Enabled'
  }

  // ───────────────────────────────────────
  // ANTIALIASING DETECTION
  // ───────────────────────────────────────

  const detectAntialiasing = (gl) => {
    if (!gl) return false

    try {
      return gl.getContextAttributes()
        ?.antialias || false
    } catch {
      return false
    }
  }

  // ───────────────────────────────────────
  // WEBGL2 SPECIFIC PARAMETERS
  // ───────────────────────────────────────

  const collectWebGL2Parameters = (gl) => {
    if (!gl) return {}

    const safeGet = (param) => {
      try {
        return gl.getParameter(param)
      } catch {
        return null
      }
    }

    return {
      maxColorAttachments: safeGet(
        gl.MAX_COLOR_ATTACHMENTS
      ),
      maxDrawBuffers: safeGet(
        gl.MAX_DRAW_BUFFERS
      ),
      maxSamples: safeGet(
        gl.MAX_SAMPLES
      ),
      maxUniformBlockSize: safeGet(
        gl.MAX_UNIFORM_BLOCK_SIZE
      ),
      maxVertexUniformBlocks: safeGet(
        gl.MAX_VERTEX_UNIFORM_BLOCKS
      ),
      maxFragmentUniformBlocks: safeGet(
        gl.MAX_FRAGMENT_UNIFORM_BLOCKS
      ),
      maxTransformFeedbackSeparateComponents:
        safeGet(
          gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS
        ),
      max3DTextureSize: safeGet(
        gl.MAX_3D_TEXTURE_SIZE
      ),
      maxArrayTextureLayers: safeGet(
        gl.MAX_ARRAY_TEXTURE_LAYERS
      )
    }
  }

  // ───────────────────────────────────────
  // WEBGPU DETECTION
  // ───────────────────────────────────────

  const detectWebGPU = async () => {
    if (!navigator.gpu) {
      return {
        webgpuSupported: false,
        webgpuAdapter: null
      }
    }

    try {
      const adapter =
        await navigator.gpu.requestAdapter()

      if (!adapter) {
        return {
          webgpuSupported: false,
          webgpuAdapter: null
        }
      }

      const info = adapter.info ||
        await adapter.requestAdapterInfo?.()

      return {
        webgpuSupported: true,
        webgpuAdapter: {
          vendor: info?.vendor || 'Unknown',
          architecture:
            info?.architecture || 'Unknown',
          device: info?.device || 'Unknown',
          description:
            info?.description || null
        }
      }
    } catch {
      return {
        webgpuSupported: false,
        webgpuAdapter: null
      }
    }
  }

  // ───────────────────────────────────────
  // CANVAS 2D DETECTION
  // ───────────────────────────────────────

  const detectCanvas2D = () => {
    try {
      const canvas =
        document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      return ctx !== null
    } catch {
      return false
    }
  }

  // ───────────────────────────────────────
  // OFFSCREEN CANVAS DETECTION
  // ───────────────────────────────────────

  const detectOffscreenCanvas = () => {
    return typeof OffscreenCanvas !== 'undefined'
  }

  // ───────────────────────────────────────
  // RENDERING SCORE COMPUTATION
  // ───────────────────────────────────────

  const computeRenderingScore = ({
    webglVersion,
    hardwareAcceleration,
    shaderPrecision,
    maxTextureSize,
    extensionsCount,
    maxAnisotropy,
    webgpuSupported,
    antialiasing,
    glslVersion
  }) => {
    let score = 0

    // WebGL version (max 30 points)
    if (webglVersion === 2) score += 30
    else if (webglVersion === 1) score += 15
    // 0 = no WebGL

    // Hardware acceleration (max 25 points)
    if (hardwareAcceleration === 'Enabled') {
      score += 25
    }

    // Shader precision (max 15 points)
    if (shaderPrecision === 'High') score += 15
    else if (shaderPrecision === 'Medium') {
      score += 8
    }

    // Texture size (max 10 points)
    if (maxTextureSize >= 16384) score += 10
    else if (maxTextureSize >= 8192) score += 7
    else if (maxTextureSize >= 4096) score += 4
    else if (maxTextureSize >= 2048) score += 2

    // Extensions (max 10 points)
    if (extensionsCount >= 40) score += 10
    else if (extensionsCount >= 25) score += 7
    else if (extensionsCount >= 15) score += 4
    else if (extensionsCount >= 5) score += 2

    // Anisotropy (max 5 points)
    if (maxAnisotropy >= 16) score += 5
    else if (maxAnisotropy >= 8) score += 3
    else if (maxAnisotropy > 0) score += 1

    // WebGPU (max 5 points)
    if (webgpuSupported) score += 5

    return Math.min(100, Math.max(0, score))
  }

  // ───────────────────────────────────────
  // GRAPHICS TIER FROM SCORE
  // ───────────────────────────────────────

  const computeGraphicsTier = (score) => {
    return getGraphicsTier(score)
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem('INFO', 'Graphics engine collecting')

    const { gl, version, canvas } =
      acquireWebGLContext()

    // GPU identity
    const gpuInfo = extractGPUInfo(gl)

    // WebGL parameters
    const params = collectWebGLParameters(gl)

    // Shader precision
    const shaderPrecision =
      detectShaderPrecision(gl)

    // Extensions
    const extensions = collectExtensions(gl)

    // Anisotropy
    const maxAnisotropy =
      detectMaxAnisotropy(gl)

    // GLSL version
    const glslVersion = detectGLSLVersion(
      gl, version
    )

    // Hardware acceleration
    const hardwareAcceleration =
      detectHardwareAcceleration(
        gpuInfo.gpuVendorRaw
      )

    // Antialiasing
    const antialiasingSupport =
      detectAntialiasing(gl)

    // WebGL2 specific
    const webgl2Params = version === 2
      ? collectWebGL2Parameters(gl)
      : {}

    // WebGPU (async)
    const webgpuData = await detectWebGPU()

    // Canvas 2D
    const canvas2d = detectCanvas2D()

    // OffscreenCanvas
    const offscreenCanvas =
      detectOffscreenCanvas()

    // Max viewport dimensions
    const maxViewportDims = params.maxViewportDims
    const maxViewportSize = maxViewportDims
      ? `${maxViewportDims[0]} x ${maxViewportDims[1]}`
      : null

    // Compute rendering score
    const renderingScore = computeRenderingScore({
      webglVersion: version,
      hardwareAcceleration: hardwareAcceleration,
      shaderPrecision: shaderPrecision,
      maxTextureSize: params.maxTextureSize,
      extensionsCount: extensions.count,
      maxAnisotropy: maxAnisotropy,
      webgpuSupported: webgpuData.webgpuSupported,
      antialiasing: antialiasingSupport
    })

    // Compute graphics tier
    const graphicsTier =
      computeGraphicsTier(renderingScore)

    // WebGL version label
    const webglVersionLabel = version === 2
      ? 'WebGL 2.0'
      : version === 1
      ? 'WebGL 1.0'
      : 'Not Supported'

    // WebGL support level
    const webglSupportLevel = version === 2
      ? 'Full WebGL 2.0 Support'
      : version === 1
      ? 'WebGL 1.0 Support Only'
      : 'No WebGL Support'

    const graphicsData = {
      // GPU identity
      gpuVendor: gpuInfo.gpuVendor,
      gpuRenderer: gpuInfo.gpuRenderer,
      gpuVendorRaw: gpuInfo.gpuVendorRaw,
      gpuRendererRaw: gpuInfo.gpuRendererRaw,

      // WebGL version
      webglVersion: webglVersionLabel,
      webglVersionNumber: version,
      webglSupportLevel: webglSupportLevel,

      // Hardware state
      hardwareAcceleration: hardwareAcceleration,

      // Texture and viewport
      maxTextureSize: params.maxTextureSize,
      maxViewportSize: maxViewportSize,
      maxCubeMapTextureSize:
        params.maxCubeMapTextureSize,

      // Shader capabilities
      shaderPrecision: shaderPrecision,
      glslVersion: glslVersion,

      // Extensions
      extensionsCount: extensions.count,
      supportedExtensions: extensions.list,
      hasAnisotropy: extensions.hasAnisotropy,
      hasFloatTextures:
        extensions.hasFloatTextures,
      hasDepthTextures:
        extensions.hasDepthTextures,
      hasDrawBuffers: extensions.hasDrawBuffers,
      hasInstancing: extensions.hasInstancing,
      hasVAO: extensions.hasVAO,
      hasCompressedTextures:
        extensions.hasCompressedTextures,

      // Antialiasing
      antialiasingSupport: antialiasingSupport,

      // Depth and stencil
      depthBufferBits: params.depthBits,
      stencilBufferBits: params.stencilBits,

      // Anisotropy
      maxAnisotropy: maxAnisotropy,

      // Vertex and fragment limits
      maxVertexAttribs: params.maxVertexAttribs,
      maxVertexUniformVectors:
        params.maxVertexUniformVectors,
      maxFragmentUniformVectors:
        params.maxFragmentUniformVectors,
      maxVaryingVectors: params.maxVaryingVectors,

      // WebGL2 specific
      ...webgl2Params,

      // WebGPU
      webgpuSupported: webgpuData.webgpuSupported,
      webgpuAdapter: webgpuData.webgpuAdapter,

      // Additional canvas capabilities
      canvas2dSupport: canvas2d,
      offscreenCanvasSupport: offscreenCanvas,

      // Computed scores
      renderingScore: renderingScore,
      graphicsTier: graphicsTier
    }

    // Clean up WebGL context
    // Prevent memory leaks
    try {
      const ext = gl?.getExtension(
        'WEBGL_lose_context'
      )
      if (ext) ext.loseContext()
      canvas?.remove()
    } catch {
      // Continue
    }

    // Update STATE
    updateGraphics(graphicsData)
    markEngineComplete('graphics')

    logDevice(
      'INFO',
      `GPU: ${graphicsData.gpuVendor} — ` +
      `${graphicsData.webglVersion} — ` +
      `${graphicsData.graphicsTier} tier — ` +
      `Score: ${graphicsData.renderingScore}`
    )

    return graphicsData
  }

  return {
    collect,
    acquireWebGLContext,
    extractGPUInfo,
    collectWebGLParameters,
    detectShaderPrecision,
    collectExtensions,
    computeRenderingScore,
    computeGraphicsTier
  }

})()
