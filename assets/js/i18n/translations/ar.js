window.NDIC_TRANSLATIONS_AR = {
  meta: {
    title: 'IntelReap — مركز استخبارات الشبكة والأجهزة',
    description: 'استخبارات الشبكة والأجهزة في الوقت الفعلي. اكشف عن عنوان IP وASN وحالة VPN وقدرات المتصفح والوضع الأمني. مجاني.',
    og_title: 'IntelReap — اكتشف ما تكشفه شبكتك',
    og_description: 'أداة استخبارات مجانية في الوقت الفعلي. حلّل شبكتك وجهازك وأمانك ومتصفحك في ثوانٍ.'
  },
  nav: {
    intelligence_center: 'مركز الاستخبارات',
    about: 'حول',
    search_placeholder: 'ابحث في لوحات الاستخبارات...',
    open_search: 'فتح البحث',
    toggle_menu: 'تبديل القائمة',
    close_menu: 'إغلاق القائمة',
    switch_language: 'تغيير اللغة',
    install_app: 'تثبيت التطبيق'
  },
  hero: {
    badge: 'أداة استخبارات مجانية',
    title_line1: 'ماذا تكشف',
    title_line2: 'شبكتك؟',
    tagline: 'استخبارات الشبكة والأجهزة في الوقت الفعلي. اكشف فوراً عن بنية IP الخاصة بك وASN وحالة VPN وأمان المتصفح وبصمة الجهاز الكاملة. لا تسجيل. لا تخزين للبيانات.',
    cta_primary: 'تشغيل فحص الاستخبارات',
    cta_secondary: 'شاهد كيف يعمل',
    trust_rating: '4.9★ رضا',
    trust_data_points: '234 نقطة بيانات لكل فحص',
    trust_panels: '12 لوحة استخبارات',
    trust_privacy: 'صفر بيانات مخزنة'
  },
  quick_answer: {
    label: 'إجابة سريعة',
    title: 'ما هو مركز استخبارات الشبكة والأجهزة؟',
    body: 'NDIC أداة مجانية تعمل في المتصفح تحلّل بنية شبكتك وبصمة جهازك والوضع الأمني وقدرات المتصفح في الوقت الفعلي. تجمع 234 نقطة بيانات عبر 12 لوحة استخبارات دون تخزين أي بيانات أو الحاجة إلى تسجيل الدخول.'
  },
  tool_header: {
    title: 'NDIC',
    subtitle: 'مركز استخبارات الشبكة والأجهزة',
    status_live: 'مباشر',
    status_scanning: 'جارٍ الفحص',
    status_offline: 'غير متصل',
    status_degraded: 'متدهور',
    last_scan: 'آخر فحص',
    next_refresh: 'التحديث القادم',
    api_calls: 'استدعاءات API'
  },
  canvas1: {
    heading_technical: 'استخبارات مسار ASN والشبكة',
    heading_plain: 'على أي شبكة أنت؟',
    params: {
      asn_number: 'رقم ASN',
      asn_owner: 'مالك ASN',
      asn_type: 'نوع ASN',
      network_tier: 'مستوى الشبكة',
      ip_range: 'نطاق IP',
      allocation_registry: 'سجل التخصيص',
      route_origin: 'أصل المسار',
      peering_count: 'عدد الاقترانات المقدرة',
      upstream_provider: 'المزود الأعلى',
      announcement_status: 'حالة الإعلان',
      bgp_route_status: 'حالة مسار BGP',
      network_health: 'نقاط صحة الشبكة',
      classification_source: 'مصدر التصنيف',
      classification_confidence: 'ثقة التصنيف',
      known_provider: 'المزود المعروف',
      peeringdb_traffic: 'حركة PeeringDB',
      peeringdb_prefixes4: 'بادئات IPv4',
      peeringdb_prefixes6: 'بادئات IPv6',
      is_hosting: 'بنية تحتية للاستضافة',
      is_mobile: 'شبكة محمولة',
      is_proxy: 'تم اكتشاف بروكسي'
    },
    deep_dive: 'تحليل معمق لبنيتك التحتية للشبكة'
  },
  canvas2: {
    heading_technical: 'لوحة هوية الشبكة',
    heading_plain: 'من أنت على الإنترنت؟',
    params: {
      public_ip: 'عنوان IP العام',
      ip_version: 'إصدار IP',
      isp: 'مزود خدمة الإنترنت',
      organization: 'المنظمة',
      country: 'البلد',
      country_code: 'رمز البلد',
      region: 'المنطقة',
      city: 'المدينة',
      postal: 'الرمز البريدي',
      coordinates: 'الإحداثيات',
      latitude: 'خط العرض',
      longitude: 'خط الطول',
      timezone: 'المنطقة الزمنية',
      utc_offset: 'إزاحة UTC',
      connection_type: 'نوع الاتصال',
      mobile_flag: 'اتصال محمول',
      proxy_flag: 'تم اكتشاف بروكسي',
      hosting_flag: 'بنية تحتية للاستضافة',
      continent: 'القارة',
      data_source: 'مصدر البيانات'
    },
    deep_dive: 'تحليل معمق لهوية شبكتك'
  },
  canvas3: {
    heading_technical: 'استخبارات VPN والبروكسي والتوجيه',
    heading_plain: 'هل أنت مختفٍ على الإنترنت؟',
    params: {
      vpn_detected: 'تم اكتشاف VPN',
      proxy_detected: 'تم اكتشاف بروكسي',
      tor_detected: 'تم اكتشاف TOR',
      datacenter_detected: 'مسار مركز بيانات',
      ip_classification: 'تصنيف IP',
      asn_ownership_type: 'نوع ملكية ASN',
      timezone_match: 'تطابق المنطقة الزمنية',
      language_match: 'تطابق اللغة',
      webrtc_match: 'تطابق WebRTC',
      reverse_dns_match: 'تطابق DNS العكسي',
      fraud_score: 'نقاط الاحتيال',
      abuse_score: 'نقاط الإساءة',
      bot_detected: 'تم اكتشاف بوت',
      trust_score: 'نقاط الثقة',
      route_classification: 'تصنيف المسار',
      detection_flags: 'علامات الكشف',
      primary_source: 'المصدر الأساسي',
      confidence: 'مستوى الثقة',
      paid_api_consulted: 'تم استشارة API مدفوعة'
    },
    values: {
      vpn_yes: 'نعم',
      vpn_no: 'لا',
      vpn_maybe: 'ربما',
      route_clean: 'نظيف',
      route_suspect: 'مشبوه',
      route_high_risk: 'عالي الخطورة'
    },
    deep_dive: 'تحليل معمق لـ VPN والتوجيه'
  },
  canvas4: {
    heading_technical: 'مراقب الشبكة المباشر',
    heading_plain: 'ما مدى سرعة اتصالك؟',
    params: {
      current_rtt: 'زمن الاستجابة الحالي',
      average_rtt: 'متوسط زمن الاستجابة',
      peak_rtt: 'أعلى زمن استجابة',
      lowest_rtt: 'أدنى زمن استجابة',
      bandwidth: 'تقدير النطاق الترددي',
      effective_type: 'نوع الاتصال الفعلي',
      save_data: 'وضع توفير البيانات',
      stability_index: 'مؤشر الاستقرار',
      packet_loss: 'تقدير فقدان الحزم',
      quality_rating: 'جودة الاتصال',
      jitter_estimate: 'تقدير الاهتزاز',
      uptime: 'وقت التشغيل منذ التحميل',
      connection_changes: 'تغييرات الاتصال',
      api_available: 'API الشبكة'
    },
    deep_dive: 'تحليل معمق لشبكتك المباشرة'
  },
  canvas5: {
    heading_technical: 'لوحة استخبارات الجهاز',
    heading_plain: 'ما الجهاز الذي تستخدمه؟',
    params: {
      os: 'نظام التشغيل',
      os_version: 'إصدار النظام',
      browser: 'المتصفح',
      browser_version: 'إصدار المتصفح',
      browser_engine: 'محرك العرض',
      device_type: 'نوع الجهاز',
      device_brand: 'علامة الجهاز التجارية',
      cpu_cores: 'أنوية المعالج',
      ram_estimate: 'تقدير الذاكرة العشوائية',
      screen_width: 'عرض الشاشة',
      screen_height: 'ارتفاع الشاشة',
      viewport_width: 'عرض نافذة العرض',
      viewport_height: 'ارتفاع نافذة العرض',
      pixel_ratio: 'نسبة البكسل',
      color_depth: 'عمق اللون',
      color_gamut: 'نطاق الألوان',
      hdr_support: 'دعم HDR',
      touch_support: 'دعم اللمس',
      max_touch_points: 'أقصى نقاط لمس',
      orientation_support: 'دعم الاتجاه',
      orientation: 'الاتجاه الحالي',
      pointer_support: 'أحداث المؤشر',
      vibration_support: 'دعم الاهتزاز',
      architecture: 'معمارية المعالج',
      bitness: 'نظام البت',
      detection_source: 'طريقة الكشف',
      capability_tier: 'مستوى القدرة'
    },
    deep_dive: 'تحليل معمق لجهازك'
  },
  canvas6: {
    heading_technical: 'لوحة محرك الرسومات',
    heading_plain: 'ما مدى قوة جهازك؟',
    params: {
      gpu_vendor: 'مصنّع GPU',
      gpu_renderer: 'عارض GPU',
      webgl_version: 'إصدار WebGL',
      webgl_support_level: 'مستوى دعم WebGL',
      hardware_acceleration: 'تسريع الأجهزة',
      max_texture_size: 'أقصى حجم نسيج',
      max_viewport_size: 'أبعاد نافذة العرض القصوى',
      shader_precision: 'دقة التظليل',
      extensions_count: 'الامتدادات المدعومة',
      glsl_version: 'إصدار GLSL',
      antialiasing: 'مكافحة التشرذم',
      depth_buffer_bits: 'عمق المخزن المؤقت',
      stencil_buffer_bits: 'مخزن الاستنسل',
      max_anisotropy: 'أقصى تباين الاتجاه',
      webgpu_supported: 'دعم WebGPU',
      webgpu_vendor: 'مصنّع WebGPU',
      webgpu_architecture: 'معمارية WebGPU',
      has_anisotropy: 'ترشيح متباين الاتجاه',
      has_float_textures: 'نسيج عائم',
      has_depth_textures: 'نسيج عمق',
      has_draw_buffers: 'مخازن الرسم',
      has_instancing: 'تسريع المثيلات',
      has_compressed_textures: 'نسيج مضغوط',
      rendering_score: 'نقاط العرض',
      graphics_tier: 'مستوى الرسومات'
    },
    deep_dive: 'تحليل معمق لمحرك الرسومات'
  },
  canvas7: {
    heading_technical: 'لوحة الأمان والخصوصية',
    heading_plain: 'ما مدى أمانك الآن؟',
    params: {
      https_status: 'حالة HTTPS',
      secure_context: 'سياق آمن',
      mixed_content: 'محتوى مختلط',
      webrtc_exposure: 'تعرض WebRTC',
      local_ip: 'IP المحلي المكشوف',
      webrtc_ip_match: 'تطابق IP WebRTC',
      cookie_access: 'الوصول لملفات تعريف الارتباط',
      localstorage_access: 'التخزين المحلي',
      sessionstorage_access: 'تخزين الجلسة',
      indexeddb_access: 'الوصول لـ IndexedDB',
      camera_permission: 'إذن الكاميرا',
      microphone_permission: 'إذن الميكروفون',
      location_permission: 'إذن الموقع',
      notification_permission: 'إذن الإشعارات',
      clipboard_read: 'قراءة الحافظة',
      clipboard_write: 'كتابة الحافظة',
      push_permission: 'إذن الدفع',
      do_not_track: 'عدم التتبع',
      third_party_cookies: 'ملفات تعريف ارتباط الطرف الثالث',
      referrer_policy: 'سياسة المُحيل',
      csp_presence: 'سياسة أمان المحتوى',
      fingerprint_surfaces: 'أسطح البصمة الرقمية',
      security_flags: 'أعلام الأمان',
      security_warnings: 'تحذيرات الأمان',
      security_score: 'نقاط الأمان',
      risk_level: 'مستوى الخطر'
    },
    deep_dive: 'تحليل معمق لأمانك وخصوصيتك'
  },
  canvas8: {
    heading_technical: 'مصفوفة القدرات',
    heading_plain: 'ما الذي يستطيع متصفحك فعله؟',
    params: {
      capability_score: 'نقاط القدرة',
      capability_count: 'الميزات المدعومة',
      storage_quota: 'حصة التخزين',
      storage_usage: 'التخزين المستخدم',
      battery_charging: 'شحن البطارية',
      battery_level: 'مستوى البطارية',
      notification_permission: 'إذن الإشعارات'
    },
    categories: {
      ai_compute: 'الذكاء الاصطناعي والحوسبة',
      communication: 'التواصل',
      storage: 'التخزين',
      rendering: 'العرض',
      system: 'النظام'
    },
    values: {
      supported: 'مدعوم',
      not_supported: 'غير مدعوم'
    },
    deep_dive: 'تحليل معمق لقدرات متصفحك'
  },
  canvas9: {
    heading_technical: 'لوحة استخبارات الأداء',
    heading_plain: 'ما مدى سرعة متصفحك؟',
    params: {
      page_load_time: 'وقت تحميل الصفحة',
      dom_content_loaded: 'اكتمال تحميل DOM',
      dom_interactive: 'DOM تفاعلي',
      ttfb: 'الوقت حتى أول بايت (TTFB)',
      dns_lookup: 'بحث DNS',
      tcp_connection: 'اتصال TCP',
      tls_handshake: 'مصافحة TLS',
      request_time: 'وقت الطلب',
      response_time: 'وقت الاستجابة',
      dom_processing: 'معالجة DOM',
      resource_fetch_time: 'وقت جلب الموارد',
      resource_count: 'إجمالي الموارد',
      page_weight: 'حجم الصفحة',
      script_count: 'السكريبتات المحملة',
      stylesheet_count: 'أوراق الأنماط المحملة',
      image_count: 'الصور المحملة',
      font_count: 'الخطوط المحملة',
      cache_hit_rate: 'معدل نجاح التخزين المؤقت',
      heap_used: 'كومة JS المستخدمة',
      heap_total: 'إجمالي كومة JS',
      heap_limit: 'حد كومة JS',
      protocol: 'بروتوكول الشبكة',
      runtime_score: 'نقاط وقت التشغيل',
      percentile_rating: 'بيرسنتايل الأداء',
      timing_source: 'API التوقيت'
    },
    deep_dive: 'تحليل معمق لأدائك'
  },
  canvas10: {
    heading_technical: 'استخبارات سرعة العرض في المتصفح',
    heading_plain: 'ما مدى سرعة عرض جهازك؟',
    vitals: {
      lcp: 'أكبر رسم للمحتوى',
      fcp: 'أول رسم للمحتوى',
      cls: 'تراكم تحول التخطيط',
      inp: 'التفاعل حتى الرسم التالي',
      ttfb: 'الوقت حتى أول بايت',
      fid: 'تأخير أول مدخل'
    },
    benchmarks: {
      js_execution: 'تنفيذ JS',
      dom_manipulation: 'معالجة DOM',
      canvas_render: 'عرض Canvas',
      memory_access: 'الوصول للذاكرة',
      css_animation: 'رسوم CSS المتحركة',
      event_loop: 'حلقة الأحداث'
    },
    params: {
      css_animation_fps: 'إطارات الرسوم المتحركة في الثانية',
      benchmark_score: 'نقاط المعيار الإجمالي',
      vs_average_mobile: 'مقارنة بالجوال المتوسط',
      vs_average_desktop: 'مقارنة بالكمبيوتر المتوسط',
      vs_top_tier: 'مقارنة بالأجهزة العليا',
      percentile_ranking: 'بيرسنتايل السرعة'
    },
    ratings: {
      good: 'جيد',
      needs_improvement: 'يحتاج تحسين',
      poor: 'ضعيف',
      unknown: 'غير معروف'
    },
    deep_dive: 'تحليل معمق لسرعة العرض'
  },
  canvas11: {
    heading_technical: 'لوحة النتائج الاستخباراتية العالمية',
    heading_plain: 'درجتك الإجمالية',
    params: {
      global_score: 'الدرجة العالمية',
      health_badge: 'تصنيف الصحة',
      network_score: 'درجة الشبكة',
      identity_score: 'درجة الهوية',
      privacy_score: 'درجة الخصوصية',
      device_score: 'درجة الجهاز',
      graphics_score: 'درجة الرسومات',
      security_score: 'درجة الأمان',
      capability_score: 'درجة القدرة',
      performance_score: 'درجة الأداء',
      speed_score: 'درجة السرعة',
      strongest_area: 'أقوى مجال',
      weakest_area: 'أضعف مجال',
      improvement_priority: 'أولوية التحسين',
      critical_flags: 'أعلام حرجة',
      warnings: 'تحذيرات'
    },
    health: {
      excellent: 'ممتاز',
      healthy: 'صحي',
      fair: 'مقبول',
      poor: 'ضعيف',
      critical: 'حرج'
    },
    deep_dive: 'تحليل معمق لدرجتك العالمية'
  },
  canvas12: {
    heading_technical: 'التغذية الاستخباراتية المباشرة',
    heading_plain: 'ماذا حدث للتو؟',
    params: {
      online_status: 'حالة الاتصال',
      backend_health: 'صحة الخادم الخلفي',
      total_events: 'إجمالي الأحداث',
      critical_count: 'الأحداث الحرجة',
      warning_count: 'التحذيرات',
      api_calls: 'استدعاءات API المنجزة',
      error_count: 'الأخطاء',
      last_network_change: 'آخر تغيير للشبكة',
      scan_start_time: 'بدء الفحص',
      ai_summary_source: 'مصدر ملخص AI',
      ai_last_updated: 'تحديث الملخص'
    },
    values: {
      online: 'متصل',
      offline: 'غير متصل',
      healthy: 'صحي',
      degraded: 'متدهور',
      none_detected: 'لم يُكتشف شيء'
    },
    deep_dive: 'تحليل معمق لتغذيتك الاستخباراتية المباشرة'
  },
  full_summary: {
    title: 'تقرير استخبارات النظام الكامل',
    label: 'ملخص تشخيص AI',
    source_label: 'تم إنشاؤه بواسطة',
    generated_at: 'تم الإنشاء',
    score_label: 'الدرجة العالمية'
  },
  download: {
    json: 'تنزيل JSON',
    pdf: 'تنزيل PDF',
    copy: 'نسخ إلى الحافظة',
    downloaded: 'تم التنزيل',
    sent_to_printer: 'أُرسل للطابعة',
    copied: 'تم النسخ',
    failed: 'فشل — حاول مجدداً'
  },
  share: {
    label: 'شارك هذه الأداة',
    copied_for: 'تم النسخ لـ',
    link_copied: 'تم نسخ الرابط إلى الحافظة',
    copy_failed: 'فشل النسخ — حاول يدوياً'
  },
  ai_summary: {
    label: 'ملخص استخبارات AI',
    source_script: 'سكريبت',
    source_groq: 'Groq',
    source_gemini: 'Gemini',
    generating: 'جارٍ إنشاء التحليل...',
    in_progress: 'جارٍ فحص الاستخبارات.'
  },
  scores: {
    excellent: 'ممتاز',
    healthy: 'صحي',
    fair: 'مقبول',
    poor: 'ضعيف',
    critical: 'حرج',
    out_of_100: '/100'
  },
  values: {
    yes: 'نعم',
    no: 'لا',
    unknown: 'غير معروف',
    available: 'متاح',
    blocked: 'محجوب',
    enabled: 'مفعّل',
    disabled: 'معطّل',
    supported: 'مدعوم',
    not_supported: 'غير مدعوم',
    secure: 'آمن',
    not_secure: 'غير آمن',
    exposed: 'مكشوف',
    safe: 'آمن',
    pass: 'اجتاز',
    fail: 'فشل',
    scanning: 'جارٍ الفحص...',
    loading: 'جارٍ التحميل...',
    na: 'غير منطبق'
  },
  logic: {
    label: 'المنطق',
    text: 'يجمع IntelReap 234 نقطة بيانات من واجهات برمجة المتصفح وخادم خلفي بلا خادم لبناء صورة كاملة في الوقت الفعلي لبيئة شبكتك وجهازك.'
  },
  methodology: {
    label: 'المنهجية',
    text: 'تُجمع جميع البيانات الاستخباراتية من جانب العميل عبر واجهات برمجة المتصفح القياسية وتُثري من خلال سلسلة احتياطية ثلاثية المستويات تشمل ip-api.com وipwho.is وقاعدة بيانات MaxMind.'
  },
  citations: {
    label: 'المصادر والمراجع',
    sources: [
      { num: '1', text: 'توثيق Google Web Vitals', url: 'https://web.dev/vitals/' },
      { num: '2', text: 'IANA — سجل أرقام الأنظمة المستقلة', url: 'https://www.iana.org/assignments/as-numbers/' },
      { num: '3', text: 'PeeringDB — قاعدة بيانات البنية التحتية للشبكة', url: 'https://www.peeringdb.com/' },
      { num: '4', text: 'توثيق قاعدة بيانات MaxMind GeoLite2', url: 'https://dev.maxmind.com/geoip/geolite2-free-geolocation-data' },
      { num: '5', text: 'MDN Web Docs — Navigator API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Navigator' },
      { num: '6', text: 'W3C — مواصفة WebGL', url: 'https://www.khronos.org/registry/webgl/specs/latest/' },
      { num: '7', text: 'RIPE NCC — سجل أرقام الإنترنت', url: 'https://www.ripe.net/' },
      { num: '8', text: 'هندسة أمان WebRTC — RFC 8826', url: 'https://datatracker.ietf.org/doc/html/rfc8826' }
    ]
  },
  faq: {
    label: 'الأسئلة الشائعة',
    title: 'كل ما تحتاج معرفته',
    items: [
      {
        q: 'ما هو IntelReap وماذا يفعل؟',
        a: 'IntelReap أداة مجانية تعمل في المتصفح لتحليل البنية التحتية لشبكتك وبصمة جهازك والوضع الأمني وقدرات المتصفح في الوقت الفعلي. يجمع 234 نقطة بيانات دون تخزين أي شيء أو الحاجة لحساب.'
      },
      {
        q: 'هل يخزن IntelReap أياً من بياناتي؟',
        a: 'لا. يعالج IntelReap جميع الاستخبارات محلياً في متصفحك، ولا يحتفظ الخادم الخلفي بأي معلومات شخصية. كل فحص مؤقت.'
      },
      {
        q: 'ما هو ASN ولماذا هو مهم؟',
        a: 'رقم النظام المستقل (ASN) هو معرف فريد يُخصص لمشغل الشبكة ويحدد كيفية توجيه حركة المرور عبر الإنترنت. يحدد IntelReap ASN الخاص بك ومالكه وتصنيف مستواه وعلاقاته التبادلية.'
      },
      {
        q: 'كيف يعمل كشف VPN؟',
        a: 'يستخدم IntelReap نهجاً ثلاثي الطبقات: تحليل نوع ملكية ASN، والتحقق من عدم تطابق المنطقة الزمنية واللغة، والاستعلام الاختياري من واجهات API للتحقق من السمعة. تُجمع الإشارات الثلاث في نقاط ثقة واحدة وتصنيف للمسار.'
      },
      {
        q: 'ما هو تسرب IP عبر WebRTC؟',
        a: 'WebRTC واجهة برمجة متصفح للاتصال الفوري كمكالمات الفيديو. أحد آثارها الجانبية أنها قد تكشف عنوان IP الشبكة المحلي حتى عند استخدام VPN. يختبر IntelReap بنشاط تسربات WebRTC عبر إنشاء اتصال نظير.'
      },
      {
        q: 'ما هي Core Web Vitals؟',
        a: 'Core Web Vitals مجموعة مقاييس محددة من Google لقياس تجربة المستخدم الحقيقية على صفحات الويب. تشمل أكبر رسم للمحتوى (LCP) وتراكم تحول التخطيط (CLS) والتفاعل حتى الرسم التالي (INP). يقيس IntelReap جميع المقاييس الستة.'
      },
      {
        q: 'ما مدى دقة تحديد موقع IP؟',
        a: 'تحديد موقع IP دقيق على مستوى الدولة في جميع الحالات تقريباً، وعلى مستوى المدينة لمعظم الاتصالات السكنية والتجارية. يستخدم IntelReap سلسلة احتياطية ثلاثية المستويات لأقصى دقة.'
      },
      {
        q: 'ما الذي تقيسه درجة الأمان؟',
        a: 'تُحسب درجة الأمان من عشرة إشارات موزونة: حالة HTTPS والسياق الآمن وتعرض WebRTC والمحتوى المختلط وعدم التتبع وحالة الوصول للتخزين وأذونات الكاميرا والميكروفون والموقع وعدد أسطح البصمة الرقمية.'
      },
      {
        q: 'هل يمكنني استخدام IntelReap دون اتصال؟',
        a: 'IntelReap تطبيق ويب تدريجي يمكن تثبيته على جهازك. تحميل الواجهة الثابتة يعمل دون اتصال من الذاكرة المؤقتة. لكن فحص الاستخبارات يتطلب اتصالاً نشطاً للاستعلام من واجهات API الخلفية.'
      },
      {
        q: 'كيف تُحسب الدرجة العالمية؟',
        a: 'الدرجة العالمية متوسط موزون لتسعة درجات فرعية: الشبكة 15%، الجهاز 15%، الأمان 20% (أعلى وزن)، القدرة 10%، الأداء 10%، السرعة 10%، الخصوصية 10%، الهوية 5%، والرسومات 5%.'
      },
      {
        q: 'ما الفرق بين المعيار وCore Web Vitals؟',
        a: 'Core Web Vitals تقيس سرعة تحميل هذه الصفحة على جهازك واتصالك — مقاييس تجربة المستخدم الحقيقية. معايير المتصفح اختبارات اصطناعية تقيس قدرة معالجة جهازك الخامة بغض النظر عن ظروف الشبكة.'
      },
      {
        q: 'هل IntelReap متاح كتطبيق جوال؟',
        a: 'IntelReap تطبيق ويب تدريجي يمكن تثبيته مباشرة من متصفحك على iOS وAndroid دون زيارة متجر التطبيقات. على iOS افتح الموقع في Safari واضغط مشاركة ثم أضف إلى الشاشة الرئيسية.'
      }
    ]
  },
  contact: {
    label: 'تواصل معنا',
    title: 'تواصل مع IntelReap',
    body: 'أسئلة أو ملاحظات أو استفسارات شراكة أو طلبات صحفية. نرد خلال يومي عمل.',
    name_label: 'الاسم',
    name_placeholder: 'اسمك',
    email_label: 'البريد الإلكتروني',
    email_placeholder: 'بريدك@الإلكتروني.com',
    message_label: 'الرسالة',
    message_placeholder: 'كيف يمكننا مساعدتك؟',
    submit: 'إرسال الرسالة',
    success: 'شكراً! تم إرسال طلبك.',
    error: 'عذراً! حدثت مشكلة في إرسال النموذج.'
  },
  footer: {
    tagline: 'استخبارات الشبكة والأجهزة في الوقت الفعلي.',
    description: 'أداة استخبارات مجانية تعمل في المتصفح. لا تسجيل. لا تخزين للبيانات.',
    col_intelligence: 'الاستخبارات',
    col_deep_dives: 'التحليلات المعمقة',
    col_legal: 'قانوني',
    col_connect: 'تواصل',
    copyright_suffix: 'تتم معالجة جميع بيانات الاستخبارات محلياً في متصفحك.',
    privacy: 'الخصوصية',
    cookies: 'ملفات تعريف الارتباط',
    terms: 'الشروط',
    twitter: 'Twitter / X',
    github: 'GitHub'
  },
  cookie: {
    text: 'يستخدم IntelReap حداً أدنى من التخزين المحلي لحفظ تفضيل لغتك. لا تتبع. لا ملفات تعريف ارتباط من طرف ثالث.',
    accept: 'قبول',
    decline: 'رفض',
    policy_link: 'سياسة ملفات تعريف الارتباط'
  },
  offline: {
    status: 'انقطع الاتصال',
    title: 'أنت غير متصل',
    body: 'يحتاج IntelReap إلى اتصال نشط لجمع بيانات الاستخبارات. تحقق من شبكتك وحاول مجدداً.',
    retry: 'إعادة محاولة الاتصال',
    home: 'العودة إلى مركز الاستخبارات',
    cached_title: 'استخبارات مخزنة متاحة',
    cached_body: 'قد تكون بعض البيانات المفحوصة سابقاً متاحة من جلستك الأخيرة.',
    online_status: 'حالة الاتصال',
    connection_type: 'نوع الاتصال',
    effective_type: 'النوع الفعلي',
    last_online: 'آخر اتصال'
  },
  internal_links: {
    header: 'استكشف لوحات الاستخبارات',
    back_to_main: '← العودة إلى مركز الاستخبارات'
  },
  seasonal: {
    spring: 'إصدار الربيع',
    summer: 'إصدار الصيف',
    fall: 'إصدار الخريف',
    winter: 'إصدار الشتاء'
  },
  errors: {
    backend_unavailable: 'الخادم الخلفي غير متاح — استخدام بيانات احتياطية',
    scan_failed: 'فشل الفحص — إعادة المحاولة',
    no_data: 'لا توجد بيانات متاحة',
    loading: 'جارٍ التحميل...',
    not_detected: 'لم يُكتشف',
    api_error: 'خطأ في API'
  }
}
