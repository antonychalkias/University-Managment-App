import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import getStorage from firebase/storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

export const F_APP = initializeApp(firebaseConfig);

initializeAuth(F_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const F_AUTH = getAuth(F_APP);
export const F_DB = getFirestore(F_APP);
export const F_RTDB = getDatabase(F_APP);
export const F_STORAGE = getStorage(); 
export default getReactNativePersistence;
