function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function getWinPatterns(pattern, board) {
  const patterns = {
    row: () => Array.from({length: 5}, (_, i) => Array.from({length: 5}, (_, j) => i * 5 + j)),
    column: () => Array.from({length: 5}, (_, i) => Array.from({length: 5}, (_, j) => j * 5 + i)),
    diagonal: () => [[0, 6, 12, 18, 24], [4, 8, 12, 16, 20]],
    fourCorners: () => [[0, 4, 20, 24]],
    fullCard: () => [board.map((_, i) => i)],
  };
  return patterns[pattern] ? patterns[pattern]() : patterns.row();
}

function generateLinks() {
  const gameId = document.getElementById("gameId").value.trim();
  const cardTitle = encodeURIComponent(document.getElementById("cardTitle").value.trim());
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  const pattern = document.getElementById("winPattern").value;
  const itemsRaw = document.getElementById("items").value.trim();
  const items = itemsRaw.split("\n").map(s => s.trim()).filter(s => s !== "");
  if (items.length < 15) { alert("Enter at least 15 items."); return; }

  const finalPattern = (pattern === "random") ?
    ["row", "column", "diagonal", "fourCorners", "fullCard"][Math.floor(Math.random()*5)] :
    pattern;

  const linksContainer = document.getElementById("links");
  linksContainer.innerHTML = "";
  for (let i = 1; i <= numPlayers; i++) {
    const cardItems = shuffle([...items]).slice(0, 24);
    const url = new URL(window.location.href);
    url.searchParams.set("gameId", gameId);
    url.searchParams.set("cardId", `player${i}`);
    url.searchParams.set("title", cardTitle);
    url.searchParams.set("pattern", finalPattern);
    url.searchParams.set("items", encodeURIComponent(JSON.stringify(cardItems)));
    const a = document.createElement("a");
    a.href = url.toString();
    a.textContent = `player${i} - ${url.toString()}`;
    a.style.display = "block";
    a.style.color = "lime";
    linksContainer.appendChild(a);
  }
  document.getElementById("share-links").style.display = "block";
}

function initCardView() {
  const urlParams = new URLSearchParams(window.location.search);
  const title = decodeURIComponent(urlParams.get("title") || "");
  const pattern = urlParams.get("pattern");
  const itemsJson = decodeURIComponent(urlParams.get("items") || "[]");
  let items;
  try { items = JSON.parse(itemsJson); } catch { items = []; }

  if (!title || !pattern || items.length < 24) return;

  const allItems = [...items.slice(0, 12), "Free", ...items.slice(12, 24)];
  const boardEl = document.getElementById("board");
  const squares = [];

  allItems.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "square";
    div.textContent = item;
    if (item === "Free") div.classList.add("marked");
    div.addEventListener("click", () => {
      div.classList.toggle("marked");
      checkWin();
    });
    boardEl.appendChild(div);
    squares.push(div);
  });

  document.getElementById("card-title").textContent = decodeURIComponent(title);
  document.getElementById("pattern-name").textContent = pattern;
  document.getElementById("game-setup").style.display = "none";
  document.getElementById("share-links").style.display = "none";
  document.getElementById("bingo-board").style.display = "block";

  function checkWin() {
    const marked = squares.map(s => s.classList.contains("marked"));
    const winSets = getWinPatterns(pattern, squares);
    for (const combo of winSets) {
      if (combo.every(i => marked[i])) {
        alert("🎉 Bingo! You win!");
        break;
      }
    }
  }
}

window.onload = () => {
  if (window.location.search.includes("items=")) {
    initCardView();
  }
};
