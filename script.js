/**
 * TeEcclesia Privacy Policy & Data Safety Application Script
 * Orchestrates themes, navigation, safety table rendering, and connects to TeI18n.
 */

// ============================================================================
// 1. Data Safety Table Renderer
// ============================================================================
function renderSafetyTable(locale) {
  const tbody = document.getElementById("safetyTableBody");
  if (!tbody || !locale || !locale.safetyTable) return;

  let html = "";
  locale.safetyTable.forEach(row => {
    const isSharedNo =
      row.shared === "لا تتم مشاركتها" ||
      row.shared === "لا تتم مشاركتها نهائياً" ||
      row.shared === "Never shared" ||
      row.shared === "Never shared with third parties";

    const sharedClass = isSharedNo ? "no" : "security";
    const deleteClass = "yes";

    html += `
      <tr>
        <td><strong>${row.type}</strong></td>
        <td>${row.items}</td>
        <td>${row.purpose}</td>
        <td><span class="badge-cell ${sharedClass}">${row.shared}</span></td>
        <td><span class="badge-cell security">${row.encrypted}</span></td>
        <td><span class="badge-cell ${deleteClass}">${row.delete}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// ============================================================================
// 2. Light & Dark Theme Manager (TeEcclesia DesignSystem Colors)
// ============================================================================
let currentTheme =
  localStorage.getItem("te_theme") ||
  (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function applyTheme(theme) {
  currentTheme = theme;
  try {
    localStorage.setItem("te_theme", theme);
  } catch (e) {}

  document.documentElement.setAttribute("data-theme", theme);

  const sunIcon = document.getElementById("themeIconSun");
  const moonIcon = document.getElementById("themeIconMoon");
  const themeBtn = document.getElementById("themeToggleBtn");
  const themeLabel = document.getElementById("themeLabel");

  const currentLang = window.TeI18n ? window.TeI18n.getCurrentLanguage() : "ar";

  if (theme === "dark") {
    if (sunIcon) sunIcon.style.display = "block";
    if (moonIcon) moonIcon.style.display = "none";
    if (themeLabel) {
      themeLabel.textContent = currentLang === "ar" ? "الوضع النهاري" : "Light Mode";
    }
    if (themeBtn) {
      const label = currentLang === "ar" ? "التحويل للوضع النهاري" : "Switch to Light Mode";
      themeBtn.setAttribute("title", label);
      themeBtn.setAttribute("aria-label", label);
    }
  } else {
    if (sunIcon) sunIcon.style.display = "none";
    if (moonIcon) moonIcon.style.display = "block";
    if (themeLabel) {
      themeLabel.textContent = currentLang === "ar" ? "الوضع الليلي" : "Dark Mode";
    }
    if (themeBtn) {
      const label = currentLang === "ar" ? "التحويل للوضع الليلي" : "Switch to Dark Mode";
      themeBtn.setAttribute("title", label);
      themeBtn.setAttribute("aria-label", label);
    }
  }
}

// ============================================================================
// 3. Application Lifecycle Initialization
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize i18n engine
  if (window.TeI18n) {
    window.TeI18n.init("ar");
  }

  // 2. Initialize Theme
  applyTheme(currentTheme);

  // 3. Render Safety Table on language change event
  window.addEventListener("te-language-changed", e => {
    const locale = e.detail.locale;
    renderSafetyTable(locale);
    applyTheme(currentTheme);
  });

  // Initial render of table with current locale
  if (window.TeI18n) {
    renderSafetyTable(window.TeI18n.getCurrentLocale());
  }

  // 4. Language switch button click handler (Cycles through available languages)
  const langBtn = document.getElementById("langToggleBtn");
  if (langBtn && window.TeI18n) {
    langBtn.addEventListener("click", () => {
      const current = window.TeI18n.getCurrentLanguage();
      const nextLang = current === "ar" ? "en" : "ar";
      window.TeI18n.setLanguage(nextLang);
    });
  }

  // 5. Theme toggle button click handler
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  // 6. OS theme preference change listener
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      if (!localStorage.getItem("te_theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  // 7. Navigation pills active state on scroll
  const sections = document.querySelectorAll("main section");
  const navPills = document.querySelectorAll(".nav-pill");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.scrollY + 175;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute("id");
      }
    });

    navPills.forEach(pill => {
      pill.classList.remove("active");
      if (pill.getAttribute("href") === `#${current}`) {
        pill.classList.add("active");
      }
    });
  });
});
