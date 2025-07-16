document.getElementById("gameForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = encodeURIComponent(document.getElementById("title").value.trim());
  const numCards = parseInt(document.getElementById("numCards").value);
  const pattern = document.getElementById("pattern").value;
  let items = document.getElementById("items").value
    .split("\n")
    .map(i => i.trim())
    .filter(i => i);
  if (items.length !== 15) {
    alert("Please enter exactly 15 items.");
    return;
  }
  const allLinks = [];
  const sharedPattern = pattern === "random" ? pickRandomPattern() : pattern;
  for (let i = 0; i < numCards; i++) {
    const shuffled = shuffle([...items]);
    const cardItems = shuffled.slice(0, 15);
    cardItems.splice(7, 0, "Free"); // Insert Free space in center
    const url = "card.html?title=" + title +
      "&pattern=" + sharedPattern +
      "&items=" + encodeURIComponent(JSON.stringify(cardItems));
    allLinks.push(\`<a href="\${url}" target="_blank">Card \${i + 1}</a>\`);
  }
  document.getElementById("links").innerHTML = "<h3>Share these links:</h3>" + allLinks.join("");
});

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandomPattern() {
  const patterns = ["row", "column", "diagonal", "fourCorners", "fullCard"];
  return patterns[Math.floor(Math.random() * patterns.length)];
}
