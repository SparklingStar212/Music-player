import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoOo8zF462H56aKE8mQ0uZvVW0wfiFhqc",
  authDomain: "music-player-d6bc3.firebaseapp.com",
  projectId: "music-player-d6bc3",
  databaseURL: "https://music-player-d6bc3-default-rtdb.firebaseio.com",
  storageBucket: "music-player-d6bc3.firebasestorage.app",
  messagingSenderId: "457476051504",
  appId: "1:457476051504:web:b27831bf900176409613f5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

let allSongs = [];

const endpoint = "https://musicapi-19wk.onrender.com/music/myAPI";

const loadAllSongs = async () => {
  const response = await fetch(endpoint);
  const songs = await response.json();
  allSongs = songs;
};


onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "../Authentication/signin.html");
  await loadAllSongs();
  const uid = user.uid;
  const likedRef = ref(database, "users/" + uid + "/likedSongs");
  const snapshot = await get(likedRef);
  const likedSongs = snapshot.val() || [];
  displayFavourites(likedSongs);
});
const favGrid = document.getElementById("favGrid");

const displayFavourites = (likedArr) => {
  favGrid.innerHTML = "";
  if (likedArr.length === 0) {
    favGrid.innerHTML = `<p>No liked songs yet ❤️</p>`;
    return;
  }
  likedArr.forEach(likedSong => {
    const info = allSongs.find(s => s.songTitle === likedSong.songTitle);
    if (!info) return;
    favGrid.innerHTML += `
      <div class="musicCard" data-id="${info.id}" onclick="playMusic(${info.id})">
        <div>
          <img src="${info.songImage}" class="music-image">
        </div>
        <div class="music-title">${info.songTitle || 'Unknown Title'}</div>
        <div class="music-artist">${info.artistName || 'Unknown Artist'}</div>
        <div class="music-album hide-on-mobile">${info.albumName || 'Unknown Album'}</div>
        <div class="music-year hide-on-mobile">${info.releaseDate || 'Unknown Release Date'}</div>
        <div>
          <img src="../Images-and-Icons/mdi--heart.svg"
               class="like-icon"
               data-index="${info.id}">
        </div>
      </div>
    `;
  });
}
const audioPlayers = {};
const playMusic = (id) => {
  const song = allSongs.find(s => s.id === id);
  if (!audioPlayers[id]) {
    audioPlayers[id] = new Audio(song.songUrl);
  }
  const player = audioPlayers[id];
  const card = document.querySelector(`[data-id="${id}"]`);
  card.classList.toggle("active");

  if (card.classList.contains("active")) {
    player.play();
    console.log(`Playing: ${song.songTitle} by ${song.artistName}`);
  } else {
    player.pause();
    console.log(`Paused: ${song.songTitle} by ${song.artistName}`);
  }
};

window.displayFavourites = displayFavourites;
window.playMusic = playMusic;
