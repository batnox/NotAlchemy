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
      this.imageMap.set(key, {
        image: image,
        offset: 0,
      });
    });
  }

  canOffsetIncrease(key){
      let image = this.imageMap.get(key).image;

      let split = Math.floor(image.width/image.height);
      if (this.imageMap.get(key).offset < split-1){
          this.imageMap.get(key).offset+=0.05;//adjust animation speed
        return true;
      }
      else { this.imageMap.get(key).offset = 0; }//just for test
      return false;

  }


  getImage(key) {
    return this.imageMap.get(key);
  }

}

let imageManager = new ImageManager();
