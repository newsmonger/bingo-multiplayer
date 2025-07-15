document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDPKpLipcgz25gKsoeAi_Vo9kf7dLrWkLc",
    authDomain: "bingo-multiplayer-d4139.firebaseapp.com",
    databaseURL: "https://bingo-multiplayer-d4139-default-rtdb.firebaseio.com",
    projectId: "bingo-multiplayer-d4139",
    storageBucket: "bingo-multiplayer-d4139.appspot.com",
    messagingSenderId: "993509419940",
    appId: "1:993509419940:web:67a0ea1738c7aa32ff6f31"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  const form = document.getElementById("gameForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const gameId = document.getElementById("gameId").value.trim();
    const cardTitle = document.getElementById("cardTitle").value.trim();
    const numPlayers = parseInt(document.getElementById("numPlayers").value.trim());
    const winningPattern = document.getElementById("winningPattern").value;
    const items = document.getElementById("items").value.trim().split("\n").slice(0, 15);

    if (gameId && cardTitle && numPlayers > 0 && items.length === 15) {
      db.ref("games/" + gameId).set({
        title: cardTitle,
        numPlayers,
        winningPattern,
        items
      }).then(() => {
        window.location.href = `player.html?game=${gameId}&player=1`;
      });
    } else {
      alert("Please complete all fields with exactly 15 items.");
    }
  });
});
