import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4zucwY22zK2ugiUGtrln86C79vRioXaE",
  authDomain: "continental-b7db6.firebaseapp.com",
  projectId: "continental-b7db6",
  storageBucket: "continental-b7db6.firebasestorage.app",
  messagingSenderId: "607198002974",
  appId: "1:607198002974:web:b4b6e45c237af51b44930f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);