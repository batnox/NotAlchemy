class BubbleGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 30;
    this.addContent('images', 'bubbles/json/bubbles-config.json');

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.bubbles = new SpriteGroup();
    this.walls = new SpriteGroup();

    let redBubble = new Bubble(20, BubbleType.RED);
    redBubble.setPosition(100, 100);
    let wallLeft = new BubblesWall(0, 0, 20, this.canvas.height);
    let wallRight = new BubblesWall(this.canvas.width - 20, 0, 20, this.canvas.height);
    let wallTop = new BubblesWall(0, 0, this.canvas.width, 20);
    let wallBottom = new BubblesWall(0, this.canvas.height - 20, this.canvas.width, 20);

    this.bubbles.add(redBubble);
    this.walls.add(wallLeft);
    this.walls.add(wallRight);
    this.walls.add(wallTop);
    this.walls.add(wallBottom);

    this.spriteLayer.addDrawable(this.bubbles);
    this.spriteLayer.addDrawable(this.walls);
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
          resolve();
        });
    });
  }

  update() {
    super.update();
  }
}