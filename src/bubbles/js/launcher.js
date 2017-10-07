class Launcher extends Sprite{
    constructor(x, y){
        super();
        this.leftBound = -70;
        this.rightBound = 70;
        this.isShooting = false;
        this.x = x;
        this.y = y;
        this.radius = 200;
        this.degree = 60;
        this.rotation = this.toRadians(this.degree);
        this.bubbleX = this.x + Math.sin(this.rotation)* this.radius;
        this.bubbleY = this.y - Math.cos(this.rotation)* this.radius;
        console.log(this.bubbleX  + ", " + this.bubbleY );

        addEventListener('keydown', event => this.keyDown(event));

    }
    toRadians(degree){
        return degree * Math.PI / 180;
    }


    keyDown(event){
        switch(event.keyCode){
            case 37: // Left
                if (this.degree > this.leftBound) {
                    this.degree-=2;
                }
                break;
            case 39: // Right
                if (this.degree < this.rightBound ) {
                    this.degree+=2;
                }
                break;
            case 32: // space
                console.log("space detected");
                this.isShooting = true;
                break;
        }
        this.setRotation( this.toRadians(this.degree) );
        this.bubbleX = this.x + Math.sin(this.rotation)* this.radius;
        this.bubbleY = this.y - Math.cos(this.rotation)* this.radius;
    }

    draw(context){
        super.draw(context);
    }

}