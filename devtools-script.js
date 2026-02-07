// ===== 전역 상태 =====
let isDark = false;
let isKorean = true;

let array = [];
let sorting = false;

let htmlCM, cssCM, jsCM;

// ===== DOM 로드 이후 =====
window.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeToggle");
  const langBtn = document.getElementById("langToggle");

  /* 다크 / 라이트 */
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    isDark = !isDark;
    themeBtn.textContent = isDark ? "Light" : "Dark";
  });

  /* 언어 토글 */
  langBtn.addEventListener("click", () => {
    isKorean = !isKorean;
    langBtn.textContent = isKorean ? "EN" : "KO";

    document.querySelectorAll("[data-ko]").forEach(el => {
      const newText = isKorean ? el.dataset.ko : el.dataset.en;
      if (
        el.tagName === "BUTTON" ||
        el.tagName === "OPTION" ||
        el.tagName === "SPAN" ||
        el.tagName === "LABEL"
      ) {
        el.textContent = newText;
      } else {
        el.innerHTML = newText;
      }
    });

    if (typeof updateDescription === "function") {
      updateDescription();
    }
  });

  // ===== CodeMirror 초기화 =====
  htmlCM = CodeMirror.fromTextArea(
    document.getElementById("htmlEditor"),
    {
      mode: "xml",
      theme: "dracula",
      lineNumbers: true,
      autoCloseBrackets: true
    }
  );

  cssCM = CodeMirror.fromTextArea(
    document.getElementById("cssEditor"),
    {
      mode: "css",
      theme: "dracula",
      lineNumbers: true,
      autoCloseBrackets: true
    }
  );

  jsCM = CodeMirror.fromTextArea(
    document.getElementById("jsEditor"),
    {
      mode: "javascript",
      theme: "dracula",
      lineNumbers: true,
      autoCloseBrackets: true
    }
  );

  // ===== 초기화 =====
  generateArray();
  runCode();
  generateASCIITable();
});


// ===== 정렬 알고리즘 설명 =====
const algorithmDescriptions = {
  bubble: {
    ko: {
      title: "💡 버블 정렬 (Bubble Sort)",
      description: "인접한 두 원소를 비교하여 큰 값을 뒤로 보냅니다.",
      complexity: ["⏱️ O(n²)", "📦 O(1)", "✅ 안정 정렬"]
    },
    en: {
      title: "💡 Bubble Sort",
      description: "Compares adjacent elements and moves larger values backward.",
      complexity: ["⏱️ O(n²)", "📦 O(1)", "✅ Stable"]
    }
  },
  selection: {
    ko: {
      title: "💡 선택 정렬 (Selection Sort)",
      description: "가장 작은 값을 선택해 앞으로 보냅니다.",
      complexity: ["⏱️ O(n²)", "📦 O(1)", "❌ 불안정"]
    },
    en: {
      title: "💡 Selection Sort",
      description: "Selects the smallest value and places it at the front.",
      complexity: ["⏱️ O(n²)", "📦 O(1)", "❌ Unstable"]
    }
  },
  insertion: {
    ko: {
      title: "💡 삽입 정렬 (Insertion Sort)",
      description: "정렬된 부분에 적절한 위치로 삽입합니다.",
      complexity: ["⏱️ O(n²)", "📦 O(1)", "✅ 안정"]
    },
    en: {
      title: "💡 Insertion Sort",
      description: "Inserts elements into the correct position.",
      complexity: ["⏱️ O(n²)", "📦 O(1)", "✅ Stable"]
    }
  },
  quick: {
    ko: {
      title: "💡 퀵 정렬 (Quick Sort)",
      description: "기준값을 중심으로 분할하며 정렬합니다.",
      complexity: ["⏱️ 평균 O(n log n)", "⏱️ 최악 O(n²)", "❌ 불안정"]
    },
    en: {
      title: "💡 Quick Sort",
      description: "Partitions data around a pivot.",
      complexity: ["⏱️ Avg O(n log n)", "⏱️ Worst O(n²)", "❌ Unstable"]
    }
  }
};

function updateDescription() {
  const algorithm = document.getElementById("algorithm").value;
  const lang = isKorean ? "ko" : "en";
  const desc = algorithmDescriptions[algorithm][lang];

  document.getElementById("algorithmDescription").innerHTML = `
    <h3>${desc.title}</h3>
    <p>${desc.description}</p>
    <ul>${desc.complexity.map(v => `<li>${v}</li>`).join("")}</ul>
  `;
}


// ===== 정렬 로직 (기존 그대로) =====
function generateArray() {
  array = Array.from({ length: 30 }, () =>
    Math.floor(Math.random() * 320) + 30
  );
  displayArray();
}

function displayArray() {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";
  array.forEach(v => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${v}px`;
    container.appendChild(bar);
  });
}


// ===== 코드 에디터 실행 =====
function runCode() {
  const html = htmlCM.getValue();
  const css = `<style>${cssCM.getValue()}</style>`;
  const js = `<script>${jsCM.getValue()}<\/script>`;
  document.getElementById("preview").srcdoc = html + css + js;
}


// ===== ASCII 테이블 =====
function generateASCIITable() {
  const container = document.getElementById("asciiTableContainer");
  let html = "<table><tr><th>Char</th><th>Dec</th></tr>";
  for (let i = 32; i < 128; i++) {
    html += `<tr><td>${String.fromCharCode(i)}</td><td>${i}</td></tr>`;
  }
  html += "</table>";
  container.innerHTML = html;
}
