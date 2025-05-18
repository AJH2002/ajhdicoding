// src/scripts/models/story-model.js
import CONFIG from '../config';

class StoryModel {
  constructor() {
    this.baseUrl = CONFIG.BASE_URL;
  }

  async getAllStories(token, page = 1, size = 10, withLocation = 0) {
    const url = new URL(`${this.baseUrl}/stories`);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);
    url.searchParams.append('location', withLocation);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return await response.json();
  }

  async getStoryDetail(id, token) {
    const response = await fetch(`${this.baseUrl}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return await response.json();
  }

  async addStory(storyData, token) {
    const formData = new FormData();
    formData.append('description', storyData.description);
    formData.append('photo', storyData.photo);
    
    if (storyData.lat !== undefined && storyData.lon !== undefined) {
      formData.append('lat', storyData.lat);
      formData.append('lon', storyData.lon);
    }
    
    const response = await fetch(`${this.baseUrl}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    return await response.json();
  }

  async addStoryAsGuest(storyData) {
    const formData = new FormData();
    formData.append('description', storyData.description);
    formData.append('photo', storyData.photo);
    
    if (storyData.lat !== undefined && storyData.lon !== undefined) {
      formData.append('lat', storyData.lat);
      formData.append('lon', storyData.lon);
    }
    
    const response = await fetch(`${this.baseUrl}/stories/guest`, {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  }
}

export default StoryModel;