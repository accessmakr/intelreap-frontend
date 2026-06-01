// ─────────────────────────────────────────
// CANVAS 10 RENDERER
// Browser & Rendering Speed Intelligence
// How Fast Does Your Device Render?
// ─────────────────────────────────────────

const Canvas10 = (() => {

  const renderVital = (
    valueId, ratingId, metric, value, rating
  ) => {
    const isCLS = metric === 'cls'

    const valueEl = el(valueId)
    if (valueEl) {
      valueEl.textContent = value !== null
        ? (isCLS ? value : `${value}ms`)
        : '—'
    }

    const ratingEl = el(ratingId)
    if (ratingEl) {
      ratingEl.textContent = rating || '—'
      ratingEl.style.color =
        getVitalColor(rating)
      ratingEl.setAttribute(
        'data-rating',
        (rating || '').toLowerCase()
          .replace(' ', '-')
      )
    }
  }

  const render = () => {
    const sp = STATE.speed
    const s  = STATE.scores

    // ─── CORE WEB VITALS ──────────────────

    renderVital(
      'c10-lcp-value', 'c10-lcp-rating',
      'lcp', sp.lcp, sp.lcpRating
    )
    renderVital(
      'c10-fcp-value', 'c10-fcp-rating',
      'fcp', sp.fcp, sp.fcpRating
    )
    renderVital(
      'c10-cls-value', 'c10-cls-rating',
      'cls', sp.cls, sp.clsRating
    )
    renderVital(
      'c10-inp-value', 'c10-inp-rating',
      'inp', sp.inp, sp.inpRating
    )
    renderVital(
      'c10-ttfb-value', 'c10-ttfb-rating',
      'ttfb', sp.ttfb, sp.ttfbRating
    )
    renderVital(
      'c10-fid-value', 'c10-fid-rating',
      'fid', sp.fid, sp.fidRating
    )

    // ─── BROWSER BENCHMARKS ───────────────

    const benchmarks = [
      ['c10-js-execution', sp.jsExecutionScore, sp.jsExecutionMs],
      ['c10-dom-manipulation', sp.domManipulationScore, sp.domManipulationMs],
      ['c10-canvas-render', sp.canvasRenderScore, sp.canvasRenderMs],
      ['c10-memory-access', sp.memoryAccessScore, sp.memoryAccessMs],
      ['c10-css-animation', sp.cssAnimationScore, null],
      ['c10-event-loop', sp.eventLoopScore, sp.eventLoopAvgMs]
    ]

    benchmarks.forEach(([prefix, score, ms]) => {
      const scoreEl = el(`${prefix}-score`)
      if (scoreEl) {
        scoreEl.textContent = score !== null
          ? `${score}/100`
          : '—'
        scoreEl.style.color =
          getScoreColor(score || 0)
      }

      if (ms !== null) {
        const msEl = el(`${prefix}-ms`)
        if (msEl) {
          msEl.textContent = ms !== null
            ? `${ms}ms`
            : '—'
        }
      }
    })

    // CSS Animation FPS
    setText('c10-css-animation-fps',
      sp.cssAnimationFPS !== null
        ? `${sp.cssAnimationFPS} FPS`
        : '—'
    )

    // Overall benchmark score
    const benchmarkEl =
      el('c10-benchmark-score')
    if (benchmarkEl) {
      benchmarkEl.textContent =
        sp.benchmarkScore !== null
          ? `${sp.benchmarkScore}/100`
          : '—'
      benchmarkEl.style.color =
        getScoreColor(sp.benchmarkScore || 0)
    }

    // ─── DEVICE COMPARISONS ───────────────

    setText('c10-vs-average-mobile',
      sp.vsAverageMobile || '—'
    )
    setText('c10-vs-average-desktop',
      sp.vsAverageDesktop || '—'
    )
    setText('c10-vs-top-tier',
      sp.vsTopTier || '—'
    )

    const rankEl = el('c10-percentile-ranking')
    if (rankEl) {
      rankEl.textContent =
        sp.percentileRanking || '—'
      rankEl.style.color =
        sp.percentileRanking?.includes('Top 5')
          ? 'var(--color-score-excellent)'
          : sp.percentileRanking?.includes('Top 25')
          ? 'var(--color-score-good)'
          : 'var(--color-text-secondary)'
    }

    // Speed score
    setText('c10-score',
      s.speedScore
        ? `${s.speedScore}/100`
        : '—'
    )
    setColor('c10-score',
      getScoreColor(s.speedScore || 0)
    )

    // ─── CHARTS ───────────────────────────
    ChartJSViz.updateCanvas10Charts()

    const deepDiveLink =
      el('c10-deep-dive-link')
    if (deepDiveLink) {
      deepDiveLink.href =
        NDIC_CONFIG.DEEP_DIVE_URLS.canvas10
      deepDiveLink.textContent =
        NDIC_CONFIG.DEEP_DIVE_LABELS.canvas10
    }

    if (
      sp.lcp !== null ||
      sp.benchmarkScore !== null
    ) {
      MonitoringEngine.revealCanvas('canvas-10')
    }
  }

  return { render }
})()
