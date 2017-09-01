/**
 * All possible elements.
 * @type {GameElement[]}
 */
var elements = [];

/**
 * All known elements.
 * @type {GameElement[]}
 */
var knownElements = [];

/**
 * All combinations of elements.
 * @type {Combination[]}
 */
var combinations = [];

/**
 * Returns the element with the given ID.
 * @param id {string} The ID to match.
 * @returns {GameElement} The corresponding element or <code>null</code> if none match.
 */
function getElement(id) {
  'use strict';
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
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
function combine(element1, element2) {
  'use strict';
  for (var i = 0; i < combinations.length; i++) {
    var combination = combinations[i];
    var forwardMatch = element1 === combination.element1
      && element2 === combination.element2;
    var backwardMatch = element2 === combination.element1
      && element1 === combination.element2;

    if (forwardMatch || backwardMatch) {
      if (knownElements.indexOf(combination.result) === -1) {
        knownElements.push(combination.result);
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
function loadContent() {
  'use strict';
  return loadElements()
    .then(loadImages)
    .then(loadKnownElements)
    .then(loadCombinations);
}

/**
 * Loads all elements and adds them to the array.
 * @returns {*} A promise.
 */
function loadElements() {
  'use strict';
  return $.getJSON('json/elements.json', function(data) {
    data.elements.forEach(function(element) {
      elements.push(element);
    });
  });
}

/**
 * Loads all images. Goes through each element and gets the image
 * associated with its ID.
 * @returns {*} A promise.
 */
function loadImages() {
  'use strict';
  return $.getJSON('json/alchemy-icons.json')
    .then(function(data) {
      elements.forEach(function(element) {
        element.imageSrc = 'data:image/png;base64,' + data[element.id];
      });
    });
}

/**
 * Loads all known elements and adds them to the array.
 * @returns {*} A promise.
 */
function loadKnownElements() {
  'use strict';
  return $.getJSON('json/known-elements.json', function(data) {
    data.elements.forEach(function(elementID) {
      knownElements.push(getElement(elementID));
    });
  });
}

/**
 * Loads all combinations, converts IDs to the element objects, and adds the combinations to the array.
 * @returns {*} A promise.
 */
function loadCombinations() {
  'use strict';
  return $.getJSON('json/combinations.json', function(data) {
    data.combinations.forEach(function(combination) {
      var e1 = getElement(combination.element1);
      var e2 = getElement(combination.element2);
      var result = getElement(combination.result);
      combinations.push(new Combination(e1, e2, result));
    });
  });
}