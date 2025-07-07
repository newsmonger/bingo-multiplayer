document.getElementById('createGameForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const gameId = document.getElementById('gameId').value;
  const numPlayers = parseInt(document.getElementById('numPlayers').value);
  const pattern = document.getElementById('winPattern').value;
  const items = document.getElementById('items').value.trim().split('\n');
  const linksContainer = document.getElementById('links');
  linksContainer.innerHTML = '';
  for (let i = 1; i <= numPlayers; i++) {
    const playerLink = document.createElement('a');
    playerLink.href = \`?gameId=\${gameId}&cardId=player\${i}\`;
    playerLink.textContent = \`Player \${i}\`;
    playerLink.target = '_blank';
    linksContainer.appendChild(playerLink);
    linksContainer.appendChild(document.createElement('br'));
  }
  alert('Game links generated! Share them with players.');
});