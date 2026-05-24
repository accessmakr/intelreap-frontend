// ─────────────────────────────────────────
// DEVICE INTELLIGENCE ENGINE
// Powers Canvas 5 — Device Intelligence Panel
// Complete enterprise grade detection
// Covers all known platforms, browsers,
// operating systems and device brands
// ─────────────────────────────────────────

const DeviceEngine = (() => {

  // ───────────────────────────────────────
  // LAYER 1 — USER AGENT CLIENT HINTS API
  // Most accurate — Chromium browsers only
  // ───────────────────────────────────────

  const collectFromClientHints = async () => {
    if (!navigator.userAgentData) return null

    try {
      const highEntropy = await navigator
        .userAgentData
        .getHighEntropyValues([
          'platform',
          'platformVersion',
          'architecture',
          'model',
          'mobile',
          'bitness',
          'fullVersionList',
          'wow64'
        ])

      return {
        platform: highEntropy.platform,
        platformVersion: highEntropy.platformVersion,
        architecture: highEntropy.architecture,
        model: highEntropy.model,
        mobile: highEntropy.mobile,
        bitness: highEntropy.bitness,
        fullVersionList: highEntropy.fullVersionList,
        wow64: highEntropy.wow64,
        source: 'client-hints'
      }
    } catch {
      return null
    }
  }

  // Build OS data from client hints
  const osFromClientHints = (hints) => {
    if (!hints) return null

    const platform = hints.platform || ''
    const version = hints.platformVersion || ''

    switch (platform) {
      case 'Windows': {
        // Windows 11 is platformVersion >= 13
        const major = parseInt(
          version.split('.')[0], 10
        )
        const osName = major >= 13
          ? 'Windows 11'
          : major >= 1
          ? 'Windows 10'
          : 'Windows'
        return {
          os: osName,
          osVersion: version,
          osPlatform: 'Windows',
          architecture: hints.architecture,
          bitness: hints.bitness
        }
      }
      case 'macOS':
        return {
          os: `macOS ${getMacName(version)}`,
          osVersion: version,
          osPlatform: 'macOS',
          architecture: hints.architecture
        }
      case 'Linux':
        return {
          os: 'Linux',
          osVersion: version,
          osPlatform: 'Linux',
          architecture: hints.architecture
        }
      case 'Android':
        return {
          os: `Android ${version}`,
          osVersion: version,
          osPlatform: 'Android',
          deviceModel: hints.model
        }
      case 'iOS':
        return {
          os: `iOS ${version}`,
          osVersion: version,
          osPlatform: 'iOS',
          deviceModel: hints.model
        }
      case 'Chrome OS':
        return {
          os: 'ChromeOS',
          osVersion: version,
          osPlatform: 'ChromeOS'
        }
      case 'Fuchsia':
        return {
          os: 'Fuchsia OS',
          osVersion: version,
          osPlatform: 'Fuchsia'
        }
      default:
        return {
          os: platform || 'Unknown OS',
          osVersion: version,
          osPlatform: platform || 'Unknown'
        }
    }
  }

  // Build browser data from client hints
  const browserFromClientHints = (hints) => {
    if (
      !hints ||
      !hints.fullVersionList ||
      !hints.fullVersionList.length
    ) return null

    // fullVersionList is ordered by relevance
    // Find the most specific browser
    const list = hints.fullVersionList

    // Filter out generic entries
    const specific = list.filter(b =>
      !['Chromium', 'Not_A Brand',
        'Not A Brand', 'Not;A Brand',
        'Not.A.Brand', 'HeadlessChrome'
      ].some(generic =>
        b.brand.includes(generic)
      )
    )

    if (specific.length > 0) {
      const primary = specific[0]
      return {
        browser: mapBrandToBrowserName(
          primary.brand
        ),
        browserVersion: primary.version,
        browserEngine: 'Blink',
        source: 'client-hints'
      }
    }

    // Only generic brands found
    // Use Chromium as fallback
    const chromium = list.find(
      b => b.brand === 'Chromium'
    )
    if (chromium) {
      return {
        browser: 'Chromium',
        browserVersion: chromium.version,
        browserEngine: 'Blink',
        source: 'client-hints'
      }
    }

    return null
  }

  // Map brand strings to human readable names
  const mapBrandToBrowserName = (brand) => {
    const map = {
      'Google Chrome':      'Google Chrome',
      'Microsoft Edge':     'Microsoft Edge',
      'Opera':              'Opera',
      'Brave':              'Brave Browser',
      'Vivaldi':            'Vivaldi',
      'Samsung Internet':   'Samsung Internet',
      'Yandex':             'Yandex Browser',
      'DuckDuckGo':         'DuckDuckGo Browser',
      'Naver Whale':        'Naver Whale',
      'Coc Coc':            'Coc Coc',
      'UC Browser':         'UC Browser',
      'QQ Browser':         'QQ Browser',
      'Sogou Explorer':     'Sogou Browser',
      '360 Browser':        '360 Browser',
      'Cent Browser':       'Cent Browser',
      'Iridium':            'Iridium Browser',
      'Iron':               'SRWare Iron',
      'Comodo Dragon':      'Comodo Dragon'
    }
    return map[brand] || brand
  }

  // Get macOS version name
  const getMacName = (version) => {
    const major = parseInt(
      version.split('.')[0], 10
    )
    const minor = parseInt(
      version.split('.')[1] || '0', 10
    )
    const names = {
      15: 'Sequoia',
      14: 'Sonoma',
      13: 'Ventura',
      12: 'Monterey',
      11: 'Big Sur',
      10: {
        16: 'Big Sur',
        15: 'Catalina',
        14: 'Mojave',
        13: 'High Sierra',
        12: 'Sierra',
        11: 'El Capitan',
        10: 'Yosemite',
        9:  'Mavericks'
      }
    }
    if (major >= 11) return names[major] || ''
    if (major === 10) {
      return names[10][minor] || ''
    }
    return ''
  }

  // ───────────────────────────────────────
  // LAYER 2 — USER AGENT STRING PARSING
  // Fallback for Firefox, Safari, and all
  // browsers without client hints support
  // ───────────────────────────────────────

  const detectOS = (ua) => {
    const userAgent = ua ||
      navigator.userAgent || ''

    // HarmonyOS — Huawei
    if (userAgent.includes('HarmonyOS')) {
      const match = userAgent.match(
        /HarmonyOS\s*([\d.]+)?/
      )
      return {
        os: `HarmonyOS${match?.[1] ? ' ' + match[1] : ''}`,
        osVersion: match?.[1] || '',
        osPlatform: 'HarmonyOS'
      }
    }

    // KaiOS — Feature phones
    if (userAgent.includes('KAIOS')) {
      return {
        os: 'KaiOS',
        osVersion: '',
        osPlatform: 'KaiOS'
      }
    }

    // Tizen — Samsung smart devices
    if (userAgent.includes('Tizen')) {
      const match = userAgent.match(
        /Tizen\s*([\d.]+)/
      )
      return {
        os: `Tizen ${match?.[1] || ''}`,
        osVersion: match?.[1] || '',
        osPlatform: 'Tizen'
      }
    }

    // webOS — LG TVs
    if (userAgent.includes('webOS')) {
      const match = userAgent.match(
        /webOS\/([\d.]+)/
      )
      return {
        os: `webOS ${match?.[1] || ''}`,
        osVersion: match?.[1] || '',
        osPlatform: 'webOS'
      }
    }

    // tvOS — Apple TV
    if (userAgent.includes('TV OS') ||
        userAgent.includes('tvOS')) {
      return {
        os: 'tvOS',
        osVersion: '',
        osPlatform: 'tvOS'
      }
    }

    // watchOS — Apple Watch
    if (userAgent.includes('watchOS')) {
      const match = userAgent.match(
        /watchOS\s*([\d.]+)/
      )
      return {
        os: `watchOS ${match?.[1] || ''}`,
        osVersion: match?.[1] || '',
        osPlatform: 'watchOS'
      }
    }

    // Windows detection
    if (userAgent.includes('Windows NT')) {
      const versionMap = {
        '10.0': 'Windows 10',
        '6.3':  'Windows 8.1',
        '6.2':  'Windows 8',
        '6.1':  'Windows 7',
        '6.0':  'Windows Vista',
        '5.2':  'Windows XP x64',
        '5.1':  'Windows XP',
        '5.0':  'Windows 2000'
      }
      const match = userAgent.match(
        /Windows NT ([\d.]+)/
      )
      const version = match?.[1]
      return {
        os: versionMap[version] || 'Windows',
        osVersion: version || '',
        osPlatform: 'Windows'
      }
    }

    // Windows Phone / Mobile
    if (userAgent.includes('Windows Phone')) {
      const match = userAgent.match(
        /Windows Phone\s*(OS\s*)?([\d.]+)/
      )
      return {
        os: `Windows Phone ${match?.[2] || ''}`,
        osVersion: match?.[2] || '',
        osPlatform: 'Windows Phone'
      }
    }

    // iOS — iPad, iPhone, iPod
    if (
      userAgent.includes('iPhone') ||
      userAgent.includes('iPad') ||
      userAgent.includes('iPod') ||
      (navigator.platform === 'MacIntel' &&
       navigator.maxTouchPoints > 1)
    ) {
      const match = userAgent.match(
        /OS ([\d_]+) like Mac OS X/
      )
      const version = match?.[1]
        ?.replace(/_/g, '.') || ''
      const device =
        userAgent.includes('iPad') ||
        (navigator.platform === 'MacIntel' &&
         navigator.maxTouchPoints > 1)
          ? 'iPadOS'
          : userAgent.includes('iPod')
          ? 'iOS (iPod)'
          : 'iOS'
      return {
        os: `${device} ${version}`,
        osVersion: version,
        osPlatform: device
      }
    }

    // macOS
    if (userAgent.includes('Mac OS X')) {
      const match = userAgent.match(
        /Mac OS X ([\d_]+)/
      )
      const versionRaw = match?.[1]
        ?.replace(/_/g, '.') || ''
      const parts = versionRaw.split('.')
      const major = parseInt(parts[0])
      const minor = parseInt(parts[1] || '0')
      const macName = getMacName(
        `${major}.${minor}`
      )
      return {
        os: `macOS${macName ? ' ' + macName : ''}`,
        osVersion: versionRaw,
        osPlatform: 'macOS'
      }
    }

    // Android
    if (userAgent.includes('Android')) {
      const match = userAgent.match(
        /Android ([\d.]+)/
      )
      const version = match?.[1] || ''
      return {
        os: `Android ${version}`,
        osVersion: version,
        osPlatform: 'Android'
      }
    }

    // BlackBerry
    if (
      userAgent.includes('BlackBerry') ||
      userAgent.includes('BB10') ||
      userAgent.includes('RIM Tablet')
    ) {
      const match = userAgent.match(
        /Version\/([\d.]+)/
      )
      return {
        os: 'BlackBerry OS',
        osVersion: match?.[1] || '',
        osPlatform: 'BlackBerry'
      }
    }

    // Symbian
    if (
      userAgent.includes('Symbian') ||
      userAgent.includes('SymbOS') ||
      userAgent.includes('Series60')
    ) {
      return {
        os: 'Symbian OS',
        osVersion: '',
        osPlatform: 'Symbian'
      }
    }

    // ChromeOS
    if (userAgent.includes('CrOS')) {
      const match = userAgent.match(
        /CrOS\s+\w+\s+([\d.]+)/
      )
      return {
        os: 'ChromeOS',
        osVersion: match?.[1] || '',
        osPlatform: 'ChromeOS'
      }
    }

    // Fuchsia
    if (userAgent.includes('Fuchsia')) {
      return {
        os: 'Fuchsia OS',
        osVersion: '',
        osPlatform: 'Fuchsia'
      }
    }

    // GrapheneOS / CalyxOS / LineageOS
    // These report as Android in UA
    // but may have build hints
    if (
      userAgent.includes('GrapheneOS')
    ) {
      return {
        os: 'GrapheneOS',
        osVersion: '',
        osPlatform: 'Android'
      }
    }

    // Linux distributions
    if (userAgent.includes('Linux')) {
      if (userAgent.includes('Ubuntu')) {
        return {
          os: 'Ubuntu Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('Fedora')) {
        return {
          os: 'Fedora Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('Debian')) {
        return {
          os: 'Debian Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('Mint')) {
        return {
          os: 'Linux Mint',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('Arch')) {
        return {
          os: 'Arch Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('Gentoo')) {
        return {
          os: 'Gentoo Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (
        userAgent.includes('Red Hat') ||
        userAgent.includes('RHEL')
      ) {
        return {
          os: 'Red Hat Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('CentOS')) {
        return {
          os: 'CentOS Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('SUSE')) {
        return {
          os: 'SUSE Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('Manjaro')) {
        return {
          os: 'Manjaro Linux',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      if (userAgent.includes('Raspbian')) {
        return {
          os: 'Raspberry Pi OS',
          osVersion: '',
          osPlatform: 'Linux'
        }
      }
      return {
        os: 'Linux',
        osVersion: '',
        osPlatform: 'Linux'
      }
    }

    // FreeBSD
    if (userAgent.includes('FreeBSD')) {
      return {
        os: 'FreeBSD',
        osVersion: '',
        osPlatform: 'FreeBSD'
      }
    }

    // OpenBSD
    if (userAgent.includes('OpenBSD')) {
      return {
        os: 'OpenBSD',
        osVersion: '',
        osPlatform: 'OpenBSD'
      }
    }

    // NetBSD
    if (userAgent.includes('NetBSD')) {
      return {
        os: 'NetBSD',
        osVersion: '',
        osPlatform: 'NetBSD'
      }
    }

    // Solaris
    if (userAgent.includes('SunOS')) {
      return {
        os: 'Solaris',
        osVersion: '',
        osPlatform: 'Solaris'
      }
    }

    // ───────────────────────────────────
    // INTELLIGENT FALLBACK
    // Cannot identify OS but can infer
    // ───────────────────────────────────
    const touch = navigator.maxTouchPoints > 0
    const mobile = /Mobile|Phone/i.test(
      userAgent
    )

    if (mobile || touch) {
      return {
        os: 'Mobile OS',
        osVersion: '',
        osPlatform: 'Mobile'
      }
    }

    return {
      os: 'Desktop OS',
      osVersion: '',
      osPlatform: 'Desktop'
    }
  }

  // ───────────────────────────────────────
  // BROWSER DETECTION — COMPLETE
  // ───────────────────────────────────────

  const detectBrowser = (ua) => {
    const userAgent = ua ||
      navigator.userAgent || ''

    // ── Brave — must check API not UA ──
    // Brave spoofs Chrome UA intentionally
    if (navigator.brave) {
      try {
        // navigator.brave.isBrave() is async
        // We detect synchronously via API presence
        return {
          browser: 'Brave Browser',
          browserVersion: extractChromeVersion(
            userAgent
          ),
          browserEngine: 'Blink',
          isPrivacyBrowser: true
        }
      } catch {
        // Fall through to UA parsing
      }
    }

    // ── Tor Browser ──
    // Tor reports as Firefox
    // but with very specific UA string
    if (
      userAgent.includes('Firefox') &&
      userAgent.includes('rv:') &&
      !userAgent.includes('Gecko/') &&
      navigator.plugins?.length === 0
    ) {
      // Tor strips plugins to zero
      // This is a strong Tor signal
      const match = userAgent.match(
        /Firefox\/([\d.]+)/
      )
      return {
        browser: 'Tor Browser',
        browserVersion: match?.[1] || '',
        browserEngine: 'Gecko',
        isPrivacyBrowser: true
      }
    }

    // ── DuckDuckGo Browser ──
    if (userAgent.includes('DuckDuckGo')) {
      return {
        browser: 'DuckDuckGo Browser',
        browserVersion: extractVersion(
          userAgent, 'DuckDuckGo'
        ),
        browserEngine: 'Blink',
        isPrivacyBrowser: true
      }
    }

    // ── Samsung Internet ──
    if (userAgent.includes('SamsungBrowser')) {
      return {
        browser: 'Samsung Internet',
        browserVersion: extractVersion(
          userAgent, 'SamsungBrowser'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Microsoft Edge Chromium ──
    if (
      userAgent.includes('Edg/') ||
      userAgent.includes('EdgA/') ||
      userAgent.includes('EdgiOS/')
    ) {
      const match = userAgent.match(
        /Edg(?:[AiOS]*)[\/]([\d.]+)/
      )
      return {
        browser: 'Microsoft Edge',
        browserVersion: match?.[1] || '',
        browserEngine: 'Blink'
      }
    }

    // ── Internet Explorer ──
    if (
      userAgent.includes('MSIE') ||
      userAgent.includes('Trident/')
    ) {
      const msie = userAgent.match(
        /MSIE\s([\d.]+)/
      )
      const rv = userAgent.match(
        /rv:([\d.]+)/
      )
      return {
        browser: 'Internet Explorer',
        browserVersion: msie?.[1] ||
          rv?.[1] || '',
        browserEngine: 'Trident'
      }
    }

    // ── Opera ──
    if (userAgent.includes('OPR/')) {
      return {
        browser: 'Opera',
        browserVersion: extractVersion(
          userAgent, 'OPR'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Opera Mini ──
    if (userAgent.includes('Opera Mini')) {
      return {
        browser: 'Opera Mini',
        browserVersion: extractVersion(
          userAgent, 'Opera Mini'
        ),
        browserEngine: 'Presto'
      }
    }

    // ── Opera Legacy ──
    if (
      userAgent.includes('Opera/') ||
      userAgent.includes('Opera ')
    ) {
      return {
        browser: 'Opera',
        browserVersion: extractVersion(
          userAgent, 'Version'
        ),
        browserEngine: 'Presto'
      }
    }

    // ── Vivaldi ──
    if (userAgent.includes('Vivaldi')) {
      return {
        browser: 'Vivaldi',
        browserVersion: extractVersion(
          userAgent, 'Vivaldi'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Yandex Browser ──
    if (userAgent.includes('YaBrowser')) {
      return {
        browser: 'Yandex Browser',
        browserVersion: extractVersion(
          userAgent, 'YaBrowser'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Naver Whale ──
    if (userAgent.includes('Whale')) {
      return {
        browser: 'Naver Whale',
        browserVersion: extractVersion(
          userAgent, 'Whale'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Coc Coc — Vietnamese browser ──
    if (userAgent.includes('coc_coc_browser')) {
      return {
        browser: 'Coc Coc',
        browserVersion: extractVersion(
          userAgent, 'coc_coc_browser'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── UC Browser ──
    if (
      userAgent.includes('UCBrowser') ||
      userAgent.includes('UCWEB')
    ) {
      return {
        browser: 'UC Browser',
        browserVersion: extractVersion(
          userAgent, 'UCBrowser'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── QQ Browser ──
    if (userAgent.includes('QQBrowser')) {
      return {
        browser: 'QQ Browser',
        browserVersion: extractVersion(
          userAgent, 'QQBrowser'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Sogou Browser ──
    if (userAgent.includes('SE ')) {
      return {
        browser: 'Sogou Browser',
        browserVersion: extractVersion(
          userAgent, 'SE'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── 360 Browser ──
    if (userAgent.includes('QIHU')) {
      return {
        browser: '360 Browser',
        browserVersion: '',
        browserEngine: 'Blink'
      }
    }

    // ── Maxthon ──
    if (userAgent.includes('Maxthon')) {
      return {
        browser: 'Maxthon',
        browserVersion: extractVersion(
          userAgent, 'Maxthon'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Puffin ──
    if (userAgent.includes('Puffin')) {
      return {
        browser: 'Puffin Browser',
        browserVersion: extractVersion(
          userAgent, 'Puffin'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Pale Moon ──
    if (userAgent.includes('PaleMoon')) {
      return {
        browser: 'Pale Moon',
        browserVersion: extractVersion(
          userAgent, 'PaleMoon'
        ),
        browserEngine: 'Goanna'
      }
    }

    // ── Waterfox ──
    if (userAgent.includes('Waterfox')) {
      return {
        browser: 'Waterfox',
        browserVersion: extractVersion(
          userAgent, 'Waterfox'
        ),
        browserEngine: 'Gecko'
      }
    }

    // ── Basilisk ──
    if (userAgent.includes('Basilisk')) {
      return {
        browser: 'Basilisk',
        browserVersion: extractVersion(
          userAgent, 'Basilisk'
        ),
        browserEngine: 'Goanna'
      }
    }

    // ── SeaMonkey ──
    if (userAgent.includes('SeaMonkey')) {
      return {
        browser: 'SeaMonkey',
        browserVersion: extractVersion(
          userAgent, 'SeaMonkey'
        ),
        browserEngine: 'Gecko'
      }
    }

    // ── Epiphany — GNOME Web ──
    if (userAgent.includes('Epiphany')) {
      return {
        browser: 'GNOME Web',
        browserVersion: extractVersion(
          userAgent, 'Epiphany'
        ),
        browserEngine: 'WebKit'
      }
    }

    // ── Falkon ──
    if (userAgent.includes('Falkon')) {
      return {
        browser: 'Falkon',
        browserVersion: extractVersion(
          userAgent, 'Falkon'
        ),
        browserEngine: 'WebKit'
      }
    }

    // ── Midori ──
    if (userAgent.includes('Midori')) {
      return {
        browser: 'Midori',
        browserVersion: extractVersion(
          userAgent, 'Midori'
        ),
        browserEngine: 'WebKit'
      }
    }

    // ── Google Chrome ──
    // Must come after all Chrome-based browsers
    if (
      userAgent.includes('Chrome/') &&
      !userAgent.includes('Chromium/')
    ) {
      return {
        browser: 'Google Chrome',
        browserVersion: extractChromeVersion(
          userAgent
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Chromium ──
    if (userAgent.includes('Chromium/')) {
      return {
        browser: 'Chromium',
        browserVersion: extractVersion(
          userAgent, 'Chromium'
        ),
        browserEngine: 'Blink'
      }
    }

    // ── Mozilla Firefox ──
    if (userAgent.includes('Firefox/')) {
      return {
        browser: 'Mozilla Firefox',
        browserVersion: extractVersion(
          userAgent, 'Firefox'
        ),
        browserEngine: 'Gecko'
      }
    }

    // ── Apple Safari ──
    if (
      userAgent.includes('Safari/') &&
      !userAgent.includes('Chrome/')
    ) {
      return {
        browser: 'Apple Safari',
        browserVersion: extractVersion(
          userAgent, 'Version'
        ),
        browserEngine: 'WebKit'
      }
    }

    // ───────────────────────────────────
    // INTELLIGENT BROWSER FALLBACK
    // Cannot identify browser but can
    // identify the engine
    // ───────────────────────────────────
    if (userAgent.includes('Gecko/')) {
      return {
        browser: 'Gecko-based Browser',
        browserVersion: '',
        browserEngine: 'Gecko'
      }
    }

    if (userAgent.includes('WebKit/')) {
      return {
        browser: 'WebKit-based Browser',
        browserVersion: '',
        browserEngine: 'WebKit'
      }
    }

    if (userAgent.includes('Trident/')) {
      return {
        browser: 'Internet Explorer',
        browserVersion: '',
        browserEngine: 'Trident'
      }
    }

    return {
      browser: 'Unknown Browser',
      browserVersion: '',
      browserEngine: 'Unknown'
    }
  }

  // Version extraction helpers
  const extractVersion = (ua, name) => {
    const escaped = name.replace(
      /[.*+?^${}()|[\]\\]/g, '\\$&'
    )
    const match = ua.match(
      new RegExp(
        escaped + '[\\s\\/]([\\.\\d]+)'
      )
    )
    return match?.[1] || ''
  }

  const extractChromeVersion = (ua) => {
    const match = ua.match(
      /Chrome\/([\d.]+)/
    )
    return match?.[1] || ''
  }

  // ───────────────────────────────────────
  // DEVICE TYPE AND BRAND DETECTION
  // ───────────────────────────────────────

  const detectDeviceType = (ua, osData) => {
    const userAgent = ua ||
      navigator.userAgent || ''

    // Apple devices
    if (
      userAgent.includes('iPad') ||
      (navigator.platform === 'MacIntel' &&
       navigator.maxTouchPoints > 1)
    ) {
      return {
        deviceType: 'Tablet',
        deviceBrand: 'Apple'
      }
    }

    if (
      userAgent.includes('iPhone') ||
      userAgent.includes('iPod')
    ) {
      return {
        deviceType: 'Mobile',
        deviceBrand: 'Apple'
      }
    }

    if (
      osData.osPlatform === 'tvOS'
    ) {
      return {
        deviceType: 'TV',
        deviceBrand: 'Apple'
      }
    }

    if (
      osData.osPlatform === 'watchOS'
    ) {
      return {
        deviceType: 'Wearable',
        deviceBrand: 'Apple'
      }
    }

    // Android devices
    if (osData.osPlatform === 'Android' ||
        osData.osPlatform === 'HarmonyOS') {
      const isTablet =
        !userAgent.includes('Mobile')
      const brand = detectDeviceBrand(userAgent)
      return {
        deviceType: isTablet ? 'Tablet' : 'Mobile',
        deviceBrand: brand
      }
    }

    // Windows Phone
    if (
      osData.osPlatform === 'Windows Phone'
    ) {
      return {
        deviceType: 'Mobile',
        deviceBrand: detectDeviceBrand(userAgent)
      }
    }

    // BlackBerry
    if (osData.osPlatform === 'BlackBerry') {
      return {
        deviceType: 'Mobile',
        deviceBrand: 'BlackBerry'
      }
    }

    // Symbian — Nokia feature phones
    if (osData.osPlatform === 'Symbian') {
      return {
        deviceType: 'Mobile',
        deviceBrand: 'Nokia'
      }
    }

    // KaiOS — Feature phones
    if (osData.osPlatform === 'KaiOS') {
      return {
        deviceType: 'Mobile',
        deviceBrand: detectDeviceBrand(userAgent)
      }
    }

    // Tizen — Samsung smart devices
    if (osData.osPlatform === 'Tizen') {
      const isTv = userAgent.includes('SmartTV') ||
        userAgent.includes('SMART-TV')
      return {
        deviceType: isTv ? 'Smart TV' : 'Mobile',
        deviceBrand: 'Samsung'
      }
    }

    // webOS — LG TVs
    if (osData.osPlatform === 'webOS') {
      return {
        deviceType: 'Smart TV',
        deviceBrand: 'LG'
      }
    }

    // ChromeOS — Chromebook
    if (osData.osPlatform === 'ChromeOS') {
      return {
        deviceType: 'Laptop',
        deviceBrand: 'Chromebook'
      }
    }

    // Desktop platforms
    if (
      osData.osPlatform === 'Windows' ||
      osData.osPlatform === 'macOS' ||
      osData.osPlatform === 'Linux' ||
      osData.osPlatform === 'FreeBSD' ||
      osData.osPlatform === 'OpenBSD' ||
      osData.osPlatform === 'NetBSD' ||
      osData.osPlatform === 'Solaris'
    ) {
      const brand = osData.osPlatform === 'macOS'
        ? 'Apple Mac'
        : 'PC'
      return {
        deviceType: 'Desktop',
        deviceBrand: brand
      }
    }

    // Generic fallback using signals
    const touchPoints =
      navigator.maxTouchPoints || 0
    const hasTouchScreen =
      touchPoints > 0 ||
      'ontouchstart' in window

    if (hasTouchScreen) {
      const isLargeScreen =
        Math.min(
          screen.width, screen.height
        ) >= 600
      return {
        deviceType: isLargeScreen
          ? 'Tablet'
          : 'Mobile',
        deviceBrand: 'Unknown'
      }
    }

    return {
      deviceType: 'Desktop',
      deviceBrand: 'Unknown'
    }
  }

  // Complete device brand detection
  const detectDeviceBrand = (ua) => {
    const brands = [
      // Tier 1 Global brands
      { p: /Samsung/i,           b: 'Samsung' },
      { p: /iPhone|iPad|iPod/i,  b: 'Apple' },
      { p: /Huawei|HUAWEI/i,     b: 'Huawei' },
      { p: /Xiaomi|MIUI|Redmi/i, b: 'Xiaomi' },
      { p: /OPPO/i,              b: 'OPPO' },
      { p: /Vivo/i,              b: 'Vivo' },
      { p: /OnePlus/i,           b: 'OnePlus' },
      { p: /Google|Nexus/i,      b: 'Google' },
      { p: /Motorola|moto[_ ]/i, b: 'Motorola' },
      { p: /Nokia/i,             b: 'Nokia' },
      { p: /Sony/i,              b: 'Sony' },
      { p: /LG[\/\-_ ]/i,        b: 'LG' },
      { p: /HTC/i,               b: 'HTC' },
      { p: /ASUS|Asus/i,         b: 'ASUS' },
      { p: /Lenovo/i,            b: 'Lenovo' },
      { p: /ZTE/i,               b: 'ZTE' },
      { p: /Alcatel/i,           b: 'Alcatel' },
      { p: /Microsoft/i,         b: 'Microsoft' },

      // Realme / iQOO / Poco / Poco
      { p: /Realme|REALME/i,     b: 'Realme' },
      { p: /iQOO/i,              b: 'iQOO' },
      { p: /POCO/i,              b: 'Poco' },
      { p: /Nothing/i,           b: 'Nothing' },

      // African market brands
      { p: /Tecno|TECNO/i,       b: 'Tecno' },
      { p: /Infinix|INFINIX/i,   b: 'Infinix' },
      { p: /Itel|ITEL/i,         b: 'Itel' },

      // Indian market brands
      { p: /Micromax/i,          b: 'Micromax' },
      { p: /Lava/i,              b: 'Lava' },
      { p: /Karbonn/i,           b: 'Karbonn' },
      { p: /Gionee/i,            b: 'Gionee' },
      { p: /Intex/i,             b: 'Intex' },
      { p: /Spice/i,             b: 'Spice' },

      // Chinese market brands
      { p: /Meizu|MEIZU/i,       b: 'Meizu' },
      { p: /Coolpad/i,           b: 'Coolpad' },
      { p: /Nubia/i,             b: 'Nubia' },
      { p: /ZTE/i,               b: 'ZTE' },
      { p: /TCL/i,               b: 'TCL' },
      { p: /Hisense/i,           b: 'Hisense' },
      { p: /Haier/i,             b: 'Haier' },
      { p: /Coocaa/i,            b: 'Coocaa' },
      { p: /Black Shark/i,       b: 'Black Shark' },
      { p: /Red Magic/i,         b: 'Red Magic' },

      // European market brands
      { p: /Wiko/i,              b: 'Wiko' },
      { p: /Fairphone/i,         b: 'Fairphone' },
      { p: /BQ /i,               b: 'BQ' },

      // North American brands
      { p: /Blu[/ ]/i,           b: 'BLU' },
      { p: /Kyocera/i,           b: 'Kyocera' },

      // Rugged device brands
      { p: /Caterpillar|CAT /i,  b: 'CAT' },
      { p: /Sonim/i,             b: 'Sonim' },
      { p: /AGM/i,               b: 'AGM' },
      { p: /Doogee/i,            b: 'Doogee' },
      { p: /Ulefone/i,           b: 'Ulefone' },
      { p: /Oukitel/i,           b: 'Oukitel' },
      { p: /Blackview/i,         b: 'Blackview' },
      { p: /Cubot/i,             b: 'Cubot' },
      { p: /Umidigi/i,           b: 'Umidigi' },

      // Gaming phones
      { p: /ROG Phone/i,         b: 'ASUS ROG' },
      { p: /Razer/i,             b: 'Razer' },

      // Sharp / Fujitsu / Panasonic (Japan)
      { p: /Sharp/i,             b: 'Sharp' },
      { p: /Fujitsu/i,           b: 'Fujitsu' },
      { p: /Panasonic/i,         b: 'Panasonic' },

      // Energizer / Emporia
      { p: /Energizer/i,         b: 'Energizer' },
      { p: /Emporia/i,           b: 'Emporia' },

      // BlackBerry
      { p: /BlackBerry/i,        b: 'BlackBerry' }
    ]

    for (const { p, b } of brands) {
      if (p.test(ua)) return b
    }

    // Try to extract model number as fallback
    const modelMatch = ua.match(
      /;\s*([A-Z][A-Z0-9\-_]+)\s+Build\//
    )
    if (modelMatch?.[1]) {
      return modelMatch[1]
    }

    return 'Unknown'
  }

  // ───────────────────────────────────────
  // HARDWARE DETECTION
  // ───────────────────────────────────────

  const detectHardware = () => {
    return {
      cpuCores: navigator.hardwareConcurrency ||
        null,
      ram: navigator.deviceMemory || null
    }
  }

  // ───────────────────────────────────────
  // SCREEN AND DISPLAY DETECTION
  // ───────────────────────────────────────

  const detectScreen = () => {
    const colorGamut = (() => {
      if (!window.matchMedia) return 'srgb'
      if (window.matchMedia(
        '(color-gamut: rec2020)'
      ).matches) return 'rec2020'
      if (window.matchMedia(
        '(color-gamut: p3)'
      ).matches) return 'p3'
      return 'srgb'
    })()

    const hdr = window.matchMedia
      ? window.matchMedia(
          '(dynamic-range: high)'
        ).matches
      : false

    return {
      screenWidth: screen.width || null,
      screenHeight: screen.height || null,
      viewportWidth: window.innerWidth || null,
      viewportHeight: window.innerHeight || null,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: screen.colorDepth || null,
      colorGamut: colorGamut,
      hdrSupport: hdr,
      orientation:
        screen.orientation?.type ||
        (window.innerWidth > window.innerHeight
          ? 'landscape'
          : 'portrait')
    }
  }

  // ───────────────────────────────────────
  // INPUT AND INTERACTION DETECTION
  // ───────────────────────────────────────

  const detectInput = () => {
    const maxTouchPoints =
      navigator.maxTouchPoints || 0
    const touchSupport =
      maxTouchPoints > 0 ||
      'ontouchstart' in window ||
      window.TouchEvent !== undefined

    const pointerSupport =
      window.PointerEvent !== undefined

    const orientationSupport =
      'orientation' in window ||
      screen.orientation !== undefined

    const gamepadSupport =
      'getGamepads' in navigator

    const vibrationSupport =
      'vibrate' in navigator

    return {
      touchSupport,
      maxTouchPoints,
      orientationSupport,
      pointerSupport,
      gamepadSupport,
      vibrationSupport
    }
  }

  // ───────────────────────────────────────
  // CAPABILITY TIER COMPUTATION
  // ───────────────────────────────────────

  const computeCapabilityTier = (
    cpuCores,
    ram,
    deviceType
  ) => {
    const tier = getDeviceTier(
      cpuCores || 0,
      ram || 0
    )

    // Mobile and tablet devices
    // get one tier lower than desktop
    // because mobile cores less powerful
    if (
      deviceType === 'Mobile' ||
      deviceType === 'Tablet'
    ) {
      const tiers = [
        'Low', 'Mid', 'High', 'Flagship'
      ]
      const idx = tiers.indexOf(tier)
      return idx > 0 ? tiers[idx - 1] : 'Low'
    }

    return tier
  }

  // ───────────────────────────────────────
  // MAIN COLLECTION FUNCTION
  // ───────────────────────────────────────

  const collect = async () => {
    logSystem('INFO', 'Device engine collecting')

    const ua = navigator.userAgent

    // Try client hints first (Layer 1)
    const hints = await collectFromClientHints()

    let osData
    let browserData

    if (hints) {
      // Use client hints where available
      osData = osFromClientHints(hints) ||
        detectOS(ua)
      browserData = browserFromClientHints(hints) ||
        detectBrowser(ua)
    } else {
      // Fall back to UA parsing (Layer 2)
      osData = detectOS(ua)
      browserData = detectBrowser(ua)
    }

    const deviceTypeData = detectDeviceType(
      ua, osData
    )
    const hardware = detectHardware()
    const screenData = detectScreen()
    const inputData = detectInput()

    const capabilityTier = computeCapabilityTier(
      hardware.cpuCores,
      hardware.ram,
      deviceTypeData.deviceType
    )

    // Merge client hints device model
    // if available and brand is unknown
    let deviceBrand = deviceTypeData.deviceBrand
    if (
      deviceBrand === 'Unknown' &&
      hints?.model
    ) {
      deviceBrand = hints.model
    }

    const deviceData = {
      // OS
      os: osData.os,
      osVersion: osData.osVersion,

      // Browser
      browser: browserData.browser,
      browserVersion: browserData.browserVersion,
      browserEngine: browserData.browserEngine,

      // Device type and brand
      deviceType: deviceTypeData.deviceType,
      deviceBrand: deviceBrand,

      // Hardware
      cpuCores: hardware.cpuCores,
      ram: hardware.ram,

      // Screen
      screenWidth: screenData.screenWidth,
      screenHeight: screenData.screenHeight,
      viewportWidth: screenData.viewportWidth,
      viewportHeight: screenData.viewportHeight,
      pixelRatio: screenData.pixelRatio,
      colorDepth: screenData.colorDepth,
      colorGamut: screenData.colorGamut,
      hdrSupport: screenData.hdrSupport,
      orientation: screenData.orientation,

      // Input
      touchSupport: inputData.touchSupport,
      maxTouchPoints: inputData.maxTouchPoints,
      orientationSupport:
        inputData.orientationSupport,
      pointerSupport: inputData.pointerSupport,
      gamepadSupport: inputData.gamepadSupport,
      vibrationSupport: inputData.vibrationSupport,

      // Architecture from client hints
      architecture: hints?.architecture || null,
      bitness: hints?.bitness || null,

      // Computed
      capabilityTier: capabilityTier,

      // Detection source
      detectionSource: hints
        ? 'client-hints'
        : 'ua-parsing'
    }

    // Update STATE
    updateDevice(deviceData)
    markEngineComplete('device')

    logDevice(
      'INFO',
      `${deviceData.deviceBrand} ` +
      `${deviceData.deviceType} detected — ` +
      `${deviceData.os} — ` +
      `${deviceData.browser} — ` +
      `${deviceData.capabilityTier} tier`
    )

    return deviceData
  }

  // ───────────────────────────────────────
  // RESIZE HANDLER
  // ───────────────────────────────────────

  const handleResize = () => {
    const screenData = detectScreen()
    updateDevice({
      viewportWidth: screenData.viewportWidth,
      viewportHeight: screenData.viewportHeight,
      orientation: screenData.orientation
    })
  }

  const initResizeListener = () => {
    window.addEventListener(
      'resize',
      debounce(handleResize, 250)
    )
    window.addEventListener(
      'orientationchange',
      debounce(handleResize, 250)
    )
  }

  return {
    collect,
    initResizeListener,
    detectOS,
    detectBrowser,
    detectDeviceType,
    detectDeviceBrand,
    detectHardware,
    detectScreen
  }

})()
