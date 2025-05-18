// src/scripts/presenters/login-presenter.js
import AuthModel from '../models/auth-model';

class LoginPresenter {
  constructor(view) {
    this.view = view;
    this.authModel = new AuthModel();
  }
  
  async init() {
    this.view.setupLoginForm(this.handleLoginSubmit.bind(this));
  }
  
  async handleLoginSubmit(event) {
    event.preventDefault();
    
    try {
      // Show loading state
      this.view.setLoading(true);
      this.view.clearError();
      
      // Get form data from view
      const loginData = this.view.getFormData();
      
      // Call API through model
      const response = await this.authModel.login(loginData);
      
      if (response.error) {
        // Show error
        this.view.showError(response.message);
      } else {
        // Save auth data and redirect
        this.authModel.saveAuth(response.loginResult);
        window.location.hash = '#/';
      }
    } catch (error) {
      // Show error
      this.view.showError(`An error occurred: ${error.message}`);
    } finally {
      // Reset button
      this.view.setLoading(false);
    }
  }
}

export default LoginPresenter;