// import './App.css';
import { useRef, useEffect, useState, createContext, useContext } from 'react';
import { supabase } from './backend/supabase';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { ShakawiForm } from './pages/shakawi';
import { Providers } from './pages/providers';
import { NavBar } from './components/navbar';
import { FormComponent } from './pages/settings';
import { ShiftsForm } from './pages/shifts';
import { MainPage } from './pages/main';
import { Report } from './pages/report';
import { requestForToken } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { messaging } from "./firebase";
import { onMessage } from "firebase/messaging"; // Fix: Import onMessage
import DeviceInfoComponent from './components/DeviceInfoComponent';
import AdminPage from './pages/admin';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchDarkModeSetting = async () => {
      try {
        const { data, error } = await supabase
          .from('appsettings')
          .select('darkmode')
          .eq('id', 0) // Assuming there's a single row for app settings with id 1
          .single();
        if (error) {
          console.error('Error fetching dark mode setting:', error);
          return;
        }

        if (data) {
          setIsDarkMode(data.darkmode);
        }
      } catch (error) {
        console.error('Error in fetchDarkModeSetting:', error);
      }
    };

    fetchDarkModeSetting();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    console.log('Attempting to set dark mode to:', newMode);
    try {
      const { error } = await supabase
        .from('appsettings')
        .update({ darkmode: newMode })
        .eq('id', 1); // Assuming there's a single row for app settings with id 1

      if (error) {
        console.error('Error updating dark mode setting:', error);
        console.error('Supabase error details:', error);
        // Optionally revert UI change if DB update fails
        setIsDarkMode(!newMode);
        document.documentElement.classList.toggle('dark'); 
      }
    } catch (error) {
      console.error('Error in toggleDarkMode:', error);
      console.error('Caught exception:', error);
      // Optionally revert UI change if DB update fails
      setIsDarkMode(!newMode);
      document.documentElement.classList.toggle('dark');
    }
  };
  const getJpegRef = useRef(null);

  useEffect(() => {
    requestForToken(); // Request FCM token

    // Subscribe to foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      if (document.visibilityState === 'visible') {
        toast.info(payload.notification?.body || payload.data?.body, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleDownload = () => {
    getJpegRef.current?.();
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <Router>
       <DeviceInfoComponent />
      <NavBar onDownload={handleDownload} />
      <ToastContainer autoClose={3000} hideProgressBar newestOnTop />
      <Routes>
        <Route path="/report" element={
          <Report onDownload={(getJpeg) => (getJpegRef.current = getJpeg)} />
        } />
        <Route path="/providers" element={<Providers />} />
        <Route path="/complaints" element={<ShakawiForm />} />
        <Route path="/settings" element={<FormComponent />} />
        <Route path="/shifts" element={<ShiftsForm />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </Router>
    </DarkModeContext.Provider>
  );
}


{/* // export function Home() {
//   const [session, setSession] = useState(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     async function signInWithEmail() {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: 'badr@mail.com',
//         password: '123456',
//       })
//     }
//     signInWithEmail();
//   }, [])

//   if (!session) {
//     return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
//   }
//   else {
//     return (<div>Logged in!</div>)
//   }
// }







// import logo from './logo.svg';
// import './App.css';

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient("https://mmaureiohcwwnjhdtakg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYXVyZWlvaGN3d25qaGR0YWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1OTQ0MTAsImV4cCI6MjAzNjE3MDQxMH0.S5UQCNCgK8xzWqBrfgEHFYsB1fGimDhi7Dvxt-1EOdg");

// function App() {
//   const [countries, setCountries] = useState([]);

//   useEffect(() => {
//     getCountries();
//   }, []);

//   async function getCountries() {
//     const { data } = await supabase.from("countries").select();
//     setCountries(data);
//   }

//   return (
//     <ul>
//       {countries.map((country) => (
//         <li key={country.name}>{country.name}</li>
//       ))}
//     </ul>
//   );
// }

// export default App; */}