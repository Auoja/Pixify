function startDemo() {

    var canvas = document.getElementById("canvas");

    var image = new Image();
    image.onload = function() {
        var pix = new Pixify(canvas, image, 38, 6);
        pix.render();
    };
    image.src = "mario.png";

}