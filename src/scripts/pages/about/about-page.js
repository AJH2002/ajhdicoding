// src/scripts/pages/about/about-page.js
import Component from '../../utils/component';

class AboutPage extends Component {
  constructor() {
    super();
    this.sections = null;
  }

  async render() {
    return `
      <div class="about-container container">
        <div class="about-content">
          <h1>About Dicoding Story</h1>
          
          <div class="about-section fade-in">
            <h2>Our Mission</h2>
            <p>
              Dicoding Story is a platform that allows members of the Dicoding community to share 
              their moments, experiences, and stories with each other. Our mission is to foster 
              connection and inspiration among developers and technology enthusiasts.
            </p>
          </div>
          
          <div class="about-section fade-in">
            <h2>Key Features</h2>
            <ul class="feature-list">
              <li>
                <div class="feature-icon">
                  <i class="fas fa-image"></i>
                </div>
                <div>
                  <h3>Photo Sharing</h3>
                  <p>Share your moments with photos directly from your camera.</p>
                </div>
              </li>
              <li>
                <div class="feature-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3>Location Tracking</h3>
                  <p>Add location to your stories so others can see where they happened.</p>
                </div>
              </li>
              <li>
                <div class="feature-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div>
                  <h3>Community Focus</h3>
                  <p>Connect with other members of the Dicoding community.</p>
                </div>
              </li>
              <li>
                <div class="feature-icon">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <div>
                  <h3>Mobile Friendly</h3>
                  <p>Access from any device with a responsive interface.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div class="about-section fade-in">
            <h2>Technologies Used</h2>
            <div class="technologies">
              <div class="technology">
                <div class="tech-icon">
                  <i class="fab fa-html5"></i>
                </div>
                <p>HTML5</p>
              </div>
              <div class="technology">
                <div class="tech-icon">
                  <i class="fab fa-css3-alt"></i>
                </div>
                <p>CSS3</p>
              </div>
              <div class="technology">
                <div class="tech-icon">
                  <i class="fab fa-js"></i>
                </div>
                <p>JavaScript</p>
              </div>
              <div class="technology">
                <div class="tech-icon">
                  <i class="fas fa-map"></i>
                </div>
                <p>Leaflet</p>
              </div>
              <div class="technology">
                <div class="tech-icon">
                  <i class="fas fa-server"></i>
                </div>
                <p>REST API</p>
              </div>
              <div class="technology">
                <div class="tech-icon">
                  <i class="fas fa-code"></i>
                </div>
                <p>Vite</p>
              </div>
            </div>
          </div>
          
          <div class="about-section fade-in">
            <h2>Accessibility Features</h2>
            <p>
              We believe in making the web accessible for everyone. Here are some of the 
              accessibility features we've implemented:
            </p>
            <ul class="accessibility-list">
              <li>Semantic HTML structure</li>
              <li>ARIA attributes</li>
              <li>Keyboard navigation</li>
              <li>Skip to content links</li>
              <li>Alternative text for images</li>
              <li>Color contrast compliance</li>
              <li>Responsive design</li>
            </ul>
          </div>
          
          <div class="about-section fade-in">
            <h2>Contact Us</h2>
            <p>
              Have questions or feedback? We'd love to hear from you! Reach out to us at 
              <a href="mailto:support@dicoding.com">support@dicoding.com</a>.
            </p>
          </div>
        </div>
      </div>
    `;
  }
  
  afterRender() {
    this.sections = document.querySelectorAll('.about-section');
  }
  
  animateSections() {
    if (this.sections) {
      this.sections.forEach((section, index) => {
        setTimeout(() => {
          section.style.opacity = '1';
        }, index * 200);
      });
    }
  }
}

export default AboutPage;