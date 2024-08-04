
function toggleContent(contentId) {
  const content = document.getElementById(contentId);
  content.parentElement.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('wordsearch-grid');
  const size = 10; // Tamanho da grade do jogo (10x10)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Gerar a grade do caça-palavras
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement('div');
    div.textContent = letters.charAt(Math.floor(Math.random() * letters.length));
    grid.appendChild(div);
  }
});

const words = ["escola", "noticias", "jornal", "reportagem", "site", "tecnologia"];
const gridSize = 10; // Tamanho da grade
let grid = [];
let startX, startY, isDragging = false;

function generateWordSearch() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(' '));

  function placeWord(word) {
    const directions = [
      [0, 1],  // direita
      [1, 0],  // abaixo
      [1, 1],  // diagonal direita abaixo
      [-1, 1]  // diagonal esquerda abaixo
    ];
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
    let x, y;

    for (let attempt = 0; attempt < 100; attempt++) {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize || (grid[nx][ny] !== ' ' && grid[nx][ny] !== word[i])) {
          fits = false;
          break;
        }
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) {
          grid[x + i * dx][y + i * dy] = word[i];
        }
        return;
      }
    }
    generateWordSearch();
  }

  words.forEach(placeWord);

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid[x][y] === ' ') {
        grid[x][y] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  renderGrid();
}

function renderGrid() {
  const wordSearchElement = document.getElementById('word-search');
  wordSearchElement.innerHTML = '';
  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      const div = document.createElement('div');
      div.textContent = cell;
      div.dataset.x = x;
      div.dataset.y = y;
      div.addEventListener('mousedown', () => {
        startX = x;
        startY = y;
        isDragging = true;
        div.classList.add('highlight');
      });
      div.addEventListener('mouseover', () => {
        if (isDragging) {
          div.classList.add('highlight');
        }
      });
      div.addEventListener('mouseup', () => {
        isDragging = false;
        checkWord();
      });
      wordSearchElement.appendChild(div);
    });
  });
}

function checkWord() {
  const highlights = document.querySelectorAll('.word-search-grid .highlight');
  if (highlights.length === 0) return;

  const word = Array.from(highlights).map(cell => cell.textContent).join('');
  if (words.includes(word)) {
    alert(`Parabéns! Você encontrou a palavra "${word}".`);
  } else {
    alert(`A palavra "${word}" não está correta.`);
  }

  highlights.forEach(cell => cell.classList.remove('highlight'));
}

function revealSolution() {
  const wordSearchElement = document.getElementById('word-search');
  let html = wordSearchElement.innerHTML;
  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    html = html.replace(regex, `<span style="background-color: yellow;">$1</span>`);
  });
  wordSearchElement.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', generateWordSearch);
