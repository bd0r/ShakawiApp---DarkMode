import React, { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { supabase } from "./backend/supabase";

// const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

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

const NotificationComponent = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BBkwxjfRWvanYEB3BAtxplgfl8drtnMq52_mZq_lYX6uknbbWGF3aEqlBiWoshVvgsqsZJuf68lZkXRpkZR8RGM",
        });
        // FTZWn9EpkhtOyaR9_dYgDCEIFZUYLFmunuxPAZerOlM
        console.log("User Token ========================= :", token);

        // حفظ التوكن في Supabase
        await supabase
          .from("notifications")
          .upsert([{ token }], { onConflict: ["token"] });

        onMessage(messaging, (payload) => {
          console.log("Message received. ", payload);
          setNotification(payload.notification);
        });
      } else {
        console.error("Permission denied");
      }
    };

    requestPermission();
  }, []);

  return (
    <div>
      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded">
          <h4>{notification.title}</h4>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;