let CNB_GRID_NUM = 10;
let CNB_GRID_SIZE = 50;


class CnbGame extends Game{
    constructor(){
        super();
        this.TICK_PER_SECOND = TICKS_PER_SECOND;


        this.grid = new CnbGrid(GRID_NUMBER, GRID_NUMBER);
        this.cops = new SpriteGroup();//TODO

        this.robber = new Robber();

        addEventListener('keydown', event => this.onKeyDown(event));
        this.addContent('images', 'cnb/json/cnb_elements.json');

        this.currentLevel = 0; // 0 and 1
        this.maximumLevel = 4;
        this.condition = [500, 1500, 3000, 5000];//condition for go to next level

        this.canvas.width = CNB_GRID_NUM * CNB_GRID_SIZE;
        this.canvas.height = CNB_GRID_NUM * CNB_GRID_SIZE;

        this.spriteLayer.addDrawable(this.grid);
        this.spriteLayer.addDrawable(this.cops);


        this.scoreDisplay1 = new TextDisplay(GRID_SIZE, this.canvas.height -
            18 * 2, this.canvas.width - GRID_SIZE / 2);
        this.scoreDisplay1.fontSize = 14;
        this.scoreDisplay1.fontName = 'Courier';
        this.scoreDisplay1.fontColor = '#fff';
        this.scoreDisplay1.text = `Score 1: ${this.worm1.getScore()}`;
        this.overlayLayer.addDrawable(this.scoreDisplay1);

        this.highScoreDisplay = new TextDisplay(this.canvas.width /
            2, this.canvas.height -
            18, this.canvas.width / 2 - GRID_SIZE);
        this.highScoreDisplay.fontSize = 14;
        this.highScoreDisplay.fontName = 'Courier';
        this.highScoreDisplay.fontColor = '#fff';


        let highScore = this.worm1.getScore();

        this.highScoreDisplay.text = `High Score: ${highScore}`;
        this.overlayLayer.addDrawable(this.highScoreDisplay);

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
        let tmpMap = new MapReader("cnb/json/cnb-maps.json");
        //this.level = [];

        for (let i = 0; i < tmpMap.getMapLength(); i++){
            let m = tmpMap.getMap(i);
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
                        default:
                            break;
                    }
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
                this.worm1.direction = Direction.LEFT;
                break;
            case 38: // Up
                this.worm1.direction = Direction.UP;
                break;
            case 39: // Right
                this.worm1.direction = Direction.RIGHT;
                break;
            case 40: // Down
                this.worm1.direction = Direction.DOWN;
                break;
        }

    }








}