import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "buzzword-bingo-bot",
  "appId": "1:714642100866:web:543124108f5f6bcf9f1a9b",
  "storageBucket": "buzzword-bingo-bot.firebasestorage.app",
  "apiKey": "AIzaSyCr02_se8j2bCB9J-L1ObYz94WOhK-0WdE",
  "authDomain": "buzzword-bingo-bot.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "714642100866"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
