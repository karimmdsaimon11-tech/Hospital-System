import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Hospital Management Firebase Configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD3MDY4lOWelSgKaNc1S-j2EnMCK2RwIS0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hospital-managerment.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hospital-managerment",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hospital-managerment.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "312082180361",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:312082180361:web:2384595ddbad6a55ec8bd8",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E1SHWSVF8D"
};

// Initialize Firebase App safely (singleton instance prevents duplicate init during Next.js HMR)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Client-side Analytics (guarded against SSR)
export let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported in this environment
  });
}
