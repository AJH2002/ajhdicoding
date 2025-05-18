const AUTH_KEY = 'DICODING_STORY_AUTH';

const saveAuth = (auth) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

const getAuth = () => {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
};

const removeAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

export { saveAuth, getAuth, removeAuth };