(function () {
  const locales = {};
  let currentLanguage = "ar";
  let isInitialized = false;

  const TeI18n = {
    /**
     * Register a new language bundle
     * @param {string} code - Language code (e.g., 'ar', 'en', 'fr')
     * @param {object} bundle - Locale bundle containing meta, strings, safetyTable
     */
    registerLocale: function (code, bundle) {
      locales[code] = bundle;
      if (isInitialized && currentLanguage === code) {
        this.applyLanguage(code);
      }
    },

    /**
     * Get locale bundle by language code
     */
    getLocale: function (code) {
      return locales[code] || null;
    },

    /**
     * Get list of registered language codes
     */
    getAvailableLanguages: function () {
      return Object.keys(locales);
    },

    /**
     * Get active locale bundle
     */
    getCurrentLocale: function () {
      return locales[currentLanguage] || locales["ar"];
    },

    /**
     * Get active language code
     */
    getCurrentLanguage: function () {
      return currentLanguage;
    },

    /**
     * Translate a key
     */
    t: function (key, fallback) {
      const locale = this.getCurrentLocale();
      if (locale && locale.strings && locale.strings[key] !== undefined) {
        return locale.strings[key];
      }
      return fallback !== undefined ? fallback : key;
    },

    /**
     * Switch language and update DOM
     */
    setLanguage: function (lang) {
      if (!locales[lang]) {
        console.warn(`[TeI18n] Locale '${lang}' not loaded yet.`);
      }
      currentLanguage = lang;
      try {
        localStorage.setItem("te_privacy_lang", lang);
      } catch (e) {
        // LocalStorage may be unavailable in some private browsing modes
      }
      this.applyLanguage(lang);
    },

    /**
     * Apply language strings, direction, and attributes to DOM
     */
    applyLanguage: function (lang) {
      const locale = locales[lang] || locales["ar"];
      if (!locale) return;

      const meta = locale.meta || { lang: lang, dir: lang === "ar" ? "rtl" : "ltr" };

      document.documentElement.lang = meta.lang || lang;
      document.documentElement.dir = meta.dir || (lang === "ar" ? "rtl" : "ltr");
      document.body.className = "lang-" + (meta.lang || lang);

      // 1. Update Title & Meta description
      if (locale.strings.docTitle) {
        document.title = locale.strings.docTitle;
      }
      const metaDesc = document.getElementById("metaDescription");
      if (metaDesc && locale.strings.metaDescription) {
        metaDesc.setAttribute("content", locale.strings.metaDescription);
      }

      // 2. Update elements with data-i18n (plain text)
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        if (locale.strings[key] !== undefined) {
          el.textContent = locale.strings[key];
        }
      });

      // 3. Update elements with data-i18n-html (HTML formatted)
      document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
        const key = el.getAttribute("data-i18n-html");
        if (locale.strings[key] !== undefined) {
          el.innerHTML = locale.strings[key];
        }
      });

      // 4. Update elements with data-i18n-attr (e.g. "aria-label:key,title:key")
      document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
        const specs = el.getAttribute("data-i18n-attr").split(",");
        specs.forEach(function (spec) {
          const parts = spec.split(":");
          if (parts.length === 2) {
            const attr = parts[0].trim();
            const key = parts[1].trim();
            if (locale.strings[key] !== undefined) {
              el.setAttribute(attr, locale.strings[key]);
            }
          }
        });
      });

      // 5. Direct ID matching fallback for full compatibility
      for (const [id, value] of Object.entries(locale.strings)) {
        const el = document.getElementById(id);
        if (el && !el.hasAttribute("data-i18n") && !el.hasAttribute("data-i18n-html")) {
          el.innerHTML = value;
        }
      }

      // 6. Notify listeners (for rendering dynamic tables, charts, etc.)
      window.dispatchEvent(
        new CustomEvent("te-language-changed", {
          detail: {
            lang: lang,
            locale: locale
          }
        })
      );
    },

    /**
     * Initialize engine on DOMContentLoaded
     */
    init: function (defaultLang) {
      let saved = null;
      try {
        saved = localStorage.getItem("te_privacy_lang");
      } catch (e) {}

      // Consume pre-registered locales from window.teLocales if loaded earlier
      if (window.teLocales) {
        for (const code of Object.keys(window.teLocales)) {
          locales[code] = window.teLocales[code];
        }
      }

      currentLanguage = saved || defaultLang || "ar";
      isInitialized = true;
      this.applyLanguage(currentLanguage);
    }
  };

  window.TeI18n = TeI18n;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = TeI18n;
  }
})();
