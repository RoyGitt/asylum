// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-1dfb0.firebaseapp.com",
  projectId: "real-estate-1dfb0",
  storageBucket: "real-estate-1dfb0.appspot.com",
  messagingSenderId: "950248380929",
  appId: "1:950248380929:web:9adc97841b54cd81533e00",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
