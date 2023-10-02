import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAmQogCO_cBqY83d-hfc064gSZjSDZrK7k",
    authDomain: "trelol-44eca.firebaseapp.com",
    projectId: "trelol-44eca",
    storageBucket: "trelol-44eca.appspot.com",
    messagingSenderId: "12843653638",
    appId: "1:12843653638:web:14d6f9dc02806aeb638187"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;
