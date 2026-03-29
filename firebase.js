/* =========================
IMPORTS
========================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

/* =========================
CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyC1QsdVINu7U_wmQIyQpaP8s6htKthUqio",
  authDomain: "euradrive-supply.firebaseapp.com",
  projectId: "euradrive-supply",
  storageBucket: "euradrive-supply.firebasestorage.app",
  messagingSenderId: "497442271437",
  appId: "1:497442271437:web:561e1e987d0dc09ea1b984",
  measurementId: "G-S4Z640FSG2",
};

/* =========================
INITIALIZE
========================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* =========================
WAIT FOR DOM
========================= */
window.addEventListener("DOMContentLoaded", () => {
  // UI Elements
  const modal = document.getElementById("modal");
  const openLoginBtn = document.getElementById("login-nav-btn"); // Matches new header
  const closeModal = document.getElementById("close-modal");
  const userProfile = document.getElementById("user-profile");
  const userAvatar = document.getElementById("user-avatar");
  const authMessage = document.getElementById("auth-message");

  // Form Elements
  const signupBtn = document.getElementById("signup");
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout-btn");

  /* --- MODAL CONTROL --- */
  if (openLoginBtn) {
    openLoginBtn.onclick = () => (modal.style.display = "flex");
  }
  if (closeModal) {
    closeModal.onclick = () => (modal.style.display = "none");
  }
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  /* --- SIGN UP --- */
  if (signupBtn) {
    signupBtn.onclick = () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          authMessage.textContent = "✅ Account created!";
          authMessage.style.color = "green";
        })
        .catch((err) => {
          authMessage.textContent = "❌ " + err.message;
          authMessage.style.color = "red";
        });
    };
  }

  /* --- LOGIN --- */
  if (loginBtn) {
    loginBtn.onclick = () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          modal.style.display = "none";
        })
        .catch((err) => {
          authMessage.textContent = "❌ " + err.message;
          authMessage.style.color = "red";
        });
    };
  }

  /* --- LOGOUT --- */
  if (logoutBtn) {
    logoutBtn.onclick = () => signOut(auth);
  }

  /* --- AUTH STATE (The Initial Circle Logic) --- */
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 1. Get initial
      const firstLetter = user.email.charAt(0).toUpperCase();

      // 2. Update Avatar Circle
      if (userAvatar) userAvatar.innerText = firstLetter;

      // 3. Toggle Header Visibility
      if (userProfile) userProfile.style.display = "flex";
      if (openLoginBtn) openLoginBtn.style.display = "none";

      console.log("Logged in:", user.email);
    } else {
      // 4. Reset to logged out state
      if (userProfile) userProfile.style.display = "none";
      if (openLoginBtn) openLoginBtn.style.display = "block";

      console.log("Logged out");
    }
  });
});

// Global Logout function for the onclick="logoutUser()" in HTML
window.logoutUser = () => {
  signOut(auth).catch((error) => console.error("Logout Error:", error));
};
