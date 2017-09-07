/**
 * An element that can be made or combined.
 */
class GameElement {
  /**
   * Creates a game element.
   * @param id {string} The ID of the element.
   * @param name {string} The display name of the element.
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.imageSrc = null;
  }
}