import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoOo8zF462H56aKE8mQ0uZvVW0wfiFhqc",
  authDomain: "music-player-d6bc3.firebaseapp.com",
  projectId: "music-player-d6bc3",
  storageBucket: "music-player-d6bc3.firebasestorage.app",
  messagingSenderId: "457476051504",
  appId: "1:457476051504:web:b27831bf900176409613f5"
};


const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

const auth = getAuth(app);

const googleSignIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      window.location.href = "../dashboard/allsongs.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log('Error Code:', errorCode);
    });
};

const create = () => {
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, {
        displayName: userName.value
      });
    })
    .then(() => {
      window.location.href = "../dashboard/allsongs.html";
    })
    .catch((error) => {
      console.log("Signup error:", error.message);
    });
}

const signIn = () => {
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "../dashboard/allsongs.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log('Error Code:', errorCode);
    });
}

window.googleSignIn = googleSignIn;
window.create = create;
window.signIn = signIn;