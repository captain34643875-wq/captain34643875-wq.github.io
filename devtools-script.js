// ===== 전역 상태 =====
let isDark = false;
let isKorean = true;

let array = [];
let originalArray = [];
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
        el.tagName === "LABEL" ||
        el.tagName === "H3" ||
        el.tagName === "P"
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
      mode: "text/html",
      theme: "dracula",
      lineNumbers: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      matchBrackets: true
    }
  );

  cssCM = CodeMirror.fromTextArea(
    document.getElementById("cssEditor"),
    {
      mode: "css",
      theme: "dracula",
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true
    }
  );

  jsCM = CodeMirror.fromTextArea(
    document.getElementById("jsEditor"),
    {
      mode: "javascript",
      theme: "dracula",
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true
    }
  );

  // 에디터 탭 전환 (초기: HTML만 표시)
  cssCM.getWrapperElement().style.display = "none";
  jsCM.getWrapperElement().style.display = "none";
  const editors = { html: htmlCM, css: cssCM, js: jsCM };
  document.querySelectorAll(".editor-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".editor-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const lang = tab.dataset.lang;
      Object.entries(editors).forEach(([k, cm]) => {
        const show = k === lang;
        cm.getWrapperElement().style.display = show ? "" : "none";
        if (show) setTimeout(() => cm.refresh(), 0);
      });
    });
  });

  // Ctrl + Enter 실행
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "Enter") {
      runCode();
    }
  });

  // ===== 초기화 =====
  generateArray();
  runCode();
  generateASCIITable();
  convertColor("hex");
  updateMarkdownPreview();
  document.getElementById("markdownInput").addEventListener("input", updateMarkdownPreview);
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


// ===== 정렬 로직 =====
function generateArray() {
  if (sorting) return;
  array = Array.from({ length: 30 }, () =>
    Math.floor(Math.random() * 320) + 30
  );
  originalArray = [...array];
  displayArray();
}

function displayArray(highlight = {}) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";
  array.forEach((v, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    if (highlight.sorted && highlight.sorted.includes(i)) bar.classList.add("sorted");
    if (highlight.comparing && highlight.comparing.includes(i)) bar.classList.add("comparing");
    if (highlight.swapping && highlight.swapping.includes(i)) bar.classList.add("swapping");
    bar.style.height = `${v}px`;
    container.appendChild(bar);
  });
}

function getBars() {
  return document.querySelectorAll("#arrayContainer .bar");
}

function getDelay() {
  const speed = parseInt(document.getElementById("speed").value, 10) || 50;
  return Math.max(20, (101 - speed) * 8);
}

function resetArray() {
  if (sorting) return;
  array = [...originalArray];
  displayArray();
}

function startSort() {
  if (sorting) return;
  sorting = true;
  originalArray = [...array];
  const algo = document.getElementById("algorithm").value;
  const delay = getDelay();

  const run = async () => {
    if (algo === "bubble") await bubbleSort(delay);
    else if (algo === "selection") await selectionSort(delay);
    else if (algo === "insertion") await insertionSort(delay);
    else if (algo === "quick") await quickSort(0, array.length - 1, delay);
    displayArray({ sorted: array.map((_, i) => i) });
    sorting = false;
  };
  run();
}

async function bubbleSort(delay) {
  const sorted = [];
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      displayArray({ comparing: [j, j + 1], sorted });
      await sleep(delay);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        displayArray({ swapping: [j, j + 1], sorted });
        await sleep(delay);
      }
    }
    sorted.push(array.length - 1 - i);
  }
  sorted.push(0);
  displayArray({ sorted: [...new Set(sorted)] });
}

async function selectionSort(delay) {
  const sorted = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      displayArray({ comparing: [i, j], sorted });
      await sleep(delay);
      if (array[j] < array[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      displayArray({ swapping: [i, minIdx], sorted });
      await sleep(delay);
    }
    sorted.push(i);
  }
  sorted.push(array.length - 1);
  displayArray({ sorted });
}

async function insertionSort(delay) {
  const sorted = [0];
  for (let i = 1; i < array.length; i++) {
    const val = array[i];
    let j = i - 1;
    displayArray({ comparing: [i], sorted });
    await sleep(delay);
    while (j >= 0 && array[j] > val) {
      array[j + 1] = array[j];
      const leftSorted = Array.from({ length: j }, (_, k) => k);
      displayArray({ comparing: [j + 1], swapping: [j], sorted: leftSorted });
      await sleep(delay);
      j--;
    }
    array[j + 1] = val;
    sorted.push(i);
    displayArray({ sorted });
    await sleep(delay);
  }
}

async function quickSort(low, high, delay) {
  if (low >= high) return;
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    displayArray({ comparing: [j, high] });
    await sleep(delay);
    if (array[j] <= pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      displayArray({ swapping: [i, j], comparing: [high] });
      await sleep(delay);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  displayArray({ comparing: [i + 1] });
  await sleep(delay);
  await quickSort(low, i, delay);
  await quickSort(i + 2, high, delay);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}


// ===== 코드 에디터 실행 =====
function runCode() {
  const html = htmlCM.getValue();
  const css = cssCM.getValue();
  const js = jsCM.getValue();

  let output = html;
  // CSS를 </head> 앞에 삽입
  if (output.includes("</head>")) {
    output = output.replace("</head>", `<style>${css}</style></head>`);
  } else {
    output = `<head><style>${css}</style></head><body>${output}</body>`;
  }
  // JS를 </body> 앞에 삽입 (</script> 이스케이프로 파싱 깨짐 방지)
  const safeJs = js.replace(/<\/script>/gi, "<\\/script>");
  if (output.includes("</body>")) {
    output = output.replace("</body>", `<script>${safeJs}<\/script></body>`);
  } else {
    output = output + `<script>${safeJs}<\/script>`;
  }

  document.getElementById("preview").srcdoc = output;
}


// ===== 정규표현식 테스터 =====
function testRegex() {
  const pattern = document.getElementById("regexPattern").value;
  const flags =
    (document.getElementById("flagG").checked ? "g" : "") +
    (document.getElementById("flagI").checked ? "i" : "") +
    (document.getElementById("flagM").checked ? "m" : "");
  const testStr = document.getElementById("testString").value;
  const container = document.getElementById("regexMatches");

  try {
    const regex = new RegExp(pattern, flags);
    const matches = [...testStr.matchAll(regex)];
    if (matches.length === 0) {
      container.innerHTML =
        '<p class="placeholder" data-ko="매칭 없음" data-en="No matches">매칭 없음</p>';
    } else {
      container.innerHTML = matches
        .map(
          (m, i) =>
            `<div class="match-item">
              <strong>#${i + 1}</strong> "${m[0]}"
              ${m.index !== undefined ? ` @ index ${m.index}` : ""}
              ${m.groups && Object.keys(m.groups).length ? `<br>Groups: ${JSON.stringify(m.groups)}` : ""}
            </div>`
        )
        .join("");
    }
  } catch (e) {
    container.innerHTML = `<p style="color:#cf222e">오류: ${e.message}</p>`;
  }
}


// ===== 진법 변환기 =====
function convertFrom(base) {
  const ids = { 2: "binary", 8: "octal", 10: "decimal", 16: "hexadecimal" };
  const input = document.getElementById(ids[base]).value.trim();
  if (!input) {
    document.getElementById("decimal").value = "";
    document.getElementById("binary").value = "";
    document.getElementById("octal").value = "";
    document.getElementById("hexadecimal").value = "";
    return;
  }
  let num;
  try {
    num = parseInt(input, base);
    if (isNaN(num)) throw new Error("Invalid");
  } catch {
    return;
  }
  document.getElementById("decimal").value = num.toString(10);
  document.getElementById("binary").value = num.toString(2);
  document.getElementById("octal").value = num.toString(8);
  document.getElementById("hexadecimal").value = num.toString(16).toUpperCase();
}


// ===== ASCII 테이블 =====
function generateASCIITable() {
  const container = document.getElementById("asciiTableContainer");
  const range = document.getElementById("charRange").value;
  const search = (document.getElementById("searchChar").value || "").toLowerCase();
  let chars = [];
  if (range === "basic") {
    for (let i = 32; i < 128; i++) chars.push([i, String.fromCharCode(i)]);
  } else if (range === "extended") {
    for (let i = 0; i < 256; i++) chars.push([i, String.fromCharCode(i)]);
  } else if (range === "korean") {
    for (let i = 0xac00; i <= 0xd7a3; i += 50) chars.push([i, String.fromCharCode(i)]);
  }
  if (search) {
    chars = chars.filter(
      ([code, ch]) =>
        ch.toLowerCase().includes(search) || code.toString().includes(search)
    );
  }
  let html = "<table><tr><th>Char</th><th>Dec</th><th>Hex</th></tr>";
  chars.forEach(([code, ch]) => {
    const safe = ch === "<" ? "&lt;" : ch === "&" ? "&amp;" : ch;
    html += `<tr><td class="char-display">${safe}</td><td>${code}</td><td>${code.toString(16).toUpperCase()}</td></tr>`;
  });
  html += "</table>";
  container.innerHTML = html;
}

function searchASCII() {
  generateASCIITable();
}


// ===== JSON 포맷터 =====
function formatJSON() {
  const input = document.getElementById("jsonInput").value;
  const output = document.getElementById("jsonOutput");
  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed, null, 2);
    output.style.color = "";
  } catch (e) {
    output.value = "❌ 오류: " + e.message;
    output.style.color = "#cf222e";
  }
}

function minifyJSON() {
  const input = document.getElementById("jsonInput").value;
  const output = document.getElementById("jsonOutput");
  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed);
    output.style.color = "";
  } catch (e) {
    output.value = "❌ 오류: " + e.message;
    output.style.color = "#cf222e";
  }
}

function validateJSON() {
  const input = document.getElementById("jsonInput").value;
  const output = document.getElementById("jsonOutput");
  try {
    JSON.parse(input);
    output.value = "✅ 유효한 JSON입니다.";
    output.style.color = "#1a7f37";
  } catch (e) {
    output.value = "❌ 오류: " + e.message;
    output.style.color = "#cf222e";
  }
}


// ===== 색상 변환기 =====
function convertColor(from) {
  const hexInput = document.getElementById("colorHex");
  const picker = document.getElementById("colorPicker");
  const rgbOutput = document.getElementById("colorRgb");
  const preview = document.getElementById("colorPreview");

  let hex = hexInput.value.trim();
  if (from === "picker") {
    hex = picker.value;
    hexInput.value = hex;
  } else {
    if (!hex.startsWith("#")) hex = "#" + hex;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) picker.value = hex;
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    rgbOutput.value = "";
    preview.style.background = "#ccc";
    return;
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  rgbOutput.value = `rgb(${r}, ${g}, ${b})`;
  preview.style.background = hex;
}


// ===== Markdown 미리보기 =====
function updateMarkdownPreview() {
  const input = document.getElementById("markdownInput").value;
  const preview = document.getElementById("markdownPreview");
  if (typeof marked !== "undefined") {
    preview.innerHTML = (marked.parse || marked)(input || "");
  } else {
    preview.textContent = input;
  }
}
