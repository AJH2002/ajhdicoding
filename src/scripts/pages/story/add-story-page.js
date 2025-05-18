// src/scripts/pages/story/add-story-page.js
import Component from '../../utils/component';

class AddStoryPage extends Component {
  constructor() {
    super();
    // DOM Elements that will be initialized after render
    this.videoElement = null;
    this.canvasElement = null;
    this.photoPreview = null;
    this.startCameraButton = null;
    this.takePictureButton = null;
    this.retakePictureButton = null;
    this.submitButton = null;
    this.errorContainer = null;
    this.form = null;
    this.latitudeInput = null;
    this.longitudeInput = null;
    this.clearLocationButton = null;
    this.mapElement = null;
    
    // Event handlers object to store the bound event handler functions
    this._eventHandlers = {};
  }

  async render() {
    return `
      <div class="skip-to-content">
        <a href="#content">Skip to content</a>
      </div>
      
      <section id="content" class="add-story-container container">
        <h1>Share Your Story</h1>
        
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group camera-section">
            <h2>Take a Photo</h2>
            
            <div class="camera-container">
              <video id="cameraVideo" autoplay playsinline class="camera-preview"></video>
              <canvas id="cameraCanvas" class="camera-canvas"></canvas>
              
              <div class="camera-controls">
                <button type="button" id="startCameraButton" class="btn">
                  <i class="fas fa-camera"></i> Start Camera
                </button>
                <button type="button" id="takePictureButton" class="btn" disabled>
                  <i class="fas fa-camera"></i> Take Picture
                </button>
                <button type="button" id="retakePictureButton" class="btn" disabled>
                  <i class="fas fa-redo"></i> Retake
                </button>
              </div>
            </div>
            
            <div class="photo-preview-container">
              <h3>Photo Preview</h3>
              <div id="photoPreview" class="photo-preview">
                <p>No photo taken yet</p>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Story Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows="4" 
              required 
              aria-required="true"
              placeholder="Share your story..."
            ></textarea>
          </div>
          
          <div class="form-group location-section">
            <h2>Add Location (Optional)</h2>
            <p>Click on the map to select your location</p>
            
            <div id="locationMap" class="location-map"></div>
            
            <div class="location-fields">
              <div class="form-group">
                <label for="latitude">Latitude</label>
                <input type="text" id="latitude" name="latitude" readonly>
              </div>
              
              <div class="form-group">
                <label for="longitude">Longitude</label>
                <input type="text" id="longitude" name="longitude" readonly>
              </div>
              
              <button type="button" id="clearLocationButton" class="btn" disabled>
                Clear Location
              </button>
            </div>
          </div>
          
          <div class="form-group submit-section">
            <button type="submit" id="submitButton" class="btn btn-primary" disabled>
              Share Story
            </button>
          </div>
          
          <div id="errorContainer" class="error-container"></div>
        </form>
      </section>
    `;
  }
  
  afterRender() {
    // Initialize DOM elements
    this.videoElement = document.getElementById('cameraVideo');
    this.canvasElement = document.getElementById('cameraCanvas');
    this.photoPreview = document.getElementById('photoPreview');
    this.startCameraButton = document.getElementById('startCameraButton');
    this.takePictureButton = document.getElementById('takePictureButton');
    this.retakePictureButton = document.getElementById('retakePictureButton');
    this.submitButton = document.getElementById('submitButton');
    this.errorContainer = document.getElementById('errorContainer');
    this.form = document.getElementById('addStoryForm');
    this.latitudeInput = document.getElementById('latitude');
    this.longitudeInput = document.getElementById('longitude');
    this.clearLocationButton = document.getElementById('clearLocationButton');
    this.mapElement = document.getElementById('locationMap');
  }
  
  // Setup event listeners - called by the presenter
  setupCameraEvents(onStartCamera, onTakePicture, onRetakePicture) {
    // Store the event handlers so we can clean them up later
    this._eventHandlers.startCamera = onStartCamera;
    this._eventHandlers.takePicture = onTakePicture;
    this._eventHandlers.retakePicture = onRetakePicture;
    
    this.startCameraButton.addEventListener('click', onStartCamera);
    this.takePictureButton.addEventListener('click', onTakePicture);
    this.retakePictureButton.addEventListener('click', onRetakePicture);
  }
  
  setupMapEvents(onLocationSelected, onClearLocation) {
    this._eventHandlers.clearLocation = onClearLocation;
    this.clearLocationButton.addEventListener('click', onClearLocation);
    
    // Create a custom event listener for map location selection
    this.mapElement.addEventListener('map:locationSelected', onLocationSelected);
  }
  
  setupFormSubmission(onSubmit) {
    this._eventHandlers.formSubmit = onSubmit;
    this.form.addEventListener('submit', onSubmit);
  }
  
  // UI update methods - called by the presenter
  showCameraStarted() {
    // Show video and hide canvas
    this.videoElement.style.display = 'block';
    this.canvasElement.style.display = 'none';
    
    // Update button states
    this.startCameraButton.disabled = true;
    this.takePictureButton.disabled = false;
    this.retakePictureButton.disabled = true;
  }
  
  showPhotoTaken(imageUrl) {
    // Display preview
    this.photoPreview.innerHTML = `
      <img 
        src="${imageUrl}" 
        alt="Captured photo" 
        class="captured-photo"
      >
    `;
    
    // Show canvas and hide video
    this.videoElement.style.display = 'none';
    this.canvasElement.style.display = 'block';
    
    // Update button states
    this.takePictureButton.disabled = true;
    this.retakePictureButton.disabled = false;
    this.submitButton.disabled = false;
  }
  
  resetPhotoPreview() {
    // Reset photo preview
    this.photoPreview.innerHTML = '<p>No photo taken yet</p>';
    
    // Show video and hide canvas
    this.videoElement.style.display = 'block';
    this.canvasElement.style.display = 'none';
    
    // Update button states
    this.takePictureButton.disabled = false;
    this.retakePictureButton.disabled = true;
    this.submitButton.disabled = true;
  }
  
  updateLocationInputs(lat, lng) {
    this.latitudeInput.value = lat.toFixed(6);
    this.longitudeInput.value = lng.toFixed(6);
    this.clearLocationButton.disabled = false;
  }
  
  clearLocationInputs() {
    this.latitudeInput.value = '';
    this.longitudeInput.value = '';
    this.clearLocationButton.disabled = true;
  }
  
  showLoading(isLoading) {
    this.submitButton.disabled = isLoading;
    this.submitButton.textContent = isLoading ? 'Sharing...' : 'Share Story';
  }
  
  showError(message) {
    this.errorContainer.innerHTML = `<p>${message}</p>`;
  }
  
  clearError() {
    this.errorContainer.innerHTML = '';
  }
  
  // Clean up
  destroy() {
    // Remove event listeners
    if (this._eventHandlers.startCamera) {
      this.startCameraButton.removeEventListener('click', this._eventHandlers.startCamera);
    }
    
    if (this._eventHandlers.takePicture) {
      this.takePictureButton.removeEventListener('click', this._eventHandlers.takePicture);
    }
    
    if (this._eventHandlers.retakePicture) {
      this.retakePictureButton.removeEventListener('click', this._eventHandlers.retakePicture);
    }
    
    if (this._eventHandlers.formSubmit) {
      this.form.removeEventListener('submit', this._eventHandlers.formSubmit);
    }
    
    if (this._eventHandlers.clearLocation) {
      this.clearLocationButton.removeEventListener('click', this._eventHandlers.clearLocation);
    }
  }
}

export default AddStoryPage;