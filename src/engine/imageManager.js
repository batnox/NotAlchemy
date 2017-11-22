/**
 * Manages the images to be used by the game
 */
class ImageManager {
  /**
   * Basic constructor of the ImageManager
   */
  constructor() {
    /**
     * The map of images to be used
     * @type {Map}
     */
    this.imageMap = new Map();
  }
  /**
   * Adds an image to the imageMap
   * @param key the index to set the image to
   * @param src The filepath of the source of the image
   * @returns {Promise}
   */
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
  /**
   * Adds a sprite sheet into the imageMap
   * @param keys the indexes to add the images to
   * @param size the number of sprites to add
   * @param src the filepath to the source of the sprite sheet
   * @returns {Promise}
   */
  addSpritesheet(keys, size, src) {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(Error('Invalid image source.'));
      }

      let image = new Image();
      image.onload = () => resolve();
      image.src = src;

      for (let i = 0; i < keys.length; i++) {
        this.imageMap.set(keys[i], {
          image: image,
          offset: i * size
        });
      }
    });
  }
  /**
   * Returns whether an image can have its offset increased or not based on its key value
   * @param key the key value to check in the imageMap
   * @returns {boolean}
   */
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
  /**
   * Returns an image based on a key in the imageMap
   * @param key
   * @returns {V}
   */
  getImage(key) {
    return this.imageMap.get(key);
  }

}

let imageManager = new ImageManager();
