// 버튼 가져오기
const themeBtn = document.getElementById("themeToggle");
const langBtn = document.getElementById("langToggle");

// 상태값
let isDark = true;
let isKorean = false;

/* =====================
   다크 / 라이트 토글
===================== */
if (themeBtn) {
  themeBtn.textContent = "Dark";

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    isDark = !isDark;
    themeBtn.textContent = isDark ? "Dark" : "Light";
  });
}

/* =====================
   한국어 / 영어 토글
===================== */
if (langBtn) {
  langBtn.textContent = "KR";

  langBtn.addEventListener("click", () => {
    isKorean = !isKorean;
    langBtn.textContent = isKorean ? "EN" : "KR";

    document.querySelectorAll("[data-ko][data-en]").forEach(el => {
      el.textContent = isKorean
        ? el.dataset.ko
        : el.dataset.en;
    });
  });
}
