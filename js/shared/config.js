// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAgc0tYF5WXG_kArW0h3YAnQ_BKjPXJZOw",
    authDomain: "presentia-55b8b.firebaseapp.com",
    databaseURL: "https://presentia-55b8b-default-rtdb.firebaseio.com",
    projectId: "presentia-55b8b",
    storageBucket: "presentia-55b8b.firebasestorage.app",
    messagingSenderId: "28781643269",
    appId: "1:28781643269:web:16fa963453ab31c9e43e6c"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Database
const auth = getAuth(app);
const database = getDatabase(app);

// Export the auth and database objects
export { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set, get, signInWithPopup, GoogleAuthProvider };
