function startDemo() {

    var canvas = document.getElementById("canvas");

    var image = new Image();
    image.onload = function() {
        var pix = new Pixify(canvas, image);
        pix.render();
    };
    image.src = "mario.png";

}