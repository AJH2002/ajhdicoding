// CSS imports
import '../styles/styles.css';
import '../styles/animations.css';

// FontAwesome for icons
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import router and routes
import Router from './routes/router';
import routes from './routes/routes';
import App from './pages/app';
import SwRegister from './utils/sw-register';
import WebSocketInitiator from './utils/websocket-initiator';
import CONFIG from './config';

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize UI components
  const navigationDrawer = document.querySelector('#navigation-drawer');
  const drawerButton = document.querySelector('#drawer-button');
  const mainContent = document.querySelector('#main-content');
  const skipToContentLink = document.querySelector('.skip-to-content a');
  
  // Create App instance with required elements
  const app = new App({
    navigationDrawer,
    drawerButton,
    content: mainContent,
    skipToContent: skipToContentLink,
  });
  
  // Initialize router
  const router = new Router();
  
  // Register routes
  Object.keys(routes).forEach((path) => {
    router.addRoute(path, routes[path]);
  });
  
  // Initial page load
  if (mainContent) {
    router.loadPage(mainContent);
  } else {
    console.error('Main content element not found');
  }
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    if (mainContent) {
      router.loadPage(mainContent);
    }
  });

  // Register service worker and push notification
  await SwRegister.init();

  // Initialize WebSocket (for push notification)
  WebSocketInitiator.init(CONFIG.WEB_SOCKET_SERVER);
});