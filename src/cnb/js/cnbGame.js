let CNB_GRID_NUM = 9;
let CNB_GRID_SIZE = 80;


class CnbGame extends Game{
    constructor(){
        super();
        this.TICK_PER_SECOND = TICKS_PER_SECOND;

        this.grid = new CnbGrid(GRID_NUMBER, GRID_NUMBER);

        this.map = new MapReader("cnb/json/cnb-maps.json");
        this.currentLevel = 0; // 0 and 1
        this.maximumLevel = this.map.getMapLength();
        this.condition = [500, 500, 500, 500];//condition for go to next level

        this.robbers = new SpriteGroup();
        this.robbers.add(new Robber(1,1,CNB_GRID_SIZE, this.map.getMap(this.currentLevel)));

        this.cops = new SpriteGroup();
        this.cops.add(new Cop(7,1,CNB_GRID_SIZE, this.grid, this.map.getMap(this.currentLevel)));
        this.copsMove = false;

        addEventListener('keydown', event => this.onKeyDown(event));
        this.addContent('images', 'cnb/json/cnb-elements.json');

        this.canvas.width = CNB_GRID_NUM * CNB_GRID_SIZE;
        this.canvas.height = CNB_GRID_NUM * CNB_GRID_SIZE;

        this.spriteLayer.addDrawable(this.grid);
        this.spriteLayer.addDrawable(this.robbers);
        //this.spriteLayer.addDrawable(this.cops);//draw in grid

        this.scoreDisplay1 = new TextDisplay(GRID_SIZE, this.canvas.height -
            18 * 2, this.canvas.width - GRID_SIZE / 2);
        this.scoreDisplay1.fontSize = 14;
        this.scoreDisplay1.fontName = 'Courier';
        this.scoreDisplay1.fontColor = '#fff';
        this.scoreDisplay1.text = `Score : ${this.robbers.getSpriteByIndex(0).getScore()}`;
        this.overlayLayer.addDrawable(this.scoreDisplay1);

        this.highScoreDisplay = new TextDisplay(this.canvas.width /
            2, this.canvas.height -
            18 * 2, this.canvas.width / 2 - GRID_SIZE);
        this.highScoreDisplay.fontSize = 14;
        this.highScoreDisplay.fontName = 'Courier';
        this.highScoreDisplay.fontColor = '#fff';

        this.highScoreDisplay.text = `High Score: ${0}`;
        this.overlayLayer.addDrawable(this.highScoreDisplay);

        this.gameOver = new TextDisplay(GRID_SIZE * 2, GRID_SIZE * 2,
            this.canvas.width);
        this.gameOver.fontName = 'Courier';
        this.gameOver.fontSize = 32;
        this.gameOver.fontColor = '#fff';

        this.gameOver = new TextDisplay(GRID_SIZE * 2, GRID_SIZE * 2,
            this.canvas.width);
        this.gameOver.fontName = 'Courier';
        this.gameOver.fontSize = 32;
        this.gameOver.fontColor = '#fff';



        this.loadContent()
            .then(() => {
                this.buildMap();
                this.start();
            });
    }

    buildMap(){
            let m = this.map.getMap(this.currentLevel);
            //let tmpGrid = new Grid(CNB_GRID_NUM, CNB_GRID_NUM);
            for (let x = 0; x < m.length; x++){
                for (let y = 0; y < m[x].length; y++){
                    switch(m[x][y]){
                        case 1://walls
                            let random = Math.floor(Math.random() * 4);
                            this.grid.addWall(x, y, random);
                            break;
                        case 2://left
                            this.grid.addTile(x, y, 'left');
                            break;
                        case 3://up
                            this.grid.addTile(x, y, 'up');
                            break;
                        case 4://right
                            this.grid.addTile(x, y, 'right');
                            break;
                        case 5://down
                            this.grid.addTile(x, y, 'down');
                            break;
                        case 6://treasure
                            this.grid.addTile(x, y, 'treasure');
                            break;
                        default:
                            break;
                    }
                }
            }
    }

    loadContent() {
        return new Promise((resolve, reject) => {
            super.loadContent()
                .then(data => {
                    imageManager.addImage('cop', data['images'].cop);
                    imageManager.addImage('robber', data['images'].robber);
                    imageManager.addImage('wall-0', data['images'].walls[0]);
                    imageManager.addImage('wall-1', data['images'].walls[1]);
                    imageManager.addImage('wall-2', data['images'].walls[2]);
                    imageManager.addImage('wall-3', data['images'].walls[3]);
                    imageManager.addImage('treasure', data['images'].treasure);
                    imageManager.addImage('down', data['images'].down);
                    imageManager.addImage('left', data['images'].left);
                    imageManager.addImage('right', data['images'].right);
                    imageManager.addImage('up', data['images'].up);
                    resolve();
                });
        });
    }

    /**
     * Handles changing the snake's direction based on user input.
     */
    onKeyDown(event) {
        'use strict';
        switch (event.keyCode) {
            case 37: // Left
                this.robbers.getSpriteByIndex(0).direction = Direction.LEFT;
                this.copsMove = true;
                break;
            case 38: // Up
                this.robbers.getSpriteByIndex(0).direction = Direction.UP;
                this.copsMove = true;
                break;
            case 39: // Right
                this.robbers.getSpriteByIndex(0).direction = Direction.RIGHT;
                this.copsMove = true;
                break;
            case 40: // Down
                this.robbers.getSpriteByIndex(0).direction = Direction.DOWN;
                this.copsMove = true;
                break;
        }

    }

    update(){
        super.update();
        this.robbers.getSpriteByIndex(0).update( this.grid);
        if (this.robbers.getSpriteByIndex(0).gameOver){
            this.gameOver.text = 'Game Over';
            this.overlayLayer.addDrawable(this.gameOver);
        }
        else if (this.robbers.getSpriteByIndex(0).getScore() >= this.condition[this.currentLevel]
            && this.currentLevel < this.maximumLevel){
            this.nextLevel();
        }

        if (this.copsMove){
            for(let i = 0; i < this.cops.size(); i++){
                let cop = this.cops.getSpriteByIndex(i);
                cop.update();
            }
            this.copsMove = false;
        }

    }

    nextLevel(){
        this.grid.clear();
        this.robbers.clear();
        this.grid = new CnbGrid(GRID_NUMBER, GRID_NUMBER);

        this.currentLevel++;

        this.robbers = new SpriteGroup();
        this.robbers.add(new Robber(1,1,CNB_GRID_SIZE, this.map.getMap(this.currentLevel)));

        this.cops = new SpriteGroup();
        this.cops.add(new Cop(7,1,CNB_GRID_SIZE, this.grid, this.map.getMap(this.currentLevel)));

        this.spriteLayer.addDrawable(this.grid);
        this.spriteLayer.addDrawable(this.robbers);
        this.buildMap();

    }








}