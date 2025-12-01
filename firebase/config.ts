import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4XNM9YKGolstsBiwyV6LcqF43pQBt7Gw",
  authDomain: "mfit-fitness-app.firebaseapp.com",
  projectId: "mfit-fitness-app",
  storageBucket: "mfit-fitness-app.firebasestorage.app",
  messagingSenderId: "48175932972",
  appId: "1:48175932972:web:79ed0bda6ac32ac55ad389"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

