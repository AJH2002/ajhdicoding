// src/scripts/routes/routes.js
import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import AddStoryPage from '../pages/story/add-story-page';
import StoryDetailPage from '../pages/story/story-detail-page';
import AboutPage from '../pages/about/about-page';
import FavoritesPage from '../pages/favorites/favorites-page';
import NotFoundPage from '../pages/not-found/not-found-page';


import FavoritesPresenter from '../presenters/favorites-presenter';
import HomePresenter from '../presenters/home-presenter';
import LoginPresenter from '../presenters/login-presenter';
import RegisterPresenter from '../presenters/register-presenter';
import AddStoryPresenter from '../presenters/add-story-presenter';
import StoryDetailPresenter from '../presenters/story-detail-presenter';
import AboutPresenter from '../presenters/about-presenter';

import Component from '../utils/component';

class MVPPage extends Component {
  constructor(PageClass, PresenterClass) {
    super();
    this.page = new PageClass();
    this.presenterClass = PresenterClass;
    this.presenter = null;
  }
  
  setParams(params) {
    if (this.page.setParams) {
      this.page.setParams(params);
    }
    
    // Store params for the presenter (may be needed in afterRender)
    this.params = params;
  }
  
  async render() {
    return await this.page.render();
  }
  
  async afterRender() {
    // Call page's afterRender first to initialize DOM elements
    if (this.page.afterRender) {
      await this.page.afterRender();
    }
    
    // Then initialize the presenter
    this.presenter = new this.presenterClass(this.page);
    
    // Set ID for detail pages if needed
    if (this.params && this.params.id && this.presenter.setId) {
      this.presenter.setId(this.params.id);
    }
    
    // Initialize the presenter
    if (this.presenter.init) {
      await this.presenter.init();
    }
  }
  
  destroy() {
    if (this.presenter && typeof this.presenter.destroy === 'function') {
      this.presenter.destroy();
    }
    
    if (this.page && typeof this.page.destroy === 'function') {
      this.page.destroy();
    }
  }
}

const routes = {
  '/': new MVPPage(HomePage, HomePresenter),
  '/login': new MVPPage(LoginPage, LoginPresenter),
  '/register': new MVPPage(RegisterPage, RegisterPresenter),
  '/add': new MVPPage(AddStoryPage, AddStoryPresenter),
  '/story/:id': new MVPPage(StoryDetailPage, StoryDetailPresenter),
  '/about': new MVPPage(AboutPage, AboutPresenter),
  '/favorites': new MVPPage(FavoritesPage, FavoritesPresenter), 
  '/not-found': new MVPPage(NotFoundPage, null),
};


export default routes;