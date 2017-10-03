/**
 * An element that can be made or combined.
 */
class GameElement extends Sprite {
  /**
   * Creates a game element.
   * @param id {string} The ID of the element.
   * @param name {string} The display name of the element.
   */
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;

    this.bounds = new BoundsComponent();
    this.image = new ImageComponent();
    this.image.bounds = this.bounds;
    this.image.name = this.id;
  }
}