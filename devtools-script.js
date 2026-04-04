const THEME_KEY = "captain-devtools-theme";
const LANG_KEY = "captain-devtools-lang";

let isDark = localStorage.getItem(THEME_KEY)
  ? localStorage.getItem(THEME_KEY) === "dark"
  : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
let isKorean = localStorage.getItem(LANG_KEY)
  ? localStorage.getItem(LANG_KEY) === "ko"
  : true;

let array = [];
let originalArray = [];
let sorting = false;
let htmlCM;
let cssCM;
let jsCM;

const algorithmDescriptions = {
  bubble: {
    ko: {
      title: "버블 정렬 (Bubble Sort)",
      description: "인접한 두 값을 비교해서 큰 값을 뒤로 보내는 가장 직관적인 정렬입니다.",
      complexity: ["시간 O(n^2)", "공간 O(1)", "안정 정렬"]
    },
    en: {
      title: "Bubble Sort",
      description: "Compares adjacent elements and moves larger values backward.",
      complexity: ["Time O(n^2)", "Space O(1)", "Stable"]
    }
  },
  selection: {
    ko: {
      title: "선택 정렬 (Selection Sort)",
      description: "매번 가장 작은 값을 골라 앞쪽으로 보내는 방식입니다.",
      complexity: ["시간 O(n^2)", "공간 O(1)", "비안정 정렬"]
    },
    en: {
      title: "Selection Sort",
      description: "Selects the smallest value and places it at the front.",
      complexity: ["Time O(n^2)", "Space O(1)", "Unstable"]
    }
  },
  insertion: {
    ko: {
      title: "삽입 정렬 (Insertion Sort)",
      description: "정렬된 구간에 새로운 값을 알맞은 위치로 끼워 넣습니다.",
      complexity: ["시간 O(n^2)", "공간 O(1)", "안정 정렬"]
    },
    en: {
      title: "Insertion Sort",
      description: "Inserts each element into its correct position.",
      complexity: ["Time O(n^2)", "Space O(1)", "Stable"]
    }
  },
  quick: {
    ko: {
      title: "퀵 정렬 (Quick Sort)",
      description: "피벗을 기준으로 나누어 정렬하는 빠른 분할 정렬입니다.",
      complexity: ["평균 O(n log n)", "최악 O(n^2)", "비안정 정렬"]
    },
    en: {
      title: "Quick Sort",
      description: "Partitions data around a pivot.",
      complexity: ["Avg O(n log n)", "Worst O(n^2)", "Unstable"]
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeToggle");
  const langBtn = document.getElementById("langToggle");
  const yearEl = document.getElementById("year");
  const backToTopBtn = document.getElementById("backToTop");
  const githubLogos = document.querySelectorAll('img[alt="GitHub"]');

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
      const value = isKorean ? el.dataset.ko : el.dataset.en;
      if (["BUTTON", "OPTION", "SPAN", "LABEL", "H3", "P", "A"].includes(el.tagName)) {
        el.textContent = value;
      } else {
        el.innerHTML = value;
      }
    });

    updateDescription();
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
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("is-visible", window.scrollY > 500);
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  applyTheme();
  applyLanguage();

  htmlCM = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
    mode: "text/html",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchBrackets: true
  });

  cssCM = CodeMirror.fromTextArea(document.getElementById("cssEditor"), {
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true
  });

  jsCM = CodeMirror.fromTextArea(document.getElementById("jsEditor"), {
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true
  });

  cssCM.getWrapperElement().style.display = "none";
  jsCM.getWrapperElement().style.display = "none";

  const editors = { html: htmlCM, css: cssCM, js: jsCM };
  document.querySelectorAll(".editor-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".editor-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const lang = tab.dataset.lang;
      Object.entries(editors).forEach(([key, cm]) => {
        const show = key === lang;
        cm.getWrapperElement().style.display = show ? "" : "none";
        if (show) setTimeout(() => cm.refresh(), 0);
      });
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      runCode();
    }
  });

  generateArray();
  runCode();
  generateASCIITable();
  convertColor("hex");
  updateMarkdownPreview();
  document.getElementById("markdownInput").addEventListener("input", updateMarkdownPreview);
});

function updateDescription() {
  const algorithm = document.getElementById("algorithm").value;
  const lang = isKorean ? "ko" : "en";
  const desc = algorithmDescriptions[algorithm][lang];

  document.getElementById("algorithmDescription").innerHTML = `
    <h3>${desc.title}</h3>
    <p>${desc.description}</p>
    <ul>${desc.complexity.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

function generateArray() {
  if (sorting) return;
  array = Array.from({ length: 30 }, () => Math.floor(Math.random() * 320) + 30);
  originalArray = [...array];
  displayArray();
}

function displayArray(highlight = {}) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    if (highlight.sorted && highlight.sorted.includes(index)) bar.classList.add("sorted");
    if (highlight.comparing && highlight.comparing.includes(index)) bar.classList.add("comparing");
    if (highlight.swapping && highlight.swapping.includes(index)) bar.classList.add("swapping");
    bar.style.height = `${value}px`;
    container.appendChild(bar);
  });
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

  (async () => {
    if (algo === "bubble") await bubbleSort(delay);
    else if (algo === "selection") await selectionSort(delay);
    else if (algo === "insertion") await insertionSort(delay);
    else if (algo === "quick") await quickSort(0, array.length - 1, delay);
    displayArray({ sorted: array.map((_, i) => i) });
    sorting = false;
  })();
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
    const value = array[i];
    let j = i - 1;
    displayArray({ comparing: [i], sorted });
    await sleep(delay);
    while (j >= 0 && array[j] > value) {
      array[j + 1] = array[j];
      const leftSorted = Array.from({ length: j }, (_, k) => k);
      displayArray({ comparing: [j + 1], swapping: [j], sorted: leftSorted });
      await sleep(delay);
      j--;
    }
    array[j + 1] = value;
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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runCode() {
  const html = htmlCM.getValue();
  const css = cssCM.getValue();
  const js = jsCM.getValue().replace(/<\/script>/gi, "<\\/script>");

  let output = html;
  if (output.includes("</head>")) {
    output = output.replace("</head>", `<style>${css}</style></head>`);
  } else {
    output = `<head><style>${css}</style></head><body>${output}</body>`;
  }

  if (output.includes("</body>")) {
    output = output.replace("</body>", `<script>${js}</script></body>`);
  } else {
    output += `<script>${js}</script>`;
  }

  document.getElementById("preview").srcdoc = output;
}

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
      container.innerHTML = '<p class="placeholder">No matches</p>';
      return;
    }

    container.innerHTML = matches
      .map(
        (match, index) => `
          <div class="match-item">
            <strong>#${index + 1}</strong> "${match[0]}"${match.index !== undefined ? ` @ index ${match.index}` : ""}
            ${match.groups && Object.keys(match.groups).length ? `<br>Groups: ${JSON.stringify(match.groups)}` : ""}
          </div>`
      )
      .join("");
  } catch (error) {
    container.innerHTML = `<p style="color:#cf222e">Error: ${error.message}</p>`;
  }
}

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

  let num = parseInt(input, base);
  if (Number.isNaN(num)) return;

  document.getElementById("decimal").value = num.toString(10);
  document.getElementById("binary").value = num.toString(2);
  document.getElementById("octal").value = num.toString(8);
  document.getElementById("hexadecimal").value = num.toString(16).toUpperCase();
}

function generateASCIITable() {
  const container = document.getElementById("asciiTableContainer");
  const range = document.getElementById("charRange").value;
  const search = (document.getElementById("searchChar").value || "").toLowerCase();
  let chars = [];

  if (range === "basic") {
    for (let i = 32; i < 128; i++) chars.push([i, String.fromCharCode(i)]);
  } else if (range === "extended") {
    for (let i = 0; i < 256; i++) chars.push([i, String.fromCharCode(i)]);
  } else {
    for (let i = 0xac00; i <= 0xd7a3; i += 50) chars.push([i, String.fromCharCode(i)]);
  }

  if (search) {
    chars = chars.filter(([code, ch]) => ch.toLowerCase().includes(search) || code.toString().includes(search));
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

function formatJSON() {
  const input = document.getElementById("jsonInput").value;
  const output = document.getElementById("jsonOutput");

  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed, null, 2);
    output.style.color = "";
  } catch (error) {
    output.value = `Error: ${error.message}`;
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
  } catch (error) {
    output.value = `Error: ${error.message}`;
    output.style.color = "#cf222e";
  }
}

function validateJSON() {
  const input = document.getElementById("jsonInput").value;
  const output = document.getElementById("jsonOutput");

  try {
    JSON.parse(input);
    output.value = "Valid JSON";
    output.style.color = "#1a7f37";
  } catch (error) {
    output.value = `Error: ${error.message}`;
    output.style.color = "#cf222e";
  }
}

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
    if (!hex.startsWith("#")) hex = `#${hex}`;
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

function updateMarkdownPreview() {
  const input = document.getElementById("markdownInput").value;
  const preview = document.getElementById("markdownPreview");

  if (typeof marked !== "undefined") {
    preview.innerHTML = (marked.parse || marked)(input || "");
  } else {
    preview.textContent = input;
  }
}
