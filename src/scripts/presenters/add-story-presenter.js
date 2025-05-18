// src/scripts/presenters/add-story-presenter.js
import StoryModel from '../models/story-model';
import AuthModel from '../models/auth-model';
import Camera from '../utils/camera';
import Map from '../utils/map';

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();
    this.camera = null;
    this.map = null;
    this.photoBlob = null;
    this.position = null;
  }
  
  async init() {
    // Initialize camera
    const videoElement = document.getElementById('cameraVideo');
    this.camera = new Camera(videoElement);
    
    // Initialize map
    const mapElement = document.getElementById('locationMap');
    this.map = new Map(mapElement, { 
      clickable: true,
      additionalLayers: true,
      enableLayerControl: true 
    });
    
    await this.map.initMap();
    
    // Setup event handlers by passing handler methods to the view
    this.view.setupCameraEvents(
      this.handleStartCamera.bind(this),
      this.handleTakePicture.bind(this),
      this.handleRetakePicture.bind(this)
    );
    
    this.view.setupMapEvents(
      this.handleLocationSelected.bind(this),
      this.handleClearLocation.bind(this)
    );
    
    this.view.setupFormSubmission(this.handleFormSubmission.bind(this));
  }
  
  // Camera event handlers
  async handleStartCamera() {
    try {
      await this.camera.start();
      this.view.showCameraStarted();
    } catch (error) {
      this.view.showError(`Error accessing camera: ${error.message}`);
    }
  }
  
  async handleTakePicture() {
    try {
      // Take picture and get blob
      this.photoBlob = await this.camera.takePicture(document.getElementById('cameraCanvas'));
      
      // Create URL for the photo and update UI
      const imageUrl = URL.createObjectURL(this.photoBlob);
      this.view.showPhotoTaken(imageUrl);
    } catch (error) {
      this.view.showError(`Error capturing photo: ${error.message}`);
    }
  }
  
  handleRetakePicture() {
    // Clear previous photo
    if (this.photoBlob) {
      URL.revokeObjectURL(document.querySelector('.captured-photo')?.src);
      this.photoBlob = null;
    }
    
    this.view.resetPhotoPreview();
  }
  
  // Map event handlers
  handleLocationSelected(event) {
    const { lat, lng } = event.detail;
    
    // Save position
    this.position = { lat, lng };
    
    // Update UI
    this.view.updateLocationInputs(lat, lng);
  }
  
  handleClearLocation() {
    // Clear position
    this.position = null;
    
    // Update UI
    this.view.clearLocationInputs();
    
    // Remove marker from map
    if (this.map) {
      this.map.map.removeLayer(this.map.marker);
      this.map.marker = null;
    }
  }
  
  // Form submission handler
  async handleFormSubmission(event) {
    event.preventDefault();
    
    try {
      // Check if we have a photo
      if (!this.photoBlob) {
        this.view.showError('Please take a photo first');
        return;
      }
      
      // Get form data
      const description = document.getElementById('description').value;
      
      // Prepare story data
      const storyData = {
        description,
        photo: this.photoBlob,
      };
      
      // Add location if available
      if (this.position) {
        storyData.lat = this.position.lat;
        storyData.lon = this.position.lng;
      }
      
      // Show loading state
      this.view.showLoading(true);
      this.view.clearError();
      
      // Submit story
      const auth = this.authModel.getAuth();
      const token = auth?.token;
      
      let response;
      
      if (token) {
        response = await this.storyModel.addStory(storyData, token);
      } else {
        response = await this.storyModel.addStoryAsGuest(storyData);
      }
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      // Success, navigate back to home
      alert('Your story has been shared successfully!');
      window.location.hash = '#/';
    } catch (error) {
      // Show error
      this.view.showError(`Error sharing story: ${error.message}`);
    } finally {
      // Reset loading state
      this.view.showLoading(false);
    }
  }
  
  destroy() {
    if (this.camera) {
      this.camera.stop();
    }
    
    if (this.map) {
      this.map.destroy();
    }
    
    if (this.photoBlob) {
      URL.revokeObjectURL(document.querySelector('.captured-photo')?.src);
    }
  }
}

export default AddStoryPresenter;