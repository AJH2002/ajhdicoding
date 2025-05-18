import Component from '../../utils/component';

class NotFoundPage extends Component {
  async render() {
    return `
      <div class="not-found-container container">
        <div class="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <a href="#/" class="btn btn-primary">Back to Home</a>
        </div>
      </div>
    `;
  }
}

export default NotFoundPage;