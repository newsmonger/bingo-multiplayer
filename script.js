function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)];
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generatePattern(type) {
  const patterns = {
    row: [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]],
    column: [[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]],
    diagonal: [[0,5,10,15],[3,6,9,12]],
    x: [[0,3,5,6,9,10,12,15]],
    full: [[...Array(16).keys()]],
  };
  if (type === 'random') {
    const keys = Object.keys(patterns);
    type = keys[Math.floor(Math.random() * keys.length)];
  }
  return { type, pattern: patterns[type] };
}

function createCard(title, items, pattern) {
  const card = document.createElement('div');
  card.innerHTML = '<h2>' + title + '</h2><p>Win Pattern: ' + pattern.type + '</p>';
  const grid = document.createElement('div');
  grid.className = 'card';
  const shuffled = shuffle([...items]);
  shuffled.splice(7, 0, 'FREE SPACE');
  shuffled.forEach((text, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerText = text;
    cell.onclick = () => {
      cell.classList.toggle('marked');
      checkWin();
    };
    grid.appendChild(cell);
  });
  card.appendChild(grid);
  document.body.innerHTML = '';
  document.body.appendChild(card);

  function checkWin() {
    const cells = [...grid.children];
    const marked = cells.map(c => c.classList.contains('marked'));
    if (pattern.pattern.some(line => line.every(i => marked[i]))) {
      setTimeout(() => alert('🎉 Bingo! You win!'), 10);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('play') === '1') {
    const title = decodeURIComponent(params.get('title'));
    const pattern = JSON.parse(decodeURIComponent(params.get('pattern')));
    const items = decodeURIComponent(params.get('items')).split('||');
    createCard(title, items, pattern);
    return;
  }

  const form = document.getElementById('gameForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const count = parseInt(document.getElementById('count').value);
    const patternChoice = document.getElementById('pattern').value;
    const items = document.getElementById('items').value.trim().split('\n');
    if (items.length < 15) {
      alert('Please enter at least 15 items.');
      return;
    }
    const pattern = generatePattern(patternChoice);
    const linksDiv = document.getElementById('links');
    linksDiv.innerHTML = '<h3>Player Links:</h3>';
    for (let i = 0; i < count; i++) {
      const link = document.createElement('a');
      const randomizedItems = shuffle([...items]);
      link.href = location.pathname + '?play=1&title=' + encodeURIComponent(title) +
        '&pattern=' + encodeURIComponent(JSON.stringify(pattern)) +
        '&items=' + encodeURIComponent(randomizedItems.join('||'));
      link.target = '_blank';
      link.innerText = 'Player ' + (i + 1);
      linksDiv.appendChild(link);
      linksDiv.appendChild(document.createElement('br'));
    }
  });
});