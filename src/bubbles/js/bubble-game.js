class BubbleGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 30;
    this.addContent('images', 'bubbles/json/bubbles-config.json');

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.loadContent()
      .then(this.start());
  }

  loadContent() {
    return new Promise((resolve, reject) => {
      super.loadContent()
        .then(data => {
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