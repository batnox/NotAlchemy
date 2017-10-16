class BubbleGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 100;
    this.addContent('images', 'bubbles/json/bubbles-config.json');
    this.canvas.width = 800;
    this.canvas.height = 800;
    this.bubbleR = 20;

    this.bubbles = new BubbleGrid(
      Math.floor(this.canvas.width / (this.bubbleR * 2)),
      Math.floor(this.canvas.height / (this.bubbleR * 2))
    );

    this.walls = new SpriteGroup();
    let wallLeft = new BubblesWall(0, 0, 20, this.canvas.height);
    let wallRight = new BubblesWall(this.canvas.width - 20, 0, 20, this.canvas.height);
    let wallTop = new BubblesWall(0, 0, this.canvas.width, 20);
    let wallBottom = new BubblesWall(0, this.canvas.height - 20, this.canvas.width, 20);
    this.walls.add(wallLeft);
    this.walls.add(wallRight);
    this.walls.add(wallTop);
    this.walls.add(wallBottom);

    this.spriteLayer.addDrawable(this.bubbles);
    this.spriteLayer.addDrawable(this.walls);
    this.loadContent()
      .then(this.start());

    this.bubbleLevel = new Level(Math.floor(this.canvas.width / (this.bubbleR * 2)),
        Math.floor(this.canvas.height / (this.bubbleR * 2)), this.bubbleR);
    this.spriteLayer.addDrawable(this.bubbleLevel.level[1]);

    this.launcher = new Launcher(this.canvas.width/2, this.canvas.height);
    this.launcher.image.setImage('guide');

    this.current = new Bubble(this.launcher.bubbleX, this.launcher.bubbleY, this.bubbleR, colorType.randomColor());
    this.bubbleGroup = new SpriteGroup();

    this.spriteLayer.addDrawable(this.launcher);
    this.spriteLayer.addDrawable(this.current);
    this.spriteLayer.addDrawable(this.bubbleGroup);

    this.explosionTest = new Bubble(200, 200, this.bubbleR, BubbleType.BATTY);
    this.spriteLayer.addDrawable(this.explosionTest);
    this.explosionTest.doExplosion();


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
            "bubbles/assets/SpriteSheetBatty.png"
          );
          resolve();
        });
    });
  }

  update() {
    super.update();

    this.explosionTest.update();

    if (this.launcher.isShooting){

        if (this.current.velocityX ===0 && this.current.velocityY===0) {
            this.current.velocityX = (this.launcher.bubbleX-this.launcher.bounds.x)/80;
            this.current.velocityY = (this.launcher.bubbleY-this.launcher.bounds.y)/80;
        }
        this.current.move();
        if (this.bubbleCollision() || this.current.bounds.y-this.bubbleR < 0){
            this.current.setStayPosition();
            this.bubbleGroup.add(this.current);
            this.current = new Bubble(this.launcher.bubbleX, this.launcher.bubbleY, this.bubbleR, colorType.randomColor());
            this.spriteLayer.addDrawable(this.current);
            this.launcher.isShooting = false;
        }
    }
    else{
        this.current.setPosition(this.launcher.bubbleX, this.launcher.bubbleY);
    }

  }

  bubbleCollision(){
      let isCollide = false;
      if(this.bubbleGroup.size() > 0){
          for (let i in this.bubbleGroup.sprites){
              let eachBubble = this.bubbleGroup.getSpriteByIndex(i);
              let dx = this.current.bounds.x - eachBubble.bounds.x;
              let dy = this.current.bounds.y - eachBubble.bounds.y;
              let dis = dy**2 + dx**2;
              if (dis <= (this.bubbleR*2)**2){
                  console.log("COLLIDE");
                  this.current.neighbors.push(i);
                  isCollide = true;
              }
          }
      }
      return isCollide;
  }


}