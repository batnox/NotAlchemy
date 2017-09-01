/**
 * @type {GameElement[]}
 * @description All elements
 */
var elements = [];

/**
 * @type {GameElement[]}
 * @description All known elements
 */
var knownElements = [];

/**
 * @type {Combination[]}
 */
var combinations = [];

function getElement(id) {
  'use strict';
  console.log(JSON.stringify(elements));
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.id === id) {
      return element;
    }
  }
  return null;
}

function combine(element1, element2) {
  'use strict';
  console.log(JSON.stringify(combinations));
  for (var i = 0; i < combinations.length; i++) {
    var combination = combinations[i];
    var forwardMatch = element1 === combination.element1
      && element2 === combination.element2;
    var backwardMatch = element2 === combination.element1
      && element1 === combination.element2;
    console.log(element1.id + ',' + element2.id);
    console.log(combination.element1.id + ',' + combination.element2.id);
    console.log(forwardMatch);
    console.log(backwardMatch);
    if (forwardMatch || backwardMatch) {
      knownElements.push(combination.result);
      return combination.result;
    }
  }
  return null;
}

function loadContent() {
  'use strict';
  return loadElements()
    .then(loadImages)
    .then(loadKnownElements)
    .then(loadCombinations);
}

function loadImages() {
  'use strict';
  console.log('Loading images...');
  return $.getJSON('json/alchemy-icons.json')
    .then(function(data) {
      elements.forEach(function(element) {
        element.imageSrc = 'data:image/png;base64,' + data[element.id];
      });
    });
}

function loadElements() {
  'use strict';
  console.log('Loading elements...');
  return $.getJSON('json/elements.json', function(data) {
    data.elements.forEach(function(element) {
      elements.push(element);
    });
  });
}

function loadKnownElements() {
  'use strict';
  console.log('Loading known elements...');
  return $.getJSON('json/known-elements.json', function(data) {
    data.elements.forEach(function(elementID) {
      knownElements.push(getElement(elementID));
    });
  });
}

function loadCombinations() {
  'use strict';
  console.log('Loading combinations...');
  return $.getJSON('json/combinations.json', function(data) {
    data.combinations.forEach(function(combination) {
      var e1 = getElement(combination.element1);
      var e2 = getElement(combination.element2);
      var result = getElement(combination.result);
      combinations.push(new Combination(e1, e2, result));
    });
  });
}