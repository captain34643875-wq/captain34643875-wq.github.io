const themeBtn = document.getElementById("themeToggle");
const langBtn = document.getElementById("langToggle");
const githubLogo = document.querySelector('img[alt="GitHub"]'); // GitHub 로고 선택

let isDark = false;   // 처음은 라이트
let isKorean = true; // 처음은 한국어

/* 다크 / 라이트 */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  isDark = !isDark;
  themeBtn.textContent = isDark ? "Light" : "Dark";
  
  // 🔥 GitHub 로고 변경 추가
  if (isDark) {
    githubLogo.src = "images/github_v2.png"; // 다크모드용
  } else {
    githubLogo.src = "images/github.png";    // 라이트모드용
  }
});

/* 언어 토글 */
langBtn.addEventListener("click", () => {
  isKorean = !isKorean;
  langBtn.textContent = isKorean ? "EN" : "KO";

  document.querySelectorAll("[data-ko]").forEach(el => {
    el.textContent = isKorean ? el.dataset.ko : el.dataset.en;
  });
});