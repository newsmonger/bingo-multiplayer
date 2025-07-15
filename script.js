
function generateLinks() {
  const gameId = document.getElementById('gameId').value.trim();
  const cardTitle = document.getElementById('cardTitle').value.trim();
  const numPlayers = parseInt(document.getElementById('numPlayers').value, 10);
  const winPattern = document.getElementById('winPattern').value;
  const items = document.getElementById('items').value.trim().split('\n');

  if (items.length !== 15 || !gameId || !cardTitle || isNaN(numPlayers) || numPlayers < 1) {
    alert('Please fill in all fields and provide exactly 15 items.');
    return;
  }

  const baseUrl = location.href.split('?')[0];
  const pattern = winPattern === 'random' ? ['diagonal', 'fourCorners', 'fullCard'][Math.floor(Math.random() * 3)] : winPattern;

  let linksHTML = '<h3>Share these links:</h3>';
  for (let i = 1; i <= numPlayers; i++) {
    const cardId = 'player' + i;
    const url = `${baseUrl.replace(/\/index.html$/, '')}?gameId=${gameId}&cardId=${cardId}&title=${encodeURIComponent(cardTitle)}&pattern=${pattern}`;
    linksHTML += `<a href="${url}" target="_blank">${cardId} - ${url}</a>`;
  }

  document.getElementById('links').innerHTML = linksHTML;
}
