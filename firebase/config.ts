import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// A Firebase web config is not a secret. It identifies the project, and access
// is controlled by Firestore security rules. Env vars override it so a second
// environment can be pointed at a different project without a code change.
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyB4XNM9YKGolstsBiwyV6LcqF43pQBt7Gw",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "mfit-fitness-app.firebaseapp.com",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "mfit-fitness-app",
  storageBucket: "mfit-fitness-app.firebasestorage.app",
  messagingSenderId: "48175932972",
  appId: "1:48175932972:web:79ed0bda6ac32ac55ad389",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * `getAuth()` keeps the session in memory only, which signed the user out on
 * every cold start. `initializeAuth` with AsyncStorage persists it.
 *
 * `initializeAuth` throws if it runs twice on the same app instance, which
 * happens on Fast Refresh, so fall back to reading the existing instance.
 */
function createAuth(): Auth {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

const auth = createAuth();
const db = getFirestore(app);

export { app, auth, db };
