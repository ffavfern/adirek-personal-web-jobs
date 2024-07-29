import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCEUs8wVLFS4H4PgFVzIK3awFi7x5Tngpk",
    authDomain: "adirek-website.firebaseapp.com",
    projectId: "adirek-website",
    storageBucket: "adirek-website.appspot.com",
    messagingSenderId: "586701652137",
    appId: "1:586701652137:web:0a98ba0fd8430dbdede9b8",
    measurementId: "G-T9MXHL69LP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

