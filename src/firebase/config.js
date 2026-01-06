// Firebase Configuration
// Tạo bởi: Firebase Console (peak-coffee-3b1e0)
// Docs: https://firebase.google.com/docs/web/setup

import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase Config từ Console
const firebaseConfig = {
  apiKey: "AIzaSyDP-KltcVfbZzfCfSNmtmbf9L4wKRAdR80",
  authDomain: "peak-coffee-3b1e0.firebaseapp.com",
  projectId: "peak-coffee-3b1e0",
  storageBucket: "peak-coffee-3b1e0.firebasestorage.app",
  messagingSenderId: "166401454852",
  appId: "1:166401454852:web:55964a878b94701cf1d651"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firebase Cloud Messaging (FCM) - Kiểm tra browser support trước
let messaging = null;
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  } else {
    console.warn('⚠️ Firebase Messaging không được hỗ trợ trên browser này');
  }
});
export { messaging };

// Enable Offline Persistence (cache local khi mất mạng)
// Docs: https://firebase.google.com/docs/firestore/manage-data/enable-offline
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('⚠️ Offline persistence chỉ hoạt động trên 1 tab');
  } else if (err.code === 'unimplemented') {
    console.warn('⚠️ Browser không hỗ trợ offline persistence');
  }
});

export default app;
