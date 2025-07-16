function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function getWinningPatterns() {
  const row = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24]];
  const column = [[0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24]];
  const diagonal = [[0,6,12,18,24],[4,8,12,16,20]];
  const fourCorners = [[0,4,20,24]];
  const fullCard = [Array.from({length:25}, (_,i)=>i)];
  return { row, column, diagonal, fourCorners, fullCard };
}

function renderCard(title, items, pattern) {
  document.getElementById('gameForm').style.display = 'none';
  document.getElementById('linksContainer').style.display = 'none';
  document.getElementById('cardContainer').style.display = 'block';
  document.getElementById('cardTitleDisplay').textContent = title;
  document.getElementById('winPatternDisplay').textContent = 'Winning Pattern: ' + pattern;

  const card = document.getElementById('bingoCard');
  card.innerHTML = '';
  const fullItems = [...items.slice(0,12), 'Free', ...items.slice(12)];
  fullItems.forEach((text, i) => {
    const div = document.createElement('div');
    div.textContent = text;
    if (text === 'Free') {
      div.classList.add('free', 'marked');
    }
    div.addEventListener('click', () => {
      div.classList.toggle('marked');
      checkWin(pattern);
    });
    card.appendChild(div);
  });
}

function checkWin(patternName) {
  const patterns = getWinningPatterns()[patternName] || [];
  const cells = Array.from(document.querySelectorAll('#bingoCard div'));
  const marked = cells.map(c => c.classList.contains('marked'));
  for (const pat of patterns) {
    if (pat.every(i => marked[i])) {
      alert('🎉 Bingo! You win!');
      break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get('cardId');
  const itemsRaw = params.get('items');
  if (cardId && itemsRaw) {
    const items = decodeURIComponent(itemsRaw).split('|');
    shuffle(items);
    renderCard(params.get('title') || 'Bingo', items, params.get('pattern') || 'row');
  }

  document.getElementById('generateBtn')?.addEventListener('click', () => {
    const gameId = document.getElementById('gameId').value.trim();
    const cardTitle = document.getElementById('cardTitle').value.trim();
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    const pattern = document.getElementById('pattern').value;
    const items = document.getElementById('items').value.trim().split('\n').filter(Boolean);
    if (items.length < 15) return alert('Enter at least 15 items');

    const links = [];
    for (let i = 0; i < numPlayers; i++) {
      const url = new URL(window.location.href);
      url.searchParams.set('gameId', gameId);
      url.searchParams.set('cardId', `player${i+1}`);
      url.searchParams.set('title', cardTitle);
      url.searchParams.set('pattern', pattern === 'random' ? randomPattern() : pattern);
      url.searchParams.set('items', encodeURIComponent(items.join('|')));
      links.push({ player: `player${i+1}`, url: url.toString() });
    }

    const ul = document.getElementById('playerLinks');
    ul.innerHTML = '';
    links.forEach(link => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${link.url}" target="_blank">${link.player} - ${link.url}</a>`;
      ul.appendChild(li);
    });
    document.getElementById('linksContainer').style.display = 'block';
  });
});

function randomPattern() {
  const options = ['row', 'column', 'diagonal', 'fourCorners', 'fullCard'];
  return options[Math.floor(Math.random() * options.length)];
}