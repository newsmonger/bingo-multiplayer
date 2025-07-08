// Initialize Firebase using compat SDK
const firebaseConfig = {
  apiKey: "AIzaSyDPKpLipcgz25gKsoeAi_Vo9kf7dLrWkLc",
  authDomain: "bingo-multiplayer-d4139.firebaseapp.com",
  projectId: "bingo-multiplayer-d4139",
  storageBucket: "bingo-multiplayer-d4139.firebasestorage.app",
  messagingSenderId: "993509419940",
  appId: "1:993509419940:web:67a0ea1738c7aa32ff6f31",
  measurementId: "G-BJ5YS9CHQB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Populate player input fields when number changes
document.getElementById("numPlayers").addEventListener("change", function () {
  const num = parseInt(this.value);
  const container = document.getElementById("playerNames");
  container.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "player" + i + "Name";
    input.placeholder = "Player " + i + " Name";
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
  }
});

// Game creation logic
document.getElementById("game-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const gameId = document.getElementById("gameId").value.trim();
  const title = document.getElementById("title").value.trim();
  const pattern = document.getElementById("pattern").value;
  const items = document.getElementById("items").value.trim().split("\n");
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  const playerNames = [];

  for (let i = 1; i <= numPlayers; i++) {
    const name = document.getElementById("player" + i + "Name").value.trim();
    playerNames.push(name || "Player " + i);
  }

  const shuffledCards = playerNames.map(() => {
    const shuffled = items.slice().sort(() => Math.random() - 0.5);
    shuffled.splice(7, 0, "FREE SPACE");
    return shuffled;
  });

  const gameData = {
    title,
    pattern,
    players: playerNames.reduce((acc, name, idx) => {
      acc[name] = {
        name,
        card: shuffledCards[idx],
        marks: Array(16).fill(false),
        winner: false
      };
      return acc;
    }, {}),
    winner: null
  };

  db.collection("games").doc(gameId).set(gameData).then(() => {
    const links = playerNames.map((name) => {
      return `<li><a href="?gameId=${gameId}&cardId=${encodeURIComponent(name)}" target="_blank">${name}</a></li>`;
    });
    document.getElementById("links").innerHTML = "<h3>Share These Links:</h3><ul>" + links.join("") + "</ul>";
  }).catch(err => {
    console.error("Error creating game:", err);
    alert("Failed to create game. Check console for details.");
  });
});