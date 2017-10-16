let BUBBLE_RADIUS = 20;
let BUBBLE_MATCH_COUNT = 3;
let BUBBLE_SCORE = 0;
let BUBBLE_EXPLOSION_SCORE = 100;

class BubbleGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 100;
    this.addContent('images', 'bubbles/json/bubbles-config.json');
    this.canvas.width = 800;
    this.canvas.height = 800;

    this.grid = new BubbleGrid(
      Math.floor(this.canvas.width / (BUBBLE_RADIUS * 2)),
      Math.floor(this.canvas.height / (BUBBLE_RADIUS * 2))
    );

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height - 3; y++) {
        let types = Object.values(BubbleType);
        let index = Math.floor(Math.random() * types.length);
        let color = types[index];
        let randomBubble = new Bubble(
          0, 0,
          BUBBLE_RADIUS, color,
          this.grid
        );
        this.grid.addBubble(x, y, randomBubble, true);
      }
    }

    this.spriteLayer.addDrawable(this.grid);
    this.launcher = new Launcher(this.canvas.width / 2, this.canvas.height, this.grid);
    this.spriteLayer.addDrawable(this.launcher);

    this.scoreDisplay = new TextDisplay(
      BUBBLE_RADIUS, this.canvas.height - 18,
      this.canvas.width - BUBBLE_RADIUS / 2
    );
    this.scoreDisplay.fontSize = 14;
    this.scoreDisplay.fontName = 'Courier';
    this.scoreDisplay.fontColor = '#fff';
    this.scoreDisplay.text = `Score: ${BUBBLE_SCORE}`;
    this.overlayLayer.addDrawable(this.scoreDisplay);

    addEventListener('keydown', event => this.keyDown(event));
    addEventListener('mousedown', event => this.mouseDown(event));

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
          imageManager.addSpritesheet(
            ['skull', 'skull-1', 'skull-2', 'skull-3', 'skull-4'],
            64,
            'bubbles/assets/SpriteSheetSkull.png'
          );
          imageManager.addSpritesheet(
            ['jack', 'jack-1', 'jack-2', 'jack-3', 'jack-4'],
            64,
            'bubbles/assets/SpriteSheetJack.png'
          );
          imageManager.addSpritesheet(
            ['clown', 'clown-1', 'clown-2', 'clown-3', 'clown-4'],
            64,
            'bubbles/assets/SpriteSheetClown.png'
          );
          resolve();
        });
    });
  }

  update() {
    super.update();
    this.scoreDisplay.text = `Score: ${BUBBLE_SCORE}`;
    let dx = this.launcher.bounds.x - this.mouse.x;
    let dy = this.launcher.bounds.y - this.mouse.y;
    let angle = Math.atan2(dy, dx);
    this.launcher.setLaunchRotation(angle / Math.PI * 180 - 90);
    this.launcher.update();
    this.grid.update();
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

  mouseDown(event) {
    this.launcher.launch();
  }
}
