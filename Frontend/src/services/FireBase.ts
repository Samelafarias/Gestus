import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyANRCUXIAliNrI3JWXYzMpsHmPYndIdZzE",
  authDomain: "gestus-905ae.firebaseapp.com",
  projectId: "gestus-905ae",
  storageBucket: "gestus-905ae.firebasestorage.app",
  messagingSenderId: "742655620870",
  appId: "1:742655620870:web:d5a170bc6bf4e9d37fd087",
  measurementId: "G-RQ6PGLNE9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);