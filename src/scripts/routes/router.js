/**
 * Simple router for SPA hash-based navigation
 */
class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
  }

  /**
   * Add a route to the router
   * @param {String} path - Route path
   * @param {Object} page - Page component
   */
  addRoute(path, page) {
    this.routes[path] = page;
    return this;
  }

  /**
   * Get the active route from URL hash
   */
  getActiveRoute() {
    let path = window.location.hash.slice(1);
    if (path === '') path = '/';

    // Check for routes with parameters
    const paramRoutes = Object.keys(this.routes).filter(route => route.includes(':'));

    // Check exact routes first
    if (this.routes[path]) {
      return { path, params: {} };
    }

    // Check parameter routes
    for (const route of paramRoutes) {
      const routeParts = route.split('/');
      const pathParts = path.split('/');

      if (routeParts.length !== pathParts.length) continue;

      const params = {};
      let match = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          // This is a parameter
          const paramName = routeParts[i].slice(1);
          params[paramName] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return { path: route, params };
      }
    }

    // Default to home if no match
    return { path: '/', params: {} };
  }

  /**
   * Load the current route
   * @param {HTMLElement} container - Container element for rendering
   */
  async loadPage(container) {
    const { path, params } = this.getActiveRoute();
    const page = this.routes[path];

    if (!page) {
      console.error(`Route not found: ${path}`);
      // Use the NotFoundPage if defined (wildcard '*')
      const NotFoundPage = this.routes['*'];
      if (NotFoundPage) {
        this.currentPage = NotFoundPage;
        container.innerHTML = await NotFoundPage.render();
        if (typeof NotFoundPage.afterRender === 'function') {
          await NotFoundPage.afterRender();
        }
      } else {
        container.innerHTML = '<div class="error-container">Page not found</div>';
      }
      return;
    }

    // Clean up current page if needed
    if (this.currentPage && typeof this.currentPage.destroy === 'function') {
      this.currentPage.destroy();
    }

    // Save current page
    this.currentPage = page;

    // Set page parameters if available
    if (page.setParams && Object.keys(params).length > 0) {
      page.setParams(params);
    }

    // Render the page
    try {
      container.innerHTML = await page.render();

      if (typeof page.afterRender === 'function') {
        await page.afterRender();
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error loading page:', error);
      container.innerHTML = `
        <div class="error-container">
          <h2>Error loading page</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}

export default Router;
