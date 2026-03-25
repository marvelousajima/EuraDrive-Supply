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
  // Elements
  const modal = document.getElementById("modal");
  const openLoginBtn = document.getElementById("login-btn");
  const closeModal = document.getElementById("close-modal");
  const logoutBtn = document.getElementById("logout-btn");
  const userStatus = document.getElementById("user-status");
  const authMessage = document.getElementById("auth-message");
  const signupBtn = document.getElementById("signup");
  const loginBtn = document.getElementById("login");

  /* =========================
  MODAL CONTROL
  ========================= */
  if (openLoginBtn) {
    openLoginBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* =========================
  SIGN UP
  ========================= */
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
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
    });
  }

  /* =========================
  LOGIN
  ========================= */
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          authMessage.textContent = "✅ Logged in!";
          authMessage.style.color = "green";
          modal.style.display = "none";
        })
        .catch((err) => {
          authMessage.textContent = "❌ " + err.message;
          authMessage.style.color = "red";
        });
    });
  }

  /* =========================
  LOGOUT
  ========================= */
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth);
    });
  }

  /* =========================
  AUTH STATE
  ========================= */
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userStatus.textContent = `Logged in as ${user.email}`;
      openLoginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      userStatus.textContent = "Not logged in";
      openLoginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
    }
  });
});
