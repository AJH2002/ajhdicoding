// src/scripts/utils/component.js

/**
 * Base component class for all page components
 */
class Component {
  /**
   * Render the component
   * @returns {String} HTML content
   */
  async render() {
    return '';
  }
  
  /**
   * After render hook for setting up event listeners
   */
  async afterRender() {
    // To be implemented by subclasses
  }
  
  /**
   * Clean up resources when component is destroyed
   */
  destroy() {
    // To be implemented by subclasses
  }
}

export default Component;