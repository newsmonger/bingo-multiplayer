function $(id) { return document.getElementById(id); }

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const cardId = urlParams.get("cardId");
const title = urlParams.get("title");
const pattern = urlParams.get("pattern");

window.onload = () => {
  if (gameId && cardId && title) {
    showCardView();
  } else {
    $("creator-form").classList.remove("hidden");
  }
};

function generateGame() {
  const gameId = $("gameId").value.trim();
  const title = $("cardTitle").value.trim();
  const numPlayers = parseInt($("numPlayers").value);
  const pattern = $("winPattern").value;
  const items = $("items").value.trim().split("\n").filter(Boolean);
  if (!gameId || !title || items.length < 15 || numPlayers < 1) return alert("Fill all fields with 15 items");

  const patternOptions = ["diagonal", "fourCorners", "fullCard"];
  const selectedPattern = pattern === "random"
    ? patternOptions[Math.floor(Math.random() * patternOptions.length)]
    : pattern;

  let output = "";
  for (let i = 1; i <= numPlayers; i++) {
    const playerItems = shuffle(items);
    const link = location.origin + location.pathname +
      `?gameId=${encodeURIComponent(gameId)}&cardId=player${i}&title=${encodeURIComponent(title)}&pattern=${selectedPattern}`;
    output += `<p><a href="${link}" target="_blank">player${i} - ${link}</a></p>`;
  }
  $("creator-form").classList.add("hidden");
  $("playerLinks").innerHTML = output;
  $("links").classList.remove("hidden");
}

function showCardView() {
  $("cardTitleDisplay").innerText = title;
  $("bingoCard").classList.remove("hidden");
  const table = $("bingoTable");
  const allItems = getFallbackItems().slice(0, 24);
  let index = 0;
  for (let r = 0; r < 5; r++) {
    const row = table.insertRow();
    for (let c = 0; c < 5; c++) {
      const cell = row.insertCell();
      if (r === 2 && c === 2) {
        cell.textContent = "Free";
        cell.classList.add("marked");
        continue;
      }
      cell.textContent = allItems[index++];
      cell.onclick = () => {
        cell.classList.toggle("marked");
        checkWin(pattern);
      };
    }
  }
  $("patternType").innerText = `Winning Pattern: ${pattern}`;
}

function shuffle(arr) {
  return arr.map(x => [Math.random(), x]).sort().map(x => x[1]);
}

function resetCard() {
  document.querySelectorAll("td.marked").forEach(td => td.classList.remove("marked"));
}

function checkWin(type) {
  const grid = Array.from(document.querySelectorAll("table tr")).map(row =>
    Array.from(row.cells).map(cell => cell.classList.contains("marked")));

  const diag1 = [0,1,2,3,4].every(i => grid[i][i]);
  const diag2 = [0,1,2,3,4].every(i => grid[i][4-i]);
  const fourCorners = [grid[0][0], grid[0][4], grid[4][0], grid[4][4]].every(Boolean);
  const full = grid.flat().every(Boolean);

  let win = false;
  if (type === "diagonal") win = diag1 || diag2;
  if (type === "fourCorners") win = fourCorners;
  if (type === "fullCard") win = full;

  if (win) celebrate();
}

function celebrate() {
  alert("🎉 Bingo! You win!");
}

function getFallbackItems() {
  return Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`);
}