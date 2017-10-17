class Launcher extends Sprite {
    constructor(x, y, grid) {
        super();
        this.bounds = new RectangleBounds();
        this.bounds.x = x;
        this.bounds.y = y;
        this.image = new ImageComponent();
        this.image.setImage('guide');
        this.image.bounds = this.bounds;

        this.grid = grid;
        this.state = LauncherState.EMPTY;
        this.loadedBubble = null;
        this.setLaunchRotation(0);
    }

    loadBubble(bubble) {
        this.loadedBubble = bubble;
        this.state = LauncherState.LOADED;
    }

    launch(mouse) {
        let dx = mouse.x - this.bounds.x - BUBBLE_RADIUS;
        let dy = mouse.y - this.bounds.y - BUBBLE_RADIUS;
        let angle = Math.atan2(dy, dx);
        this.loadedBubble.velocityX = BUBBLE_SPEED * Math.cos(angle);
        this.loadedBubble.velocityY = BUBBLE_SPEED * Math.sin(angle);
        this.state = LauncherState.FIRED;
    }

    setLaunchRotation(degree) {
        // this.bubbleX = this.bounds.x - BUBBLE_RADIUS + Math.sin(this.toRadians(degree)) *
        //   this.RADIUS;
        // this.bubbleY = this.bounds.y - BUBBLE_RADIUS - Math.cos(this.toRadians(degree)) *
        //   this.RADIUS;

        // if (this.state === LauncherState.LOADED && this.loadedBubble) {
        //   this.loadedBubble.setPosition(this.bubbleX, this.bubbleY);
        // }
    }

    draw(context) {
        super.draw(context);
        if (this.loadedBubble) {
            this.loadedBubble.draw(context);
        }
    }

    update() {
        switch (this.state) {
            case LauncherState.EMPTY:
                let types = Object.values(BubbleType);
                let index = Math.floor(Math.random() * types.length);
                let color = types[index];
                let randomBubble = new Bubble(
                    this.bounds.x, this.bounds.y,
                    BUBBLE_RADIUS, color,
                    this.grid
                );
                this.loadBubble(randomBubble);
                break;
            case LauncherState.LOADED:
                // this.loadedBubble.setPosition(this.bubbleX, this.bubbleY);
                break;
            case LauncherState.FIRED:
                this.loadedBubble.update();
                this.checkCollision();
                break;
        }
    }

    checkCollision() {
        if (this.loadedBubble.bounds.y < 0) {
            this.grid.alignBubble(this.loadedBubble);
            this.loadedBubble = null;
            this.state = LauncherState.EMPTY;
            return;
        }

        for (let row of this.grid.bubbles) {
            for (let b of row) {
                if (b) {
                    let dx = this.loadedBubble.bounds.x - b.bounds.x;
                    let dy = this.loadedBubble.bounds.y - b.bounds.y;
                    let dis = dy ** 2 + dx ** 2;
                    if (dis <= (BUBBLE_RADIUS * 2) ** 2) {
                        this.grid.alignBubble(this.loadedBubble);
                        this.loadedBubble = null;
                        this.state = LauncherState.EMPTY;
                        return;
                    }
                }
            }
        }
    }

}