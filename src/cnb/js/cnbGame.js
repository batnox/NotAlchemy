let CNB_GRID_NUM = 9;
let CNB_GRID_SIZE = 80;


class CnbGame extends Game{
    constructor(){
        super();
        this.TICK_PER_SECOND = TICKS_PER_SECOND;


        this.grid = new CnbGrid(GRID_NUMBER, GRID_NUMBER);

        this.cops = new SpriteGroup();
        this.cops.add(new Cop(7,1,CNB_GRID_SIZE, this.grid));

        this.robbers = new SpriteGroup();
        this.robbers.add(new Robber(1,1,CNB_GRID_SIZE));
        this.key = Direction.STAY;

        addEventListener('keydown', event => this.onKeyDown(event));
        this.addContent('images', 'cnb/json/cnb-elements.json');

        this.map = new MapReader("cnb/json/cnb-maps.json");
        this.currentLevel = 4; // 0 and 1
        this.maximumLevel = this.map.getMapLength();
        this.condition = [500, 1500, 3000, 5000];//condition for go to next level

        this.canvas.width = CNB_GRID_NUM * CNB_GRID_SIZE;
        this.canvas.height = CNB_GRID_NUM * CNB_GRID_SIZE;

        this.spriteLayer.addDrawable(this.grid);
        //this.spriteLayer.addDrawable(this.cops);//draw in grid
        this.spriteLayer.addDrawable(this.robbers);

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
        //let tmpMap = new MapReader("cnb/json/cnb-maps.json");
        //this.level = [];

        //for (let i = 0; i < tmpMap.getMapLength(); i++){
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


        //}
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
                break;
            case 38: // Up
                this.robbers.getSpriteByIndex(0).direction = Direction.UP;
                break;
            case 39: // Right
                this.robbers.getSpriteByIndex(0).direction = Direction.RIGHT;
                break;
            case 40: // Down
                this.robbers.getSpriteByIndex(0).direction = Direction.DOWN;
                break;
        }

    }

    update(){
        super.update();
        this.robbers.getSpriteByIndex(0).update(this.map.getMap(this.currentLevel), this.grid);
        if (this.robbers.getSpriteByIndex(0).gameOver){
            this.gameOver.text = 'Game Over';
            this.overlayLayer.addDrawable(this.gameOver);
        }

    }


    Astar(startx, starty, destx, desty, pathlength, nextTileToMove){
        let open = [];
        let closed = [];
        for(let i=0; i<this.grid.width; i++){
            for(let j=0; j<this.grid.height; j++){
                closed[i][j]=false;
                this.grid.getTile(i,j).heuristicCost = 0;
                this.grid.getTile(i,j).finalCost = 0;
                this.grid.getTile(i,j).parent = null;
            }
        }

        open.push(this.grid.getTile(startx, starty));

        let current;
        let temp;
        while(true){
            current = open.shift();
            if(current == null){
                break;
            }
            closed[current.x][current.y] = true;
            if(current == this.grid.getTile(destx, desty)){
                break;
            }

            let tempneighbour = this.robbers.getSpriteByIndex(0).getNeighbor(current.x, current.y, this.map.getMap(this.currentLevel), this.grid);
            for(let i=0; i<tempneighbour.length; i++){
                this.updateCost(current, tempneighbour[i], current.finalCost+1, open, closed, destx, desty);
            }


        }

        let tempPathLength=0;
        let pathCurrent;

        if(closed[destx][desty]){
            //Trace back the path
            //System.out.println("Path: ");
            pathCurrent = this.grid.getTile(destx, desty);
            // System.out.print(current);
            tempPathLength += 1;
            while(pathCurrenturrent.parent!=null){
                tempPathLength += 1;
                if(pathCurrent.parent() === this.grid.getTile(startx, starty)){
                    nextTileToMove = pathCurrent;
                }
                pathCurrent = pathCurrent.parent;
            }

        }

        pathlength = tempPathLength;


    }

    computeHeuristicCost(x, y, destx, desty){
        return Math.abs(destx - x) + Math.abs(desty - y);
    }


    updateCost(currentTile, tempTile, cost, open, closed, destx, desty){
        if(closed[tempTile.x][tempTile.y]){
            return;
        }

        tempTile.heuristicCost = this.computeHeuristicCost(tempTile.x, tempTile.y, destx, desty);
        let temp_final_cost = tempTile.heuristicCost+cost;
        let inOpen = open.includes(t);
        if(!inOpen || temp_final_cost<tempTile.finalCost){
            tempTile.finalCost = t_final_cost;
            tempTile.parent = currentTile;
            if(!inOpen)open.add(tempTile);
        }
    }




}