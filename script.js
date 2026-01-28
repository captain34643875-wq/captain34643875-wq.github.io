const themeBtn = document.getElementById("themeToggle");
const langBtn = document.getElementById("langToggle");

let isDark = false;  // 처음은 라이트
let isKorean = false;

/* 다크 / 라이트 */

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  isDark = !isDark;
  themeBtn.textContent = isDark ? "Light" : "Dark";
});


/* 한국어 / 영어 */
langBtn.addEventListener("click", () => {
  isKorean = !isKorean;
  langBtn.textContent = isKorean ? "EN" : "KR";

  document.querySelectorAll("[data-ko]").forEach(el => {
    el.textContent = isKorean ? el.dataset.ko : el.dataset.en;
  });
});
