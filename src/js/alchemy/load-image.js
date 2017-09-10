/**
 * Allow developer input images, Doesn't used currently.
 */
function loadImages() {

    var imageNames = [];
    var imageBase64 = [];

    /**
     * multiple image loading
     */
    function handleFileSelect() {
        //Check File API support
        if (window.File && window.FileList && window.FileReader) {

            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                if (!file.type.match('image')) continue;

                imageNames.push(file.name);
                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
                    var picFile = event.target;
                    imageBase64.push(picFile.result + "");
                });
                //Read the image
                picReader.readAsDataURL(file);
            }
        } else {
            console.log("Your browser does not support File API");
        }
    }

    /**
     * input button event listeners
     */
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    /**
     * store input images on JSON file
     */
    function addToJson(jsonName, base64Image, ident, elementName)
    {
        var data = JSON.parse(jsonName);
        if (jsonName.inlcudes('icons')) {
            data.push({
                elementName: base64Image
            });
            jsonName = JSON.stringify(data);
        } else if (jsonName.includes('elements')) {
            data.elements.push({
                id: ident,
                name: elementName
            });
            jsonName = JSON.stringify(data);
        }
    }
}