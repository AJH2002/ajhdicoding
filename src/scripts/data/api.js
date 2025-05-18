import CONFIG from '../config';

const API_ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  NOTIFICATIONS_SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

// Auth functions
export const register = async (userData) => {
  const response = await fetch(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return await response.json();
};

export const login = async (credentials) => {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  return await response.json();
};

// Story functions
export const getAllStories = async (token, page = 1, size = 10, withLocation = 0) => {
  const url = new URL(API_ENDPOINTS.GET_ALL_STORIES);
  url.searchParams.append('page', page);
  url.searchParams.append('size', size);
  url.searchParams.append('location', withLocation);
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return await response.json();
};

export const getStoryDetail = async (id, token) => {
  const response = await fetch(API_ENDPOINTS.GET_STORY_DETAIL(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return await response.json();
};

export const addStory = async (storyData, token) => {
  const formData = new FormData();
  formData.append('description', storyData.description);
  formData.append('photo', storyData.photo);
  
  if (storyData.lat !== undefined && storyData.lon !== undefined) {
    formData.append('lat', storyData.lat);
    formData.append('lon', storyData.lon);
  }
  
  const response = await fetch(API_ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  return await response.json();
};

export const addStoryAsGuest = async (storyData) => {
  const formData = new FormData();
  formData.append('description', storyData.description);
  formData.append('photo', storyData.photo);
  
  if (storyData.lat !== undefined && storyData.lon !== undefined) {
    formData.append('lat', storyData.lat);
    formData.append('lon', storyData.lon);
  }
  
  const response = await fetch(API_ENDPOINTS.ADD_STORY_GUEST, {
    method: 'POST',
    body: formData,
  });
  
  return await response.json();
};

// Web Push Notification
export const subscribeNotification = async (subscription, token) => {
  const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscription),
  });
  
  return await response.json();
};

export const unsubscribeNotification = async (endpoint, token) => {
  const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  
  return await response.json();
};