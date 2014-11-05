function startDemo() {

    var canvas = document.getElementById("canvas");
    var imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var image = new Image();
            image.onload = function() {
                var pix = new Pixify(canvas, image, 38, 6);
                pix.render();
            }
            image.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

}