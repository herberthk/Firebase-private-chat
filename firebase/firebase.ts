import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNhGfl-7OTtL5BjVo-wi-HAPHelx_0-f8",
  authDomain: "private-char.firebaseapp.com",
  projectId: "private-char",
  storageBucket: "private-char.appspot.com",
  messagingSenderId: "550742339054",
  appId: "1:550742339054:web:c63cad10d38e06f14572ff",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
