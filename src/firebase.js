import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "inspirex-s2-26-dhanu",
  appId: "1:84906455376:web:1c297ab4768c4535ac3c55",
  storageBucket: "inspirex-s2-26-dhanu.firebasestorage.app",
  apiKey: "AIzaSyBVq2xphxkONFCGorw0wppLugi5JXqSqW0",
  authDomain: "inspirex-s2-26-dhanu.firebaseapp.com",
  messagingSenderId: "84906455376"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
