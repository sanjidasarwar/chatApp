// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

import { toast } from "react-toastify";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAG2uUCsqhySJVAOARaZ86qhaDXlwHqrHo",
  authDomain: "chat-app-c6773.firebaseapp.com",
  projectId: "chat-app-c6773",
  storageBucket: "chat-app-c6773.firebasestorage.app",
  messagingSenderId: "604169005997",
  appId: "1:604169005997:web:62e4e2fdc7561216958f24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "Users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avator: "",
      bio: "Hey there, I am using chat app ",
      lastSeen: Date.now(),
    });
    await setDoc(doc(db, "Chats", user.uid), {
      chatData: [],
    });
  } catch (error) {
    console.log(error);
    toast.error(error.code);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(""));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(""));
  }
};

export { signup, login, logout, auth, db };
