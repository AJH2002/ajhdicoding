import Component from '../../utils/component';

class FavoritesPage extends Component {
  constructor() {
    super();
    this.stories = [];
    
    // DOM elements
    this.storiesLoader = null;
    this.storiesContent = null;
    
    // Event handlers
    this._eventHandlers = {};
  }

  async render() {
    return `
      <div class="skip-to-content">
        <a href="#content">Skip to content</a>
      </div>
      
      <section id="content" class="stories-container container">
        <h1>Favorite Stories</h1>
        
        <div id="storiesLoader" class="loader-container">
          <div class="loader"></div>
          <p>Loading favorite stories...</p>
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
    }
  }

  showError(message) {
    if (this.storiesContent) {
      this.storiesContent.innerHTML = `
        <div class="error-container">
          <p>${message}</p>
        </div>
      `;
    }
  }
  
  generateStoriesTemplate(formatDateFn) {
    if (this.stories.length === 0) {
      return `
        <div class="empty-state">
          <p>You don't have any favorite stories yet. Browse stories and add them to your favorites!</p>
          <a href="#/" class="btn btn-primary">Browse Stories</a>
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
            <button 
              class="btn btn-small btn-danger remove-favorite" 
              data-id="${story.id}"
            >
              <i class="fas fa-trash"></i> Remove
            </button>
          </footer>
        </div>
      </article>
    `).join('');
  }
  
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  setupRemoveButtons(onRemove) {
    this._eventHandlers.removeClick = onRemove;
    
    document.querySelectorAll('.remove-favorite').forEach(button => {
      button.addEventListener('click', onRemove);
    });
  }
  
  destroy() {
    // Clean up event listeners
    document.querySelectorAll('.remove-favorite').forEach(button => {
      if (this._eventHandlers.removeClick) {
        button.removeEventListener('click', this._eventHandlers.removeClick);
      }
    });
  }
}

export default FavoritesPage;