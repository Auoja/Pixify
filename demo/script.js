function startDemo() {

    var canvas = document.getElementById("canvas");
    var imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var image = new Image();
            image.onload = function() {
                var pix = new Pixify({
                    canvas: canvas,
                    image: image,
                    pixelSide: 38,
                    pixelGap: 6
                });
                pix.renderVertical();
            }
            image.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

}