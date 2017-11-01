class MapReader{
    constructor(inputUrl){
        this.data = jQuery.parseJSON(
            jQuery.ajax({
                url: inputUrl,
                async: false,
                dataType: 'json'
            }).responseText
        );
    }

    getMap(index){
        if (index < 0 || index > this.data.allMaps.length)
            console.log("Error in mapSamples.getMap(index), index out of bounds");
        console.log(this.data.allMaps[index].data);
        return this.data.allMaps[index].data;
    }

}

const sampleMaps = new MapReader("engine/map/maps.json");
