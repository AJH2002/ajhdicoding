// src/scripts/pages/app.js

import { getAuth, removeAuth } from '../data/auth';

class App {
  constructor({ navigationDrawer, drawerButton, content, skipToContent }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    this.skipToContent = skipToContent;

    // Initialize app components
    this.initComponents();
  }

  initComponents() {
    if (this.drawerButton && this.navigationDrawer) {
      this.setupDrawer();
    }
    
    this.setupAuth();
    
    if (this.skipToContent) {
      this.setupSkipToContent();
    }
  }

  setupDrawer() {
    this.drawerButton.addEventListener('click', () => {
      this.navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        this.navigationDrawer && 
        this.drawerButton &&
        !this.navigationDrawer.contains(event.target) &&
        !this.drawerButton.contains(event.target)
      ) {
        this.navigationDrawer.classList.remove('open');
      }

      if (this.navigationDrawer) {
        this.navigationDrawer.querySelectorAll('a').forEach((link) => {
          if (link.contains(event.target)) {
            this.navigationDrawer.classList.remove('open');
          }
        });
      }
    });
  }
  
  setupAuth() {
    const authButtonContainer = document.getElementById('authButtonContainer');
    if (!authButtonContainer) return;
    
    const auth = getAuth();
    
    if (auth && auth.token) {
      // User is logged in
      authButtonContainer.innerHTML = `
        <span class="username">Hello, ${auth.name}</span>
        <button id="logoutButton" class="btn btn-outline">Logout</button>
      `;
      
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', () => {
          removeAuth();
          window.location.reload();
        });
      }
    } else {
      // User is not logged in
      authButtonContainer.innerHTML = `
        <a href="#/login" class="btn btn-outline">Login</a>
        <a href="#/register" class="btn btn-primary">Register</a>
      `;
    }
  }
  
  setupSkipToContent() {
    this.skipToContent.addEventListener('click', (event) => {
      event.preventDefault();
      const targetSelector = event.target.getAttribute('href');
      if (!targetSelector) return;
      
      const contentTarget = document.querySelector(targetSelector);
      
      if (contentTarget) {
        contentTarget.tabIndex = -1;
        contentTarget.focus();
      }
    });
  }
}

export default App;