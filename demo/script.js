function startDemo() {

    var canvas = document.getElementById("canvas");
    var image = new Image();

    image.onload = function() {
        var pix = new Pixify({
            canvas: canvas,
            image: image,
            pixelSide: 32,
            pixelGap: 0
        });
        pix.renderVertical();
    }

    image.src = 'mario.png';
}