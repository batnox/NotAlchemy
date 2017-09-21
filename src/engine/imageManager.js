class ImageManager {
  constructor() {
    this.imageMap = new Map();
  }

  addImage(key, src) {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(Error('Invalid image source.'));
      }

      let image = new Image();
      image.onload = () => resolve();
      image.src = src;
      this.imageMap.set(key, image);
    });
  }

  getImage(key) {
    return this.imageMap.get(key);
  }
}

let imageManager = new ImageManager();
