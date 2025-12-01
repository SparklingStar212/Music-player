import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, update, get } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
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
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = ref(database, 'users/' + uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log("User data:", data);
    });
  } else {
    window.location.href = "../Authentication/signin.html";
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = ref(database, 'users/' + uid);
    const likedSnapshot = await get(ref(database, 'users/' + uid + '/likedSongs'));
    const likedSongs = likedSnapshot.val() || [];
    likedSongs.forEach(liked => {
      const i = allSongs.findIndex(s => s.songTitle === liked.songTitle);
      if (i > -1) {
        const heartIcon = document.querySelector(`.musicCard:nth-child(${i + 1}) .like-icon`);
        if (heartIcon) heartIcon.src = "../Images-and-Icons/mdi--heart.svg";
      }
    });

  } else {
    window.location.href = "../Authentication/signin.html";
  }
});

const favouritesSongs = [];
const allSongs = [];
const endpoint = "https://musicapi-19wk.onrender.com/music/myAPI"

const getInfo = async () => {
  try {
    const response = await fetch(endpoint)
    const newResponse = await response.json()
    console.log(newResponse)
    allSongs.push(...newResponse);
    

    newResponse.map((info, i) => {
      musicGrid.innerHTML += `
          <div class="musicCard" onclick="playMusic(${i})">
            <div>
            <img src="${info.songImage || '../Images-and-Icons/default-image.svg'}" class="music-image cell">
            </div>
            <div class="music-title cell">${info.songTitle || 'Unknown Title'}</div>
            <div class="music-artist cell">${info.artistName || 'Unknown Artist'}</div>
            <div class="music-album hide-on-mobile cell">${info.albumName || 'Unknown Album'}</div>
            <div class="music-year hide-on-mobile cell">${info.releaseDate || 'Unknown Year'}</div>
            <div class="hide-on-mobile">
              <img src="../Images-and-Icons/mdi--heart-outline.svg" alt="" id="likeIcon" onclick="likeSong(event)" data-index="${i}">
            </div>
            <div class="drop-down">
              <img src="../Images-and-Icons/pepicons-pencil--dots-y (1).svg" alt="" data-index="${i}" onclick="dropDown(event)">
              <div class="dropdown-content" id="dropdownContent${i}">
                <a href="#">Add to Playlist</a>
                <a href="#">Go to Artist</a>
                <a href="#">Go to Album</a>
              </div>
            </div>
          </div>
        `
    })
  } catch (error) {
    console.log("The error is: " + error)
  }
}
getInfo();

const audioPlayers = [];

const playMusic = (i) => {
  const card = document.getElementsByClassName("musicCard")[i];
  card.classList.toggle("active");
  if (!audioPlayers[i]) {
    audioPlayers[i] = new Audio(allSongs[i].songUrl);
  }
  const player = audioPlayers[i];
  if (card.classList.contains("active")) {
    player.play();
    console.log(`Playing: ${allSongs[i].songTitle} by ${allSongs[i].artistName}`);
  } else {
    player.pause();
    console.log(`Paused: ${allSongs[i].songTitle} by ${allSongs[i].artistName}`);
  }
}
const likeSong = async (event) => {
  event.stopPropagation();
  const index = event.target.dataset.index;
  const song = allSongs[index];
  const uid = auth.currentUser.uid;
  const userLikesRef = ref(database, 'users/' + uid + '/likedSongs');
  const snapshot = await get(userLikesRef);
  let likedSongs = snapshot.val() || [];
  const songIndex = likedSongs.findIndex(s => s.songTitle === song.songTitle);
  if (songIndex > -1) {
    likedSongs.splice(songIndex, 1);
    event.target.src = "../Images-and-Icons/mdi--heart-outline.svg";
  } else {
    likedSongs.push(song);
    event.target.src = "../Images-and-Icons/mdi--heart.svg";
  }
  await set(userLikesRef, likedSongs);
  console.log("Liked songs saved to Firebase:", likedSongs);
};


const dropDown = (event) => {
  event.stopPropagation();
  const index = event.target.dataset.index;
  document.getElementById(`dropdownContent${index}`).style.display = 'block';
}

const addToPlaylist = async (uid, playlistName, song) => {
  const playlistRef = ref(database, `users/${uid}/playlists/${playlistName}/songs`);
  const snapshot = await get(playlistRef);
  let songs = snapshot.val() || [];
  songs.push(song);
  await set(playlistRef, songs);
  console.log(`Song added to playlist "${playlistName}"`);
};

const favourites = (event) => {
  if (event) {
    favs.style.backgroundColor = "#686868ff";
  } else {
    favs.style.backgroundColor = "transparent";
  }
  window.location.href = "favourites.html";
}
const playLists = (event) => {
  if (event) {
    plays.style.backgroundColor = "#686868ff";
  } else {
    plays.style.backgroundColor = "transparent";
  }
  window.location.href = "playlists.html";
}


window.playMusic = playMusic;
window.likeSong = likeSong;
window.dropDown = dropDown;
window.addToPlaylist = addToPlaylist;
window.favourites = favourites
window.playLists = playLists;