// src/scripts/pages/home/home-page.js
import Component from '../../utils/component';

class HomePage extends Component {
  constructor() {
    super();
    this.stories = [];
    
    // DOM elements
    this.storiesLoader = null;
    this.storiesContent = null;
    this.mapElement = null;
    
    // Event handlers
    this._eventHandlers = {};
  }

  async render() {
    return `
      <div class="skip-to-content">
        <a href="#content">Skip to content</a>
      </div>
      
      <section class="hero">
        <div class="container">
          <h1>Dicoding Story</h1>
          <p>Share your moments with the Dicoding community</p>
          <div class="hero-buttons">
            <a href="#/add" class="btn btn-primary">Share a Story</a>
          </div>
        </div>
      </section>
      
      <section id="content" class="stories-container container">
        <h2>Recent Stories</h2>
        
        <div class="map-container">
          <div id="storiesMap" class="map"></div>
        </div>
        
        <div id="storiesLoader" class="loader-container">
          <div class="loader"></div>
          <p>Loading stories...</p>
        </div>
        
        <div id="storiesContent" class="stories-grid">
          <!-- Stories will be inserted here -->
        </div>
      </section>
    `;
  }
  
  afterRender() {
    // Initialize DOM elements
    this.storiesLoader = document.getElementById('storiesLoader');
    this.storiesContent = document.getElementById('storiesContent');
    this.mapElement = document.getElementById('storiesMap');
  }
  
  setupEventHandlers(onRetryClick, onStoryMapButtonClick) {
    this._eventHandlers.retryClick = onRetryClick;
    this._eventHandlers.storyMapButtonClick = onStoryMapButtonClick;
    
    // Retry button click handler is set dynamically when the error is shown
    
    // Map button click handler will be set when stories are rendered
  }

  showLoading(isLoading) {
    if (this.storiesLoader) {
      this.storiesLoader.style.display = isLoading ? 'flex' : 'none';
    }
  }

  updateStories(stories, formatDateFn) {
    this.stories = stories;
    if (this.storiesContent) {
      this.storiesContent.innerHTML = this.generateStoriesTemplate(formatDateFn);
      
      // Add event listeners to map buttons if handler is set
      if (this._eventHandlers.storyMapButtonClick) {
        document.querySelectorAll('.show-on-map').forEach(button => {
          button.addEventListener('click', this._eventHandlers.storyMapButtonClick);
        });
      }
    }
  }

  showError(message) {
    if (this.storiesContent) {
      this.storiesContent.innerHTML = `
        <div class="error-container">
          <p>Failed to load stories: ${message}</p>
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
  
  generateStoriesTemplate(formatDateFn) {
    if (this.stories.length === 0) {
      return `
        <div class="empty-state">
          <p>No stories found. Be the first to share!</p>
          <a href="#/add" class="btn btn-primary">Share a Story</a>
        </div>
      `;
    }
    
    return this.stories.map(story => `
      <article class="story-card">
        <div class="story-image">
          <img 
            src="${story.photoUrl}" 
            alt="Photo by ${story.name}" 
            loading="lazy"
            class="lazy-image"
          >
        </div>
        <div class="story-content">
          <header>
            <h3 class="story-author">${story.name}</h3>
            <time datetime="${story.createdAt}">
              ${formatDateFn(story.createdAt)}
            </time>
          </header>
          <div class="story-description">
            <p>${this.truncateText(story.description, 100)}</p>
          </div>
          <footer>
            <a href="#/story/${story.id}" class="read-more">Read more</a>
            ${story.lat && story.lon ? `
              <button 
                class="show-on-map" 
                data-lat="${story.lat}" 
                data-lon="${story.lon}" 
                data-id="${story.id}"
                aria-label="Show ${story.name}'s story on map"
              >
                <i class="fas fa-map-marker-alt"></i>
              </button>
            ` : ''}
          </footer>
        </div>
      </article>
    `).join('');
  }
  
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  scrollToMap() {
    document.querySelector('.map-container').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
  
  destroy() {
    // Clean up event listeners
    document.querySelectorAll('.show-on-map').forEach(button => {
      if (this._eventHandlers.storyMapButtonClick) {
        button.removeEventListener('click', this._eventHandlers.storyMapButtonClick);
      }
    });
    
    const retryButton = document.getElementById('retryButton');
    if (retryButton && this._eventHandlers.retryClick) {
      retryButton.removeEventListener('click', this._eventHandlers.retryClick);
    }
  }
}

export default HomePage;