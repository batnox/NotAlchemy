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
            for (let y in i.data){
                tmp[y] = [];
                for (let x in i.data[y]){
                    tmp[y][x] = i.data[y][x];
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

const sampleMaps = new MapReader("engine/map/maps.json");
