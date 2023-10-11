// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_lyV0deMA7UPl3kVpoMGGp9_KqO-9u1E",
  authDomain: "smartsave-fe7ac.firebaseapp.com",
  projectId: "smartsave-fe7ac",
  storageBucket: "smartsave-fe7ac.appspot.com",
  messagingSenderId: "91703146253",
  appId: "1:91703146253:web:36c2945fe17801d12ce244"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);