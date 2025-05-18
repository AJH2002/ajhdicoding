const NotificationHelper = {
  sendNotification({ title, options }) {
    if (!this.checkNotificationAvailability()) {
      console.log('Notification not supported in this browser');
      return;
    }

    if (!this.checkPermission()) {
      console.log('User did not yet grant permission');
      this.requestPermission();
      return;
    }

    this._showNotification({ title, options });
  },

  checkNotificationAvailability() {
    return 'Notification' in window;
  },

  checkPermission() {
    return Notification.permission === 'granted';
  },

  async requestPermission() {
    const permission = await Notification.requestPermission();
    
    if (permission === 'denied') {
      console.log('Notification permission denied');
      return;
    }
    
    if (permission === 'default') {
      console.log('Notification permission request was dismissed');
      return;
    }
    
    console.log('Notification permission granted');
  },

  async _showNotification({ title, options }) {
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    serviceWorkerRegistration.showNotification(title, options);
  },
};

export default NotificationHelper;