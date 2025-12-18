import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

// Firebase config - these are publishable keys designed for client-side use
// They are protected by Firebase Security Rules and domain restrictions
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let analytics: Analytics | null = null;
let initialized = false;

export const initFirebase = (): void => {
  if (typeof window !== 'undefined' && !initialized) {
    const app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    initialized = true;
    firebaseLogEvent(analytics, 'app_open');
  }
};

export const logEvent = (eventName: string, params?: Record<string, string | number | boolean>): void => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

export const logPageView = (pageName: string): void => {
  if (analytics) {
    firebaseLogEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }
};
