import { initializeApp, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase, ref, set, get, child, query, orderByKey, equalTo } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAmQogCO_cBqY83d-hfc064gSZjSDZrK7k",
  authDomain: "trelol-44eca.firebaseapp.com",
  databaseURL: "https://trelol-44eca-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trelol-44eca",
  storageBucket: "trelol-44eca.appspot.com",
  messagingSenderId: "12843653638",
  appId: "1:12843653638:web:14d6f9dc02806aeb638187"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth, getApp, getAuth };