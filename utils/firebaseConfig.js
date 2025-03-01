import React, { useState } from 'react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { get, getDatabase, ref, set } from "firebase/database";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
export const firebaseConfig = {
  apiKey: "AIzaSyBr6T1HvMezzxFnprqT59mBChsFzWwkHoM",
  authDomain: "easylife-d9070.firebaseapp.com",
  databaseURL: "https://easylife-d9070-default-rtdb.firebaseio.com",
  projectId: "easylife-d9070",
  storageBucket: "easylife-d9070.appspot.com",
  messagingSenderId: "922312304870",
  appId: "1:922312304870:web:edfa03c42db98555d9f327",
  measurementId: "G-JD28YY24T7"
};
const app = initializeApp(firebaseConfig);


// Constante pour realtime Database 
export const database = getDatabase(app);
//Constante pour authentification
export  const auth = getAuth(app);
export const  storage  = getStorage(app);
export const db = getFirestore(app);










