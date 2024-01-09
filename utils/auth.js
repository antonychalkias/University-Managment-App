import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import getStorage from firebase/storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA3f1mPPZ04UcxnqooBiNG0-miWeMyR1Y8",
  authDomain: "managment-university.firebaseapp.com",
  databaseURL: "https://managment-university-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "managment-university",
  storageBucket: "managment-university.appspot.com",
  messagingSenderId: "325275829593",
  appId: "1:325275829593:web:ec732f1335e9172c04b848",
  measurementId: "G-6L7Y7HJBFD"
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
