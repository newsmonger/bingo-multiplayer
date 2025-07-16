
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)];
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function randomPattern() {
  const patterns = ['row', 'column', 'diagonal', 'fourCorners', 'fullCard'];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

function generateLinks() {
  const title = encodeURIComponent(document.getElementById('title').value.trim());
  const numPlayers = parseInt(document.getElementById('numPlayers').value);
  const rawItems = document.getElementById('items').value.trim().split("\n").filter(x => x);
  const patternSelect = document.getElementById('pattern').value;
  const output = document.getElementById('output');

  if (rawItems.length < 15) {
    alert("Please enter at least 15 items.");
    return;
  }

  let pattern = patternSelect === "random" ? randomPattern() : patternSelect;
  const links = [];
  for (let i = 0; i < numPlayers; i++) {
    const shuffled = shuffle([...rawItems]);
    const url = new URL(window.location.href);
    url.pathname = 'bingo.html';
    url.searchParams.set('title', title);
    url.searchParams.set('pattern', pattern);
    url.searchParams.set('items', shuffled.join('|'));
    links.push(`<a href="${url.href}" target="_blank">Player ${i + 1}</a>`);
  }

  output.innerHTML = "<h3>Share these links:</h3><p>" + links.join("<br/>") + "</p>";
}
