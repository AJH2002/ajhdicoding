// src/scripts/pages/auth/login-page.js
import Component from '../../utils/component';

class LoginPage extends Component {
  constructor() {
    super();
    // DOM Elements that will be initialized after render
    this.loginForm = null;
    this.errorContainer = null;
    this.submitButton = null;
    this._eventHandlers = {};
  }

  async render() {
    return `
      <section class="auth-container">
        <div class="auth-form-container">
          <h1 class="auth-title">Login</h1>
          
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required aria-required="true">
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required aria-required="true">
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            
            <div id="loginErrorContainer" class="error-container"></div>
          </form>
          
          <p class="auth-link">
            Don't have an account? <a href="#/register">Register</a>
          </p>
          
          <div class="guest-link">
            <p>Or continue as <a href="#/">guest</a></p>
          </div>
        </div>
      </section>
    `;
  }

  afterRender() {
    // Initialize DOM elements
    this.loginForm = document.getElementById('loginForm');
    this.errorContainer = document.getElementById('loginErrorContainer');
    this.submitButton = document.querySelector('#loginForm button[type="submit"]');
  }
  
  setupLoginForm(onSubmit) {
    this._eventHandlers.formSubmit = onSubmit;
    this.loginForm.addEventListener('submit', onSubmit);
  }

  setLoading(isLoading) {
    if (this.submitButton) {
      this.submitButton.disabled = isLoading;
      this.submitButton.textContent = isLoading ? 'Logging in...' : 'Login';
    }
  }
  
  showError(message) {
    this.errorContainer.innerHTML = `<p>${message}</p>`;
  }
  
  clearError() {
    this.errorContainer.innerHTML = '';
  }
  
  getFormData() {
    const formData = new FormData(this.loginForm);
    return {
      email: formData.get('email'),
      password: formData.get('password')
    };
  }
  
  destroy() {
    // Remove event listeners
    if (this._eventHandlers.formSubmit) {
      this.loginForm.removeEventListener('submit', this._eventHandlers.formSubmit);
    }
  }
}

export default LoginPage;