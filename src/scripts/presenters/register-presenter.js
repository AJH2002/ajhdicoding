// src/scripts/presenters/register-presenter.js
import AuthModel from '../models/auth-model';

class RegisterPresenter {
  constructor(view) {
    this.view = view;
    this.authModel = new AuthModel();
  }
  
  async init() {
    this.view.setupRegisterForm(this.handleRegisterSubmit.bind(this));
  }
  
  async handleRegisterSubmit(event) {
    event.preventDefault();
    
    try {
      // Show loading state
      this.view.setLoading(true);
      this.view.clearError();
      
      // Get form data from view
      const registerData = this.view.getFormData();
      
      // Validate password length
      if (registerData.password.length < 8) {
        this.view.showError('Password must be at least 8 characters long');
        this.view.setLoading(false);
        return;
      }
      
      // Call API through model
      const response = await this.authModel.register(registerData);
      
      if (response.error) {
        // Show error
        this.view.showError(response.message);
      } else {
        // Show success and redirect
        alert('Registration successful! Please login with your new account.');
        window.location.hash = '#/login';
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

export default RegisterPresenter;