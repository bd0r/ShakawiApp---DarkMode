// // firebase-messaging-sw.js
// importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// const firebaseConfig = {   
//   apiKey: "AIzaSyCIloLJ9As7tW1ERhYKDgnj7LoiJQz6DtM",
//   authDomain: "shakawiapp.firebaseapp.com",
//   projectId: "shakawiapp",
//   storageBucket: "shakawiapp.firebasestorage.app",
//   messagingSenderId: "202505946465",
//   appId: "1:202505946465:web:af2cfffcbac33e4078b120",
//   measurementId: "G-G6EHFV5M6D"};

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// // Handle background/foreground messages
// messaging.onBackgroundMessage((payload) => {
//   const { title, body } = payload.notification;
//   self.registration.showNotification(title, { body });
// });

// // Optional: Handle foreground messages here if needed
// messaging.onMessage((payload) => {
//   // You can still log or handle data here without showing a toast
//   console.log("Foreground message:", payload);
// });



// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = { 
  apiKey: "AIzaSyCIloLJ9As7tW1ERhYKDgnj7LoiJQz6DtM",
  authDomain: "shakawiapp.firebaseapp.com",
  projectId: "shakawiapp",
  storageBucket: "shakawiapp.firebasestorage.app",
  messagingSenderId: "202505946465",
  appId: "1:202505946465:web:af2cfffcbac33e4078b120",
  measurementId: "G-G6EHFV5M6D"
 };
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  
  // Show system notification
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body,
    icon: '/logo192.png' // Add your app icon
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});