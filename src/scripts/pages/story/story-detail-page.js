// src/scripts/pages/story/story-detail-page.js
import Component from '../../utils/component';

class StoryDetailPage extends Component {
  constructor() {
    super();
    this.id = null;
    
    // DOM elements
    this.storyLoader = null;
    this.storyContent = null;
    this.mapElement = null;
    
    // Event handlers
    this._eventHandlers = {};
  }

  setParams(params) {
    this.id = params.id;
  }

  async render() {
    return `
      <div class="skip-to-content">
        <a href="#content">Skip to content</a>
      </div>
      
      <section id="content" class="story-detail-container container">
        <div id="storyLoader" class="loader-container">
          <div class="loader"></div>
          <p>Loading story...</p>
        </div>
        
        <div id="storyContent">
          <!-- Story detail will be inserted here -->
        </div>
      </section>
    `;
  }
  
  afterRender() {
    // Initialize DOM elements
    this.storyLoader = document.getElementById('storyLoader');
    this.storyContent = document.getElementById('storyContent');
  }
  
  setupEventHandlers(onRetryClick) {
    this._eventHandlers.retryClick = onRetryClick;
    // The retry button will be added dynamically when showing an error
  }

  showLoading(isLoading) {
    if (this.storyLoader) {
      this.storyLoader.style.display = isLoading ? 'flex' : 'none';
    }
  }

  displayStory(story, formatDateFn, isFavorite = false) {
    if (this.storyContent) {
      this.storyContent.innerHTML = this.generateStoryDetailTemplate(story, formatDateFn, isFavorite);
      
      // Store the map element reference if story has location
      if (story.lat && story.lon) {
        this.mapElement = document.getElementById('storyMap');
      }
    }
  }

  showError(message) {
    if (this.storyContent) {
      this.storyContent.innerHTML = `
        <div class="error-container">
          <p>Failed to load story: ${message}</p>
          <a href="#/" class="btn">Back to Home</a>
          <button id="retryButton" class="btn">Retry</button>
        </div>
      `;
      
      // Add event listener to retry button
      const retryButton = document.getElementById('retryButton');
      if (retryButton && this._eventHandlers.retryClick) {
        retryButton.addEventListener('click', this._eventHandlers.retryClick);
      }
    }
  }
  
  getMapElement() {
    return this.mapElement;
  }
  
  setupFavoriteButton(onFavoriteClick) {
    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton && onFavoriteClick) {
      this._eventHandlers.favoriteClick = onFavoriteClick;
      favoriteButton.addEventListener('click', onFavoriteClick);
    }
  }
  
  updateFavoriteButton(isFavorite) {
    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton) {
      favoriteButton.innerHTML = isFavorite 
        ? '<i class="fas fa-heart"></i> Remove from Favorites'
        : '<i class="far fa-heart"></i> Add to Favorites';
      
      favoriteButton.classList.toggle('btn-favorite', !isFavorite);
      favoriteButton.classList.toggle('btn-favorited', isFavorite);
    }
  }
  
  // Changed from _generateStoryDetailTemplate to generateStoryDetailTemplate to fix the error
  generateStoryDetailTemplate(story, formatDateFn, isFavorite = false) {
    if (!story) {
      return '<p>Story not found</p>';
    }
    
    return `
      <article class="story-detail">
        <div class="back-button-container">
          <a href="#/" class="back-button">
            <i class="fas fa-arrow-left"></i> Back to Stories
          </a>
        </div>
        
        <header class="story-header">
          <h1>${story.name}'s Story</h1>
          <time datetime="${story.createdAt}">
            Posted on ${formatDateFn(story.createdAt)}
          </time>
        </header>
        
        <figure class="story-image-container">
          <img 
            src="${story.photoUrl}" 
            alt="Photo by ${story.name}" 
            class="story-image"
          >
        </figure>
        
        <div class="story-description">
          <p>${story.description}</p>
        </div>
        
        <div class="story-actions">
          <button id="favoriteButton" class="btn ${isFavorite ? 'btn-favorited' : 'btn-favorite'}">
            <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart-o'}"></i> 
            ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
        
        ${story.lat && story.lon ? `
          <div class="story-location">
            <h2>Location</h2>
            <div id="storyMap" class="story-map"></div>
          </div>
        ` : ''}
      </article>
    `;
  }
  
  destroy() {
    // Clean up event listeners
    const retryButton = document.getElementById('retryButton');
    if (retryButton && this._eventHandlers.retryClick) {
      retryButton.removeEventListener('click', this._eventHandlers.retryClick);
    }
    
    const favoriteButton = document.getElementById('favoriteButton');
    if (favoriteButton && this._eventHandlers.favoriteClick) {
      favoriteButton.removeEventListener('click', this._eventHandlers.favoriteClick);
    }
  }
}

export default StoryDetailPage;