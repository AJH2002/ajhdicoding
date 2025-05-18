class Camera {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.stream = null;
  }

  // Check if the browser supports getUserMedia
  static checkAvailability() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // Start the camera
  async start() {
    if (!Camera.checkAvailability()) {
      throw new Error('Camera API is not supported in this browser');
    }

    // Request camera access
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      this.videoElement.srcObject = this.stream;
      return new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          resolve(this.stream);
        };
      });
    } catch (error) {
      console.error('Error accessing the camera', error);
      throw error;
    }
  }

  // Take a picture from the video stream
  takePicture(canvasElement) {
    const context = canvasElement.getContext('2d');
    
    // Set canvas dimensions to match the video
    canvasElement.width = this.videoElement.videoWidth;
    canvasElement.height = this.videoElement.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(this.videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Convert the canvas to a blob
    return new Promise((resolve) => {
      canvasElement.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }

  // Stop the camera and clean up resources
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.videoElement.srcObject = null;
    }
  }
}

export default Camera;