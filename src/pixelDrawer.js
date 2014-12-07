var PixelDrawer = (function() {

    function PixelDrawer(context, width, height) {
        this._context = context;
        this._width = width;
        this._height = height;
        this._imageData = this._context.createImageData(this._width, this._height);
    }

    PixelDrawer.prototype.flush = function() {
        this._imageData = this._context.createImageData(this._width, this._height);
    };

    PixelDrawer.prototype.setPixel = function(x, y, color) {
        if (x >= 0 && x < this._width && y >= 0 && y < this._height && color.a !== 0) {
            var index = (x + y * this._imageData.width) * 4;
            this._imageData.data[index + 0] = Math.round(color.r * 255);
            this._imageData.data[index + 1] = Math.round(color.g * 255);
            this._imageData.data[index + 2] = Math.round(color.b * 255);
            this._imageData.data[index + 3] = Math.round(color.a * 255);
        }
    };

    PixelDrawer.prototype.render = function() {
        this._context.putImageData(this._imageData, 0, 0);
    };

    return PixelDrawer;

})();