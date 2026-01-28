const themeBtn = document.getElementById("themeToggle");
const langBtn = document.getElementById("langToggle");

let isDark = true;
let isKorean = false;

/* 다크 / 라이트 */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  isDark = !isDark;
  themeBtn.textContent = isDark ? "Dark" : "Light";
});

/* 한국어 / 영어 */
langBtn.addEventListener("click", () => {
  isKorean = !isKorean;
  langBtn.textContent = isKorean ? "EN" : "KR";

  document.querySelectorAll("[data-ko]").forEach(el => {
    el.textContent = isKorean ? el.dataset.ko : el.dataset.en;
  });
});
