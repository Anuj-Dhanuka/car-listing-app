// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcVW9NRwbNpfzoO6cCvf9mM4MnAnvIias",
  authDomain: "spyne-car-listing-app.firebaseapp.com",
  projectId: "spyne-car-listing-app",
  storageBucket: "spyne-car-listing-app.firebasestorage.app",
  messagingSenderId: "238429713579",
  appId: "1:238429713579:web:f6e50de2ad75ea7271f3ee",
  measurementId: "G-56BBRJB78S"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;