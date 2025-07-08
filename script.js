
// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDPKpLipcgz25gKsoeAi_Vo9kf7dLrWkLc",
  authDomain: "bingo-multiplayer-d4139.firebaseapp.com",
  projectId: "bingo-multiplayer-d4139",
  storageBucket: "bingo-multiplayer-d4139.firebasestorage.app",
  messagingSenderId: "993509419940",
  appId: "1:993509419940:web:67a0ea1738c7aa32ff6f31",
  measurementId: "G-BJ5YS9CHQB"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample basic script setup for demonstration
function generateGame() {
  const gameId = document.getElementById('gameId').value.trim();
  const title = document.getElementById('cardTitle').value.trim();
  const numPlayers = document.getElementById('numPlayers').value.trim();
  const pattern = document.getElementById('winPattern').value;
  const items = document.getElementById('items').value.trim().split("\n");

  if (!gameId || items.length < 15) {
    alert("Please fill in required fields and ensure you have 15 items.");
    return;
  }

  const gameRef = ref(database, 'games/' + gameId);
  set(gameRef, {
    title,
    numPlayers,
    pattern,
    items
  }).then(() => {
    alert("Game created! Share this link: ?gameId=" + gameId);
  });
}
