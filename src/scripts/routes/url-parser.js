// src/scripts/routes/url-parser.js

/**
 * URL parser for extracting parameters from the URL
 */
const UrlParser = {
  /**
   * Get the active URL from the hash
   * @returns {String} URL without hash
   */
  parseActiveUrl() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._urlSplitter(url);
  },
  
  /**
   * Split URL into parts
   * @param {String} url - URL to split
   * @returns {Object} Split URL parts
   */
  _urlSplitter(url) {
    const urlsSplits = url.split('/');
    return {
      resource: urlsSplits[1] || null,
      id: urlsSplits[2] || null,
      verb: urlsSplits[3] || null,
    };
  },
  
  /**
   * Combine URL parts into a route string
   * @param {Object} splitUrl - Split URL parts
   * @returns {String} Combined route
   */
  _urlCombiner(splitUrl) {
    return (splitUrl.resource ? `/${splitUrl.resource}` : '/')
      + (splitUrl.id ? '/:id' : '')
      + (splitUrl.verb ? `/${splitUrl.verb}` : '');
  },
  
  /**
   * Parse active URL and combine it into a route string
   * @returns {String} Route string
   */
  parseActiveUrlWithCombiner() {
    const url = this.parseActiveUrl();
    return this._urlCombiner(url);
  }
};

export default UrlParser;