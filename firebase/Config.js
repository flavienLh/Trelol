import { initializeApp, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase, update, remove, push , ref, set, get, child, query, orderByKey, equalTo } from 'firebase/database';
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

const handleEdit = async (uri, data) => {
    try{
    const newRef = ref(db, uri);
    await update(newRef, data);
    console.log('The update was successful');
      } catch (error) {
        console.error('Error during the edit: ', error);
      }
};

const handleDelete = async (uri) => {
    try {
            const newRef = ref(db, uri);
            const snapshot = await get(newRef);

            if (snapshot.exists()) {
                await remove(newRef);
                console.log('Data removal completed');
            } else {
                console.warn('Data does not exist at the specified path');
            }
        } catch (error) {
            console.error('Error during the removal: ', error);
        }
};

const handleAdd = async (uri, data) => {
    try{
    const newRef = push(ref(db, uri));
    console.log('ref : ' + newRef);
    await set(newRef, data);
    console.log('data writing completed');
      } catch (error) {
        console.error('Error while adding a new data: ', error);
      }
};

export { app, auth, getApp, getAuth, handleEdit, handleDelete, handleAdd};