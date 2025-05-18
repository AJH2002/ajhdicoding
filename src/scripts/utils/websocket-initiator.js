import NotificationHelper from './notification-helper';
import CONFIG from '../config';

const WebSocketInitiator = {
  init(url) {
    const webSocket = new WebSocket(url);
    webSocket.onmessage = this._onMessageHandler;
  },

  _onMessageHandler(message) {
    const story = JSON.parse(message.data);
    
    NotificationHelper.sendNotification({
      title: `${story.name} shared a new story!`,
      options: {
        body: story.description,
        icon: 'icons/icon-192x192.png',
        image: story.photoUrl || 'icons/icon-512x512.png',
        vibrate: [200, 100, 200],
        badge: 'icons/icon-72x72.png',
      },
    });
  },
};

export default WebSocketInitiator;