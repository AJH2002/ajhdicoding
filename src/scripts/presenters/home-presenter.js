// src/scripts/presenters/home-presenter.js
import StoryModel from '../models/story-model';
import AuthModel from '../models/auth-model';
import Map from '../utils/map';
import { showFormattedDate } from '../utils/index';

class HomePresenter {
  constructor(view) {
    this.view = view;
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();
    this.map = null;
    this.stories = [];
  }
  
  async init() {
    try {
      // Initialize map
      const mapElement = document.getElementById('storiesMap');
      this.map = new Map(mapElement, { 
        additionalLayers: true,
        enableLayerControl: true
      });
      
      await this.map.initMap();
      
      // Setup event handlers
      this.view.setupEventHandlers(
        this.handleRetryClick.bind(this),
        this.handleShowOnMapClick.bind(this)
      );
      
      // Load stories
      await this.loadStories();
    } catch (error) {
      this.view.showError(error.message);
    }
  }
  
  async loadStories() {
    try {
      this.view.showLoading(true);
      
      const auth = this.authModel.getAuth();
      const token = auth?.token || null;
      
      const response = await this.storyModel.getAllStories(token, 1, 10, 1);
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      this.stories = response.listStory || [];
      
      // Update view
      this.view.updateStories(this.stories, showFormattedDate);
      
      // Add markers to map
      if (this.map) {
        this.map.addMarkers(this.stories);
      }
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.showLoading(false);
    }
  }
  
  handleRetryClick() {
    this.loadStories();
  }
  
  handleShowOnMapClick(event) {
    const button = event.currentTarget;
    const lat = parseFloat(button.dataset.lat);
    const lon = parseFloat(button.dataset.lon);
    const id = button.dataset.id;
    
    this.showStoryOnMap(lat, lon, id);
  }
  
  showStoryOnMap(lat, lon, id) {
    // Find the story to get the data for the popup
    const story = this.stories.find(s => s.id === id);
    
    if (story && this.map) {
      // Add marker and zoom to location
      this.map.addMarker(lat, lon, `
        <div class="map-popup">
          <h4>${story.name}</h4>
          <img src="${story.photoUrl}" alt="${story.name}'s story" width="100">
          <p>${this.view.truncateText(story.description, 100)}</p>
          <a href="#/story/${story.id}">View Details</a>
        </div>
      `);
      
      this.map.map.setView([lat, lon], 15);
      
      // Scroll to map
      this.view.scrollToMap();
    }
  }
  
  destroy() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }
}

export default HomePresenter;