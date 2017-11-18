const BubbleType = Object.freeze({
  // BLUE: 'blue',
  // GREEN: 'green',
  // PURPLE: 'purple',
  // RED: 'red',
  // YELLOW: 'yellow',
  BATTY: 'batty',
  SKULL: 'skull',
  JACK: 'jack',
  CLOWN: 'clown'
});

class ColorType{
  constructor() {
      this.bubbleType = ['bubble-blue', 'bubble-green', 'bubble-purple', 'bubble-red', 'bubble-yellow'];
  }

    randomColor(){
        return this.bubbleType[Math.floor(Math.random()*this.bubbleType.length)];
    }
}

let colorType = new ColorType();
