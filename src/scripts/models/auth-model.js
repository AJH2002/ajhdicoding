// src/scripts/models/auth-model.js
import CONFIG from '../config';

const AUTH_KEY = 'DICODING_STORY_AUTH';

class AuthModel {
  constructor() {
    this.baseUrl = CONFIG.BASE_URL;
  }

  async register(userData) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return await response.json();
  }

  async login(credentials) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return await response.json();
  }

  saveAuth(auth) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }

  getAuth() {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  }

  removeAuth() {
    localStorage.removeItem(AUTH_KEY);
  }
}

export default AuthModel;