function startDemo() {

    var canvas = document.getElementById("canvas");

    // var ctx = canvas.getContext('2d');
    // // Fix for anti-aliasing
    // ctx.translate(0.5, 0.5);
    // ctx.lineWidth = 0.5;


    var pix = new Pixify(canvas);
    pix.pixel2pixel(50, 50, [255, 0, 0]);
}