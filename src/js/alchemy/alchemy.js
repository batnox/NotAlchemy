/**
 * This manages information on known elements, unknown elements, and their combinations.
 */
class Alchemy {
  /**
   * Creates an instance of alchemy information.
   */
  constructor() {
    /**
     * All possible elements.
     * @type {GameElement[]}
     */
    this.elements = [];

    /**
     * All known elements.
     * @type {GameElement[]}
     */
    this.knownElements = [];

    /**
     * All combinations of elements.
     * @type {Combination[]}
     */
    this.combinations = [];
  }

  /**
   * Returns the element with the given ID.
   * @param id {string} The ID to match.
   * @returns {GameElement} The corresponding element or <code>null</code> if none match.
   */
  getElement(id) {
    for (let i = 0; i < this.elements.length; i++) {
      let element = this.elements[i];
      if (element.id === id) {
        return element;
      }
    }
    return null;
  }

  isKnown(id) {
    for (let element of this.knownElements) {
      if (id === element.id) {
        return true;
      }
    }
    return false;
  }

  /**
   * Combines the two given elements and returns the resulting element. Order is ignored.
   * @param element1 {GameElement} The first element in the combination.
   * @param element2 {GameElement} The second element in the combination.
   * @returns {GameElement} The resulting element or <code>null</code> if the two elements cannot be combined.
   */
  combine(element1, element2) {
    for (let i = 0; i < this.combinations.length; i++) {
      let combination = this.combinations[i];
      let forwardMatch = element1.id === combination.element1
        && element2.id === combination.element2;
      let backwardMatch = element2.id === combination.element1
        && element1.id === combination.element2;

      if (forwardMatch || backwardMatch) {
        let res = this.getElement(combination.result);
        if (!this.isKnown(combination.result)) {
          this.knownElements.push(Object.assign(Object.create(Object.getPrototypeOf(res)), res));
        }
        return Object.assign(Object.create(Object.getPrototypeOf(res)), res);
      }
    }
    return null;
  }

  /**
   * Loads all content.
   * @returns {*} A promise.
   */
  loadContent() {
    return this.loadElements()
      .then(() => this.loadImages())
      .then(() => this.loadKnownElements())
      .then(() => this.loadCombinations());
  }

  /**
   * Loads all elements and adds them to the array.
   * @returns {*} A promise.
   */
  loadElements() {
    return $.getJSON('json/elements.json').then((data) => {
      data.elements.forEach((element) => {
        this.elements.push(new GameElement(element.id, element.name));
      });
    });
  }

  /**
   * Loads all images. Goes through each element and gets the image
   * associated with its ID.
   * @returns {*} A promise.
   */
  loadImages() {
    return $.getJSON('json/alchemy-icons.json').then((data) => {
      for (let element of this.elements) {
        element.setImage('data:image/png;base64,' + data[element.id]);
      }
    });
  }

  /**
   * Loads all known elements and adds them to the array.
   * @returns {*} A promise.
   */
  loadKnownElements() {
    return $.getJSON('json/known-elements.json').then((data) => {
      for (let elementID of data.elements) {
        this.knownElements.push(this.getElement(elementID));
      }
    });
  }

  /**
   * Loads all combinations, converts IDs to the element objects, and adds the combinations to the array.
   * @returns {*} A promise.
   */
  loadCombinations() {
    return $.getJSON('json/combinations.json').then((data) => {
      for (let combination of data.combinations) {
        this.combinations.push(
          new Combination(
            combination.element1,
            combination.element2,
            combination.result
          )
        );
      }
    });
  }
}