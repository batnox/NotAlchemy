const BubbleType = Object.freeze({
  BLUE:    Symbol('blue'),
  GREEN:  Symbol('green'),
  PURPLE:  Symbol('purple'),
  RED: Symbol('red'),
  YELLOW: Symbol('yellow'),
  BATTY: Symbol('batty')

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
