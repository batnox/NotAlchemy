class MapReader{
    constructor(inputUrl){
        let json = jQuery.parseJSON(
            jQuery.ajax({
                url: inputUrl,
                async: false,
                dataType: 'json'
            }).responseText
        );

        this.data = this.loadMap(json);
        //console.log(this.data);
    }

    getMap(index){
        if (index < 0 || index > this.data.length)
            console.log("Error in mapSamples.getMap(index), index out of bounds");
        return this.data[index];
    }

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

    getMapLength(){
        return this.data.length;
    }
}

const sampleMaps = new MapReader("src/engine/map/generalMaps.json");
