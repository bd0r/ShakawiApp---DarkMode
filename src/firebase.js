import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCIloLJ9As7tW1ERhYKDgnj7LoiJQz6DtM",
    authDomain: "shakawiapp.firebaseapp.com",
    projectId: "shakawiapp",
    storageBucket: "shakawiapp.firebasestorage.app",
    messagingSenderId: "202505946465",
    appId: "1:202505946465:web:af2cfffcbac33e4078b120",
    measurementId: "G-G6EHFV5M6D"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request notification permission and get FCM token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BBkwxjfRWvanYEB3BAtxplgfl8drtnMq52_mZq_lYX6uknbbWGF3aEqlBiWoshVvgsqsZJuf68lZkXRpkZR8RGM", // From Firebase Project Settings > Cloud Messaging
    });
    if (currentToken) {
      console.log("Current FCM token:", currentToken);
      // Send token to your backend for future use
    } else {
      console.log("No registration token available.");
    }
  } catch (err) {
    console.error("Failed to generate token:", err);
  }
};

// Listen for incoming messages (foreground)
export const onMessageListener = () => {
  return new Promise((resolve) => {
    const unsubscribe = onMessage(messaging, (payload) => {
      resolve(payload);
    });
    // Return the unsubscribe function for cleanup
    return unsubscribe;
  });
};

export { messaging };