
// src/scripts/presenters/about-presenter.js
class AboutPresenter {
  constructor(view) {
    this.view = view;
  }
  
  init() {
    // Animate the sections
    this.view.animateSections();
  }
}

export default AboutPresenter;