import StoryModel from '../models/story-model';
import AuthModel from '../models/auth-model';
import Map from '../utils/map';
import { showFormattedDate } from '../utils/index';
import FavoriteStoryIdb from '../data/favorite-story-idb';

class StoryDetailPresenter {
  constructor(view) {
    this.view = view;
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();
    this.story = null;
    this.map = null;
    this.id = null;
    this.isFavorite = false;
  }
  
  setId(id) {
    this.id = id;
  }
  
  async init() {
    try {
      if (!this.id) {
        throw new Error('Story ID not found');
      }
      
      // Get auth token
      const auth = this.authModel.getAuth();
      const token = auth?.token;
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      // Setup event handlers
      this.view.setupEventHandlers(this.handleRetryClick.bind(this));
      
      // Show loading
      this.view.showLoading(true);
      
      // Check if story is in favorites
      this.isFavorite = !!(await FavoriteStoryIdb.getStory(this.id));
      
      // Fetch story details
      const response = await this.storyModel.getStoryDetail(this.id, token);
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      this.story = response.story;
      
      // Render the story
      this.view.displayStory(this.story, showFormattedDate, this.isFavorite);
      
      // Setup favorite button
      this.view.setupFavoriteButton(this.handleFavoriteClick.bind(this));
      
      // Initialize map if we have coordinates
      if (this.story.lat && this.story.lon) {
        await this.initMap();
      }
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.showLoading(false);
    }
  }
  
  async handleFavoriteClick() {
    try {
      if (this.isFavorite) {
        await FavoriteStoryIdb.deleteStory(this.id);
      } else {
        await FavoriteStoryIdb.putStory(this.story);
      }
      
      this.isFavorite = !this.isFavorite;
      this.view.updateFavoriteButton(this.isFavorite);
      
      // Show a toast message
      alert(this.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error updating favorite status', error);
    }
  }
  
  async initMap() {
    const mapElement = this.view.getMapElement();
    
    if (!mapElement) return;
    
    this.map = new Map(mapElement, { 
      additionalLayers: true,
      enableLayerControl: true 
    });
    
    await this.map.initMap(this.story.lat, this.story.lon, 15);
    this.map.addMarker(this.story.lat, this.story.lon, `
      <div class="map-popup">
        <h4>${this.story.name}</h4>
        <p>Posted on ${showFormattedDate(this.story.createdAt)}</p>
      </div>
    `);
  }
  
  handleRetryClick() {
    this.init();
  }

  destroy() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }
}

export default StoryDetailPresenter;