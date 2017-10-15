class LineStuff{
    cunstructor(){}

    xOnLine(x0, y0, m, y) {
        return (x0 + m * (y - y0));
    }

    yOnLine(x0, y0, m, x) {
        return (y0 + (1 / m) * (x - x0));
    }

    getTilesOnLine(x0, y0, theta, grid) {
        var initialTile = grid.getTileByPoints(x0, y0);
        var tracequeue = [];
        var ansqueue = [];
        tracequeue.push(initialTile);
        initialTile.mark();
        var curTile;
        var limits; //= grid.getTileBoundaries(curtile);
        var temptile;

        if(theta === 90 || theta === 270){
            var tempx = initialTile.xIndex;
            for(var i=0; i<n; i++) {
                ansqueue.push(tempx, i);
            }
        }

        else if(theta === 0 || theta === 180){
            var tempy = initialTile.yIndex;
            for(var i=0; i<n; i++) {
                ansqueue.push(i, tempy);
            }
        }
        else {
            var m = math.tan(theta);

            while (tracequeue.length > 0) {
                curTile = tracequeue.shift();
                ansqueue.push(curTile);
                // curTile.mark();
                limits = grid.getTileBoundaries(curTile);
                var xlower = limits[0];
                var xupper = limits[1];
                var ylower = limits[2];
                var yupper = limits[3];

                var tempy = yOnLine(x0, y0, m, xlower);
                if (tempy < yupper && tempy > ylower && curTile.xIndex - 1 > 0) {
                    temptile = grid.getTileByIndex(curTile.xIndex - 1, curTile.yIndex);
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }
                else if (tempy === yupper && curTile.xIndex - 1 > 0 && curTile.yIndex < grid.getYDimension) {
                    temptile = grid.getTileByIndex(curTile.xIndex - 1, curTile.yIndex + 1);
                    // tracequeue.push(grid.getTileByIndex(curTile.xIndex - 1,curTile.yIndex + 1));
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }
                else if (tempy === ylower && curTile.xIndex - 1 > 0 && curTile.yIndex > 0) {
                    temptile = grid.getTileByIndex(curTile.xIndex - 1, curTile.yIndex - 1);
                    // tracequeue.push(grid.getTileByIndex(curTile.xIndex - 1,curTile.yIndex - 1));
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }

                tempy = yOnLine(x0, y0, m, xupper);
                if (tempy < yupper && tempy > ylower && curTile.xIndex + 1 < grid.getXDimension) {
                    temptile = grid.getTileByIndex(curTile.xIndex + 1, curTile.yIndex);
                    // tracequeue.push(grid.getTileByIndex(curTile.xIndex + 1,curTile.yIndex));
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }
                else if (tempy === yupper && curTile.xIndex + 1 < grid.getXDimension && curTile.yIndex < grid.getYDimension) {
                    temptile = grid.getTileByIndex(curTile.xIndex + 1, curTile.yIndex + 1);
                    // tracequeue.push(grid.getTileByIndex(curTile.xIndex + 1,curTile.yIndex + 1));
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }
                else if (tempy === ylower && curTile.xIndex + 1 > grid.getXDimension && curTile.yIndex > 0) {
                    temptile = grid.getTileByIndex(curTile.xIndex + 1, curTile.yIndex - 1);
                    // tracequeue.push(grid.getTileByIndex(curTile.xIndex + 1,curTile.yIndex - 1));
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }

                var tempx = xOnLine(x0, y0, m, ylower);
                if (tempy < xupper && tempy > xlower && curTile.yIndex - 1 > 0) {
                    temptile = grid.getTileByIndex(curTile.xIndex, curTile.yIndex - 1);
                    // tracequeue.push(grid.getTileByIndex(curTile.xIndex ,curTile.yIndex - 1));
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }

                var tempx = xOnLine(x0, y0, m, yupper);
                if (tempy < xupper && tempy > xlower && curTile.yIndex + 1 < grid.getXDimension) {
                    temptile = grid.getTileByIndex(curTile.xIndex, curTile.yIndex + 1);
                    // tracequeue.push(grid.getTileByIndex(curTile.xIndex ,curTile.yIndex + 1));
                    if (!temptile.isMarked()) {
                        temptile.mark();
                        tracequeue.push(temptile);
                    }
                }


            }
        }

        for (var i = 0; i < ansqueue.length; i++) {
            ansqueue[i].unmark();
        }

        return ansqueue;
    }

}