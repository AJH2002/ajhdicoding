import FavoriteStoryIdb from '../data/favorite-story-idb';
import { showFormattedDate } from '../utils/index';

class FavoritesPresenter {
  constructor(view) {
    this.view = view;
  }
  
  async init() {
    try {
      this.view.showLoading(true);
      
      // Load favorite stories from IndexedDB
      const stories = await FavoriteStoryIdb.getAllStories();
      
      // Update view with stories
      this.view.updateStories(stories, showFormattedDate);
      
      // Setup remove buttons if there are stories
      if (stories.length > 0) {
        this.view.setupRemoveButtons(this.handleRemoveFavorite.bind(this));
      }
    } catch (error) {
      this.view.showError('Failed to load favorite stories: ' + error.message);
    } finally {
      this.view.showLoading(false);
    }
  }
  
  async handleRemoveFavorite(event) {
    try {
      const id = event.currentTarget.dataset.id;
      
      if (confirm('Are you sure you want to remove this story from favorites?')) {
        // Delete from IndexedDB
        await FavoriteStoryIdb.deleteStory(id);
        
        // Reload favorites
        const stories = await FavoriteStoryIdb.getAllStories();
        this.view.updateStories(stories, showFormattedDate);
        
        // Setup remove buttons again
        if (stories.length > 0) {
          this.view.setupRemoveButtons(this.handleRemoveFavorite.bind(this));
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }
}

export default FavoritesPresenter;