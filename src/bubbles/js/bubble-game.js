class BubbleGame extends Game {
  constructor() {
    super();
    this.TICK_PER_SECOND = 100;
    this.addContent('images', 'bubbles/json/bubbles-config.json');
    this.canvas.width = 800;
    this.canvas.height = 800;
    this.bubbleR = 20;

    this.loadContent()
      .then(this.start());

    this.launcher = new Launcher(this.canvas.width/2, this.canvas.height);
    this.launcher.setImage(imageManager.getImage('guide'));
    console.log(imageManager.getImage('guide'));
    console.log(this.launcher.image);


    this.current = new Bubble(this.launcher.bubbleX, this.launcher.bubbleY, this.bubbleR, BubbleType.YELLOW);
    this.bubbleGroup = new SpriteGroup();

    this.spriteLayer.addDrawable(this.launcher);
    this.spriteLayer.addDrawable(this.current);
    this.spriteLayer.addDrawable(this.bubbleGroup);

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
    if (this.launcher.isShooting){

        if (this.current.velocityX ===0 && this.current.velocityY===0) {
            this.current.velocityX = (this.launcher.bubbleX-this.launcher.x)/80;
            this.current.velocityY = (this.launcher.bubbleY-this.launcher.y)/80;
        }
        this.current.move();
        if (this.bubbleCollision() || this.current.y < 0){
            this.current.setStayPosition();
            this.bubbleGroup.add(this.current);
            //this.current.resetVelocity();
            //this.current.setPosition(this.launcher.bubbleX, this.launcher.bubbleY);
            this.current = new Bubble(this.launcher.bubbleX, this.launcher.bubbleY, this.bubbleR, BubbleType.BLUE);
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
              let dx = this.current.x - eachBubble.x;
              let dy = this.current.y - eachBubble.y;
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