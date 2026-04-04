const themeBtn = document.getElementById("themeToggle");
const langBtn = document.getElementById("langToggle");
const yearEl = document.getElementById("year");
const backToTopBtn = document.getElementById("backToTop");
const githubLogos = document.querySelectorAll('img[alt="GitHub"]');

const THEME_KEY = "captain-theme";
const LANG_KEY = "captain-lang";

const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
let isDark = localStorage.getItem(THEME_KEY)
  ? localStorage.getItem(THEME_KEY) === "dark"
  : systemPrefersDark;
let isKorean = localStorage.getItem(LANG_KEY)
  ? localStorage.getItem(LANG_KEY) === "ko"
  : true;

function applyTheme() {
  document.body.classList.toggle("dark", isDark);
  themeBtn.textContent = isDark ? "Light" : "Dark";
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

  githubLogos.forEach((logo) => {
    logo.src = isDark ? "images/github_v2.png" : "images/github.png";
  });
}

function applyLanguage() {
  document.documentElement.lang = isKorean ? "ko" : "en";
  langBtn.textContent = isKorean ? "EN" : "KO";
  localStorage.setItem(LANG_KEY, isKorean ? "ko" : "en");

  document.querySelectorAll("[data-ko]").forEach((el) => {
    el.textContent = isKorean ? el.dataset.ko : el.dataset.en;
  });
}

themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  applyTheme();
});

langBtn.addEventListener("click", () => {
  isKorean = !isKorean;
  applyLanguage();
});

window.addEventListener("scroll", () => {
  backToTopBtn.classList.toggle("is-visible", window.scrollY > 500);
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

applyTheme();
applyLanguage();
