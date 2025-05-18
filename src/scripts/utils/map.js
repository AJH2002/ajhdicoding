import CONFIG from '../config';

class Map {
  constructor(mapElement, options = {}) {
    this.mapElement = mapElement;
    this.map = null;
    this.marker = null;
    this.options = options;
  }

  async initMap(lat = -6.200000, lng = 106.816666, zoom = 13) {
    // Wait for leaflet to be loaded
    await this._loadLeaflet();
    
    // Initialize the map
    this.map = L.map(this.mapElement).setView([lat, lng], zoom);
    
    // Add tile layers
    this._addTileLayers();
    
    // Add layer controls if multiple layers
    if (this.options.enableLayerControl) {
      this._addLayerControl();
    }
    
    // Add click event for selecting location if needed
    if (this.options.clickable) {
      this._setupClickEvent();
    }
    
    return this.map;
  }
  
  // Add a marker to the map
  addMarker(lat, lng, popupContent = '') {
    if (!this.map) return;
    
    // Remove existing marker if present
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    
    // Create new marker
    this.marker = L.marker([lat, lng]).addTo(this.map);
    
    // Add popup if content provided
    if (popupContent) {
      this.marker.bindPopup(popupContent).openPopup();
    }
    
    return this.marker;
  }
  
  // Add multiple markers from an array of story data
  addMarkers(stories) {
    if (!this.map || !stories.length) return;
    
    const markers = [];
    
    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        
        // Create popup content
        const popupContent = `
          <div class="map-popup">
            <h4>${story.name}</h4>
            <img src="${story.photoUrl}" alt="${story.name}'s story" width="100">
            <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
            <a href="#/story/${story.id}">View Details</a>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
      }
    });
    
    // Group markers and fit bounds if we have any
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
    
    return markers;
  }
  
  // Clean up map when no longer needed
  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }
  
  // Private method to load Leaflet dynamically
  async _loadLeaflet() {
    // Check if Leaflet is already loaded
    if (window.L) return;
    
    // Load CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(linkElement);
    
    // Load JS
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
  
  // Add tile layers to the map
  _addTileLayers() {
    // Default OSM layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    
    this.layers = {
      'OpenStreetMap': osmLayer
    };
    
    // Add additional layers if enabled
    if (this.options.additionalLayers) {
      // Satellite layer
      this.layers['Satellite'] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
      
      // Topo layer
      this.layers['Topographic'] = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
      
      // Dark layer
      this.layers['Dark'] = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      });
    }
  }
  
  // Add layer control
  _addLayerControl() {
    L.control.layers(this.layers).addTo(this.map);
  }
  
  // Setup click event for location selection
  _setupClickEvent() {
    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      // Add marker at clicked position
      this.addMarker(lat, lng);
      
      // Trigger custom event with coordinates
      const event = new CustomEvent('map:locationSelected', {
        detail: { lat, lng }
      });
      
      this.mapElement.dispatchEvent(event);
    });
  }
}

export default Map;