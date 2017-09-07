class Alchemy {
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

  /**
   * Combines the two given elements and returns the resulting element. Order is ignored.
   * @param element1 {GameElement} The first element in the combination.
   * @param element2 {GameElement} The second element in the combination.
   * @returns {GameElement} The resulting element or <code>null</code> if the two elements cannot be combined.
   */
  combine(element1, element2) {
    for (let i = 0; i < this.combinations.length; i++) {
      let combination = this.combinations[i];
      let forwardMatch = element1 === combination.element1
        && element2 === combination.element2;
      let backwardMatch = element2 === combination.element1
        && element1 === combination.element2;

      if (forwardMatch || backwardMatch) {
        if (this.knownElements.indexOf(combination.result) === -1) {
          this.knownElements.push(combination.result);
        }
        return combination.result;
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
        this.elements.push(element);
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
      this.elements.forEach((element) => {
        element.imageSrc = 'data:image/png;base64,' + data[element.id];
      });
    });
  }

  /**
   * Loads all known elements and adds them to the array.
   * @returns {*} A promise.
   */
  loadKnownElements() {
    return $.getJSON('json/known-elements.json').then((data) => {
      data.elements.forEach((elementID) => {
        this.knownElements.push(this.getElement(elementID));
      });
    });
  }

  /**
   * Loads all combinations, converts IDs to the element objects, and adds the combinations to the array.
   * @returns {*} A promise.
   */
  loadCombinations() {
    return $.getJSON('json/combinations.json').then((data) => {
      data.combinations.forEach((combination) => {
        let e1 = this.getElement(combination.element1);
        let e2 = this.getElement(combination.element2);
        let result = this.getElement(combination.result);
        this.combinations.push(new Combination(e1, e2, result));
      });
    });
  }
}