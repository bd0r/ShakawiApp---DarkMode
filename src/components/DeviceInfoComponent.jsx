import { useEffect } from 'react';
import { getToken, getMessaging } from 'firebase/messaging';
import { detect } from 'detect-browser';
import { supabase } from '../backend/supabase';
import { isMobile, isTablet, isAndroid, isIOS } from 'react-device-detect';

const DeviceInfoComponent = () => {
  useEffect(() => {
    const saveDeviceInfo = async () => {
      try {
        // Get FCM token
        const messaging = getMessaging();
        const fcmToken = await getToken(messaging, { 
          vapidKey: 'BBkwxjfRWvanYEB3BAtxplgfl8drtnMq52_mZq_lYX6uknbbWGF3aEqlBiWoshVvgsqsZJuf68lZkXRpkZR8RGM' 
        });

        if (!fcmToken) {
          console.log('No FCM token available');
          return;
        }

        // Get device information
        const browser = detect();
        const deviceInfo = {
          fcm_token: fcmToken,
          device_type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
          os: isAndroid ? 'Android' : isIOS ? 'iOS' : browser?.os || 'unknown',
          browser: browser?.name || 'unknown',
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          user_agent: navigator.userAgent,
          last_active: new Date().toISOString()
        };

        // Upsert data to Supabase
        const { data, error } = await supabase
          .from('users')
          .upsert(
            [deviceInfo],
            { onConflict: 'fcm_token' }
          );

        if (error) throw error;
        console.log('Device info saved:', data);

      } catch (error) {
        console.error('Error saving device info:', error);
      }
    };

    // Request notification permission
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          saveDeviceInfo();
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    };

    // Check for service worker support
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      requestNotificationPermission();
    }
  }, []);

  return null; // This component doesn't render anything
};

export default DeviceInfoComponent;