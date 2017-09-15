class Level extends Game{
    constructor() {
        super();
        this.GRID_NUMBER = 40;
        this.GRID_SIZE = 10;
        this.currentLevel = 0;//0 and 1
        this.addContent('snake_elements', 'json/snake_elements.json');
        this.wallMaterial = [];
        //this.wallSprites = [];

        this.MAP1 =[];
        this.MAP2 = [];
        this.canvas.width = this.GRID_NUMBER* this.GRID_SIZE;
        this.canvas.height = this.GRID_NUMBER* this.GRID_SIZE;
        this.loadContent().then(()=>this.map());



    }

    drawWall() {
        let ctx = this.canvas.getContext('2d');
        this.canvas.width = this.GRID_NUMBER* this.GRID_SIZE;
        this.canvas.height = this.GRID_NUMBER* this.GRID_SIZE;
        for (let x = 0; x < this.GRID_NUMBER; x++) {
            for (let y = 0; y < this.GRID_NUMBER; y++) {
                if (this.currentLevel === 0) {
                    if (this.MAP1[x][y] === 1)
                        ctx.fillRect(x * this.GRID_SIZE, y * this.GRID_SIZE, this.GRID_SIZE, this.GRID_SIZE);
                }
                else{
                    if (this.MAP2[x][y] === 1)
                        ctx.fillRect(x * this.GRID_SIZE, y * this.GRID_SIZE, this.GRID_SIZE, this.GRID_SIZE);
                }
            }
        }
    }

    map(){
        //this.wallSprites.push( new SpriteGroup());
        for (let x = 0; x < this.GRID_NUMBER; x++) {
            this.MAP1[x] = [];
            for (let y = 0; y < this.GRID_NUMBER; y++) {
                if (x === 0 || y === 0 || x === this.GRID_NUMBER - 1 || y === this.GRID_NUMBER - 1) {
                    this.MAP1[x][y] = 1;
                    let s = Object.assign(Object.create(Object.getPrototypeOf(this.wallMaterial[0])), this.wallMaterial[0]);
                    s.setPosition(x*this.GRID_SIZE, y*this.GRID_SIZE);//error here
                    this.spriteLayer.addDrawable(s);
                    /*{
                        let tmpSprite = this.wallMaterial[0][Math.floor(Math.random() * 4)];
                        tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                        this.wallSprites[this.wallSprites.length - 1].add(tmpSprite);
                    }*/
                } else {
                    this.MAP1[x][y] = 0;
                }
            }
        }

        //this.MAP2 =[];
        //this.wallSprites.push( new SpriteGroup());
        for (let x = 0; x < this.GRID_NUMBER; x++) {
            this.MAP2[x] = [];
            for (let y = 0; y < this.GRID_NUMBER; y++) {
                if (x === 0 || y === 0 || x === (this.GRID_NUMBER - 1) || y === (this.GRID_NUMBER - 1)) {
                    this.MAP2[x][y] = 1;
                    /*{
                        let tmpSprite = this.wallMaterial[1][Math.floor(Math.random() * 4)];
                        tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                        this.wallSprites[this.wallSprites.length - 1].add(tmpSprite);
                    }*/
                } else if (x > Math.floor((this.GRID_NUMBER-1)/3) && x < Math.floor((this.GRID_NUMBER-1)*2/3) &&
                    y === Math.floor((this.GRID_NUMBER)/2)){
                    this.MAP2[x][y] = 1;
                    /*{
                        let tmpSprite = this.wallMaterial[1][Math.floor(Math.random() * 4)];
                        tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                        this.wallSprites[this.wallSprites.length - 1].add(tmpSprite);
                    }*/
                }
                else if (y > Math.floor((this.GRID_NUMBER-1)/3) && y < Math.floor((this.GRID_NUMBER-1)*2/3) &&
                    x === Math.floor((this.GRID_NUMBER)/2)){
                    this.MAP2[x][y] = 1;
                    /*{
                        let tmpSprite = this.wallMaterial[1][Math.floor(Math.random() * 4)];
                        tmpSprite.setPosition(x * this.GRID_SIZE, y * this.GRID_SIZE);
                        this.wallSprites[this.wallSprites.length - 1].add(tmpSprite);
                    }*/
                }
                else {
                    this.MAP2[x][y] = 0;
                }
            }
        }
/*
        let s = this.wallMaterial[0];
        console.log(JSON.stringify(this.wallMaterial));
        s.setSize(5, 5);//error here
        this.sprites.push(s);
        */
        this.draw();

        //this.drawWall();
    }

    draw(){
        super.draw();
    }

    loadContent() {
        return super.loadContent()
            .then(data => {
                for ( let i in data['snake_elements'].walls){
                    //this.wallMaterial[i] = [];
                    for (let j in  data['snake_elements'].walls[i].material) {
                        let tmp = new Sprite();
                        //console.log(data['snake_elements'].walls[i].material[j]);
                        tmp.setImage(data['snake_elements'].walls[i].material[j]);
                        tmp.setSize(this.GRID_SIZE, this.GRID_SIZE);
                        this.wallMaterial.push(tmp);
                        //console.log(JSON.stringify(this.wallMaterial));
                        //console.log(data['snake_elements'].walls[i].material[j]);
                        //this.wallMaterial[i][j] = new Sprite();
                        //this.wallMaterial[i][j].setImage(data['snake_elements'].walls[i].material[j]);
                        //this.wallMaterial[i][j].setSize(this.GRID_SIZE, this.GRID_SIZE);
                        //console.log(data['snake_elements'].walls[i].material[j]);
                    }
                }
            });
    }
}
