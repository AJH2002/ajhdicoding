// src/scripts/pages/auth/register-page.js
import Component from '../../utils/component';

class RegisterPage extends Component {
  constructor() {
    super();
    // DOM Elements that will be initialized after render
    this.registerForm = null;
    this.errorContainer = null;
    this.submitButton = null;
    this._eventHandlers = {};
  }

  async render() {
    return `
      <section class="auth-container">
        <div class="auth-form-container">
          <h1 class="auth-title">Create Account</h1>
          
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required aria-required="true">
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required aria-required="true">
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                minlength="8" 
                required 
                aria-required="true"
                aria-describedby="passwordHint"
              >
              <small id="passwordHint">Password must be at least 8 characters long</small>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Register</button>
            </div>
            
            <div id="registerErrorContainer" class="error-container"></div>
          </form>
          
          <p class="auth-link">
            Already have an account? <a href="#/login">Login</a>
          </p>
        </div>
      </section>
    `;
  }

  afterRender() {
    // Initialize DOM elements
    this.registerForm = document.getElementById('registerForm');
    this.errorContainer = document.getElementById('registerErrorContainer');
    this.submitButton = document.querySelector('#registerForm button[type="submit"]');
  }
  
  setupRegisterForm(onSubmit) {
    this._eventHandlers.formSubmit = onSubmit;
    this.registerForm.addEventListener('submit', onSubmit);
  }

  setLoading(isLoading) {
    if (this.submitButton) {
      this.submitButton.disabled = isLoading;
      this.submitButton.textContent = isLoading ? 'Registering...' : 'Register';
    }
  }
  
  showError(message) {
    this.errorContainer.innerHTML = `<p>${message}</p>`;
  }
  
  clearError() {
    this.errorContainer.innerHTML = '';
  }
  
  getFormData() {
    const formData = new FormData(this.registerForm);
    return {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    };
  }
  
  destroy() {
    // Remove event listeners
    if (this._eventHandlers.formSubmit) {
      this.registerForm.removeEventListener('submit', this._eventHandlers.formSubmit);
    }
  }
}

export default RegisterPage;