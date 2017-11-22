/**
 * Reads out the maps of different game levels
 */
class MapReader{
    /**
     * Basic constructor of the mapReader
     * @param inputUrl the URL of the map
     */
    constructor(inputUrl){
        let json = jQuery.parseJSON(
            jQuery.ajax({
                url: inputUrl,
                async: false,
                dataType: 'json'
            }).responseText
        );
        /**
         * The data of the map layout
         */
        this.data = this.loadMap(json);
        //console.log(this.data);
    }

    /**
     * Returns a map at a certain index
     * @param index the index of the map to retrieve
     * @returns a map at a certain index
     */
    getMap(index){
        if (index < 0 || index > this.data.length)
            console.log("Error in mapSamples.getMap(index), index out of bounds");
        return this.data[index];
    }

    /**
     * Loads a map onto the game space
     * @param map the map to load onto the game space
     * @returns {Array} the array representation of the map
     */
    loadMap(map){
        let arr = [];

        for (let i of map.allMaps){
            let tmp = [[],[]];

            for (let x = 0; x < i.data[0].length; x++){
                tmp[x] = [];
                for (let y = 0; y < i.data.length; y++){
                    tmp[x][y] = i.data[y][x];//rotate 2d-array on JSON 90 degree
                }
            }
            arr.push(tmp);
        }
        return arr;
    }

    /**
     * Returns the number of maps inside the map reader
     * @returns {Number} the number of maps inside the map reader
     */
    getMapLength(){
        return this.data.length;
    }
}

/**
 * Sample set of maps
 * @type {MapReader}
 */
const sampleMaps = new MapReader("engine/map/generalMaps.json");
