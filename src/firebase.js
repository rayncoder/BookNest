import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBKUWUE6yK-uePB7pDcE_t_auPutXmz8dI',
  authDomain: 'booknest-bb989.firebaseapp.com',
  projectId: 'booknest-bb989',
  storageBucket: 'booknest-bb989.firebasestorage.app',
  messagingSenderId: '137242587523',
  appId: '1:137242587523:web:d0ae58d4fb620a677f86b6',
};


const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);