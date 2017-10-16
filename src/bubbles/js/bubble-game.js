    let BUBBLE_RADIUS = 20;

class BubbleGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 100;
    this.addContent('images', 'bubbles/json/bubbles-config.json');
    this.canvas.width = 800;
    this.canvas.height = 800;

    this.bubbles = new BubbleGrid(
      Math.floor(this.canvas.width / (BUBBLE_RADIUS * 2)),
      Math.floor(this.canvas.height / (BUBBLE_RADIUS * 2))
    );

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 7; y++) {
        let bubble = new Bubble(
          0, 0,
          BUBBLE_RADIUS, BubbleType.RED
        );
        this.bubbles.addBubble(x, y, bubble);
      }
    }

    this.spriteLayer.addDrawable(this.bubbles);

    this.launcher = new Launcher(this.canvas.width / 2, this.canvas.height);
    this.spriteLayer.addDrawable(this.launcher);
    this.spriteLayer.addDrawable(this.bubbles);

    addEventListener('keydown', event => this.keyDown(event));

    this.loadContent()
      .then(this.start());
  }

  loadContent() {
    return new Promise((resolve, reject) => {
      super.loadContent()
        .then(data => {
          imageManager.addImage('stone-wall', data['images'].walls.stone);
          imageManager.addImage('bubble-blue', data['images'].bubbles.blue);
          imageManager.addImage('bubble-green', data['images'].bubbles.green);
          imageManager.addImage('bubble-purple', data['images'].bubbles.purple);
          imageManager.addImage('bubble-red', data['images'].bubbles.red);
          imageManager.addImage('bubble-yellow', data['images'].bubbles.yellow);
          imageManager.addImage('guide', data['images'].guide);
          imageManager.addSpritesheet(
            ['batty', 'batty-1', 'batty-2', 'batty-3', 'batty-4'],
            64,
            'bubbles/assets/SpriteSheetBatty.png'
          );
          resolve();
        });
    });
  }

  update() {
    super.update();
    this.launcher.update();
  }

  keyDown(event) {
    switch (event.keyCode) {
      case 37: // Left
        this.launcher.turnLeft();
        break;
      case 39: // Right
        this.launcher.turnRight();
        break;
      case 32: // Space
        this.launcher.launch();
        break;
      default:
        break;
    }
  }

  // bubbleCollision() {
  //   let isCollide = false;
  //   if (this.bubbles.size() > 0) {
  //     for (let i in this.bubbles.sprites) {
  //       let eachBubble = this.bubbles.getSpriteByIndex(i);
  //       let dx = this.current.bounds.x - eachBubble.bounds.x;
  //       let dy = this.current.bounds.y - eachBubble.bounds.y;
  //       let dis = dy ** 2 + dx ** 2;
  //       if (dis <= (BUBBLE_RADIUS * 2) ** 2) {
  //         console.log('COLLIDE');
  //         this.current.neighbors.push(i);
  //         isCollide = true;
  //       }
  //     }
  //   }
  //   return isCollide;
  // }
}