import { openDB } from 'idb';
import CONFIG from '../config';

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Create object store if it doesn't exist
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

const FavoriteStoryIdb = {
  async getStory(id) {
    if (!id) {
      return null;
    }
    
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async putStory(story) {
    if (!story.id) {
      return null;
    }
    
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  async searchStories(query) {
    const allStories = await this.getAllStories();
    return allStories.filter((story) => {
      const loweredCaseQuery = query.toLowerCase();
      return story.name.toLowerCase().includes(loweredCaseQuery) || 
             story.description.toLowerCase().includes(loweredCaseQuery);
    });
  },
};

export default FavoriteStoryIdb;