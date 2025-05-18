// src/scripts/utils/sw-register.js
import CONFIG from '../config';

const SwRegister = {
  async init() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported in the browser');
      return;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered successfully', registration);
      
      // Register for Push notification if supported
      if (this._isWebPushSupported()) {
        await this._registerPush(registration);
      }
    } catch (error) {
      console.log('Failed to register service worker', error);
    }
  },

  _isWebPushSupported() {
    return 'PushManager' in window;
  },

  async _registerPush(registration) {
    const { PUSH_MSG_VAPID_PUBLIC_KEY } = CONFIG;
    
    if (!PUSH_MSG_VAPID_PUBLIC_KEY) {
      console.log('VAPID Key not provided in config');
      return;
    }

    try {
      // Request notification permission
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          return;
        }
      }

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe for push notifications
        const convertedVapidKey = this._urlBase64ToUint8Array(PUSH_MSG_VAPID_PUBLIC_KEY);
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        
        // Here you would send the subscription to your server
        await this._sendSubscriptionToServer(subscription);
      }
    } catch (error) {
      console.error('Error registering push notification', error);
    }
  },

  async _sendSubscriptionToServer(subscription) {
    // Get auth token if user is logged in
    const authToken = this._getAuthToken();
    
    if (!authToken) {
      console.log('User not authenticated, skipping push subscription');
      return;
    }

    try {
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(subscription),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to subscribe to push notifications');
      }
      
      console.log('Push notification subscription successful', responseData);
    } catch (error) {
      console.error('Failed to send subscription to server', error);
    }
  },

  _getAuthToken() {
    try {
      const auth = localStorage.getItem('DICODING_STORY_AUTH');
      if (!auth) return null;
      
      const authData = JSON.parse(auth);
      return authData.token || null;
    } catch (error) {
      console.error('Error getting auth token', error);
      return null;
    }
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
      
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  },
};

export default SwRegister;