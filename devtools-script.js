const themeBtn = document.getElementById("themeToggle");
const langBtn = document.getElementById("langToggle");

let isDark = false;
let isKorean = true;

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
    
    // 버튼이나 옵션의 경우 textContent 사용
    if (el.tagName === 'BUTTON' || el.tagName === 'OPTION' || el.tagName === 'SPAN' || el.tagName === 'LABEL') {
      el.textContent = newText;
    } else {
      // 다른 요소는 innerHTML 사용 (이모지 유지)
      el.innerHTML = newText;
    }
  });
  
  // 정렬 알고리즘 설명 업데이트
  if (typeof updateDescription === 'function') {
    updateDescription();
  }
});

// ===== 정렬 알고리즘 =====
let array = [];
let sorting = false;

const algorithmDescriptions = {
  bubble: {
    ko: {
      title: "💡 버블 정렬 (Bubble Sort)",
      description: "인접한 두 원소를 비교하여 큰 값을 뒤로 보냅니다. 마치 거품이 위로 올라오듯 가장 큰 값이 맨 뒤로 이동합니다.",
      complexity: ["⏱️ 시간 복잡도: O(n²)", "📦 공간 복잡도: O(1)", "✅ 안정 정렬"]
    },
    en: {
      title: "💡 Bubble Sort",
      description: "Compares adjacent elements and moves larger values backward, like bubbles rising to the surface.",
      complexity: ["⏱️ Time Complexity: O(n²)", "📦 Space Complexity: O(1)", "✅ Stable Sort"]
    }
  },
  selection: {
    ko: {
      title: "💡 선택 정렬 (Selection Sort)",
      description: "매 단계마다 가장 작은 원소를 찾아서 앞으로 보냅니다. 정렬되지 않은 부분에서 최솟값을 선택하는 방식입니다.",
      complexity: ["⏱️ 시간 복잡도: O(n²)", "📦 공간 복잡도: O(1)", "❌ 불안정 정렬"]
    },
    en: {
      title: "💡 Selection Sort",
      description: "Finds the smallest element in each step and moves it to the front.",
      complexity: ["⏱️ Time Complexity: O(n²)", "📦 Space Complexity: O(1)", "❌ Unstable Sort"]
    }
  },
  insertion: {
    ko: {
      title: "💡 삽입 정렬 (Insertion Sort)",
      description: "카드를 정렬하듯이 각 원소를 이미 정렬된 부분의 적절한 위치에 삽입합니다. 거의 정렬된 데이터에 효율적입니다.",
      complexity: ["⏱️ 시간 복잡도: O(n²)", "📦 공간 복잡도: O(1)", "✅ 안정 정렬"]
    },
    en: {
      title: "💡 Insertion Sort",
      description: "Like sorting cards, inserts each element into its proper position in the sorted portion.",
      complexity: ["⏱️ Time Complexity: O(n²)", "📦 Space Complexity: O(1)", "✅ Stable Sort"]
    }
  },
  quick: {
    ko: {
      title: "💡 퀵 정렬 (Quick Sort)",
      description: "기준값(pivot)을 선택하여 작은 값은 왼쪽, 큰 값은 오른쪽으로 분할하며 정렬합니다. 가장 빠른 정렬 알고리즘 중 하나입니다.",
      complexity: ["⏱️ 평균: O(n log n)", "⏱️ 최악: O(n²)", "📦 공간 복잡도: O(log n)", "❌ 불안정 정렬"]
    },
    en: {
      title: "💡 Quick Sort",
      description: "Selects a pivot and partitions values into smaller (left) and larger (right) groups. One of the fastest sorting algorithms.",
      complexity: ["⏱️ Average: O(n log n)", "⏱️ Worst: O(n²)", "📦 Space Complexity: O(log n)", "❌ Unstable Sort"]
    }
  }
};

function updateDescription() {
  const algorithm = document.getElementById('algorithm').value;
  const lang = isKorean ? 'ko' : 'en';
  const desc = algorithmDescriptions[algorithm][lang];
  
  const container = document.getElementById('algorithmDescription');
  container.innerHTML = `
    <h3>${desc.title}</h3>
    <p>${desc.description}</p>
    <ul>
      ${desc.complexity.map(item => `<li>${item}</li>`).join('')}
    </ul>
  `;
}

function generateArray() {
  const size = 30;
  array = Array.from({length: size}, () => Math.floor(Math.random() * 320) + 30);
  displayArray();
}

function displayArray(comparingIndices = [], swappingIndices = [], sortedIndices = []) {
  const container = document.getElementById('arrayContainer');
  container.innerHTML = '';
  array.forEach((value, idx) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${value}px`;
    if (comparingIndices.includes(idx)) bar.classList.add('comparing');
    if (swappingIndices.includes(idx)) bar.classList.add('swapping');
    if (sortedIndices.includes(idx)) bar.classList.add('sorted');
    container.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
  const sorted = [];
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (!sorting) return;
      displayArray([j, j + 1], [], sorted);
      await sleep(101 - document.getElementById('speed').value);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        displayArray([], [j, j + 1], sorted);
        await sleep(101 - document.getElementById('speed').value);
      }
    }
    sorted.push(array.length - i - 1);
  }
  sorted.push(0);
  displayArray([], [], sorted);
}

async function selectionSort() {
  const sorted = [];
  for (let i = 0; i < array.length; i++) {
    if (!sorting) return;
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      displayArray([i, j, minIdx], [], sorted);
      await sleep(101 - document.getElementById('speed').value);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      displayArray([], [i, minIdx], sorted);
      await sleep(101 - document.getElementById('speed').value);
    }
    sorted.push(i);
  }
  displayArray([], [], sorted);
}

async function insertionSort() {
  const sorted = [0];
  for (let i = 1; i < array.length; i++) {
    if (!sorting) return;
    let key = array[i];
    let j = i - 1;
    displayArray([i], [], sorted);
    await sleep(101 - document.getElementById('speed').value);
    
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      displayArray([j], [j + 1], sorted);
      await sleep(101 - document.getElementById('speed').value);
      j--;
    }
    array[j + 1] = key;
    sorted.push(i);
    displayArray([], [], sorted);
  }
}

async function quickSort(arr = array, start = 0, end = array.length - 1, sorted = new Set()) {
  if (!sorting || start >= end) return;
  
  let pivot = arr[end];
  let pivotIdx = start;
  
  for (let i = start; i < end; i++) {
    displayArray([i, end], [pivotIdx], Array.from(sorted));
    await sleep(101 - document.getElementById('speed').value);
    
    if (arr[i] < pivot) {
      [arr[i], arr[pivotIdx]] = [arr[pivotIdx], arr[i]];
      displayArray([i, end], [i, pivotIdx], Array.from(sorted));
      await sleep(101 - document.getElementById('speed').value);
      pivotIdx++;
    }
  }
  
  [arr[pivotIdx], arr[end]] = [arr[end], arr[pivotIdx]];
  sorted.add(pivotIdx);
  displayArray([], [pivotIdx, end], Array.from(sorted));
  await sleep(101 - document.getElementById('speed').value);
  
  await quickSort(arr, start, pivotIdx - 1, sorted);
  await quickSort(arr, pivotIdx + 1, end, sorted);
  
  if (start === 0 && end === array.length - 1) {
    displayArray([], [], Array.from({length: array.length}, (_, i) => i));
  }
}

async function startSort() {
  if (sorting) return;
  sorting = true;
  const algorithm = document.getElementById('algorithm').value;
  
  switch(algorithm) {
    case 'bubble': await bubbleSort(); break;
    case 'selection': await selectionSort(); break;
    case 'insertion': await insertionSort(); break;
    case 'quick': await quickSort(); break;
  }
  
  sorting = false;
}

function resetArray() {
  sorting = false;
  displayArray();
}

// ===== 코드 에디터 =====
document.querySelectorAll('.editor-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const lang = tab.dataset.lang;
    document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.code-editor').forEach(e => e.style.display = 'none');
    tab.classList.add('active');
    document.getElementById(lang + 'Editor').style.display = 'block';
  });
});

function runCode() {
  const html = document.getElementById('htmlEditor').value;
  const css = '<style>' + document.getElementById('cssEditor').value + '</style>';
  const js = '<script>' + document.getElementById('jsEditor').value + '<\/script>';
  
  const preview = document.getElementById('preview');
  const code = html + css + js;
  
  preview.srcdoc = code;
}

// Auto-run on Ctrl+Enter
document.querySelectorAll('.code-editor').forEach(editor => {
  editor.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      runCode();
    }
  });
});

// ===== 정규표현식 테스터 =====
function testRegex() {
  const pattern = document.getElementById('regexPattern').value;
  const testStr = document.getElementById('testString').value;
  const container = document.getElementById('regexMatches');
  
  let flags = '';
  if (document.getElementById('flagG').checked) flags += 'g';
  if (document.getElementById('flagI').checked) flags += 'i';
  if (document.getElementById('flagM').checked) flags += 'm';
  
  try {
    const regex = new RegExp(pattern, flags);
    const matches = testStr.matchAll(regex);
    const matchArray = Array.from(matches);
    
    if (matchArray.length === 0) {
      const noMatchText = isKorean ? '매칭되는 결과가 없습니다.' : 'No matches found.';
      container.innerHTML = `<p style="color: #d29922;">${noMatchText}</p>`;
      return;
    }
    
    const totalText = isKorean ? '총' : 'Total';
    const matchText = isKorean ? '개 매칭' : 'matches';
    let html = `<p style="color: #1a7f37; margin-bottom: 1rem; font-weight: 600;">${totalText} ${matchArray.length}${matchText}</p>`;
    
    matchArray.forEach((match, idx) => {
      const posText = isKorean ? '위치' : 'Position';
      html += `<div class="match-item">
        <strong>Match ${idx + 1}:</strong> <span class="match-highlight">${match[0]}</span>
        <br><small>${posText}: ${match.index}</small>
      </div>`;
    });
    
    container.innerHTML = html;
  } catch (e) {
    const errorText = isKorean ? '오류' : 'Error';
    container.innerHTML = `<p style="color: #cf222e;">${errorText}: ${e.message}</p>`;
  }
}

// ===== 진법 변환기 =====
function convertFrom(base) {
  const inputs = {
    2: 'binary',
    8: 'octal',
    10: 'decimal',
    16: 'hexadecimal'
  };
  
  const sourceId = inputs[base];
  const value = document.getElementById(sourceId).value.trim();
  
  if (!value) {
    Object.values(inputs).forEach(id => {
      if (id !== sourceId) document.getElementById(id).value = '';
    });
    return;
  }
  
  try {
    const decimal = parseInt(value, base);
    
    if (isNaN(decimal)) {
      throw new Error('Invalid input');
    }
    
    Object.entries(inputs).forEach(([targetBase, id]) => {
      if (id !== sourceId) {
        document.getElementById(id).value = decimal.toString(parseInt(targetBase));
      }
    });
  } catch (e) {
    Object.values(inputs).forEach(id => {
      if (id !== sourceId) document.getElementById(id).value = 'Error';
    });
  }
}

// ===== ASCII 테이블 =====
function generateASCIITable() {
  const range = document.getElementById('charRange').value;
  const container = document.getElementById('asciiTableContainer');
  
  let start, end;
  switch(range) {
    case 'basic':
      start = 0; end = 127; break;
    case 'extended':
      start = 0; end = 255; break;
    case 'korean':
      start = 0xAC00; end = 0xD7A3; break;
  }
  
  const charText = isKorean ? '문자' : 'Char';
  const decimalText = isKorean ? '10진수' : 'Decimal';
  const hexText = isKorean ? '16진수' : 'Hex';
  const octalText = isKorean ? '8진수' : 'Octal';
  const binaryText = isKorean ? '2진수' : 'Binary';
  
  let html = `<table>
    <thead>
      <tr>
        <th>${charText}</th>
        <th>${decimalText}</th>
        <th>${hexText}</th>
        <th>${octalText}</th>
        <th>${binaryText}</th>
      </tr>
    </thead>
    <tbody>`;
  
  const step = range === 'korean' ? 50 : 1;
  for (let i = start; i <= end && i < start + 500; i += step) {
    const char = String.fromCharCode(i);
    const displayChar = i < 33 || i === 127 ? `[${getControlCharName(i)}]` : char;
    
    html += `<tr>
      <td class="char-display">${displayChar}</td>
      <td>${i}</td>
      <td>0x${i.toString(16).toUpperCase()}</td>
      <td>0${i.toString(8)}</td>
      <td>${i.toString(2).padStart(8, '0')}</td>
    </tr>`;
  }
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function getControlCharName(code) {
  const names = {
    0: 'NULL', 9: 'TAB', 10: 'LF', 13: 'CR', 32: 'SPACE', 127: 'DEL'
  };
  return names[code] || 'CTRL';
}

function searchASCII() {
  const search = document.getElementById('searchChar').value;
  if (!search) {
    generateASCIITable();
    return;
  }
  
  const container = document.getElementById('asciiTableContainer');
  const char = search[0];
  const code = char.charCodeAt(0);
  
  const charText = isKorean ? '문자' : 'Char';
  const decimalText = isKorean ? '10진수' : 'Decimal';
  const hexText = isKorean ? '16진수' : 'Hex';
  const octalText = isKorean ? '8진수' : 'Octal';
  const binaryText = isKorean ? '2진수' : 'Binary';
  
  let html = `<table>
    <thead>
      <tr>
        <th>${charText}</th>
        <th>${decimalText}</th>
        <th>${hexText}</th>
        <th>${octalText}</th>
        <th>${binaryText}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="char-display">${char}</td>
        <td>${code}</td>
        <td>0x${code.toString(16).toUpperCase()}</td>
        <td>0${code.toString(8)}</td>
        <td>${code.toString(2).padStart(8, '0')}</td>
      </tr>
    </tbody>
  </table>`;
  
  container.innerHTML = html;
}

// ===== 초기화 =====
generateArray();
runCode();
generateASCIITable();