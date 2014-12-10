var PixelDrawer = (function() {

    /**
     * Responsible for rendering the generated isometric pixel art.
     *
     * @public
     * @class PixelDrawer
     * @param {Context} context The 2d context of the canvas the rendering should be done in.
     * @param {Number} width The width of the canvas.
     * @param {Number} height The height of the canvas.
     */
    function PixelDrawer(context, width, height) {
        this._context = context;
        this._width = width;
        this._height = height;
        this._imageData = this._context.createImageData(this._width, this._height);
    }

    /**
     * Flush all color data.
     *
     * @memberOf PixelDrawer
     * @method flush
     */
    PixelDrawer.prototype.flush = function() {
        this._imageData = this._context.createImageData(this._width, this._height);
    };

    /**
     * Set the color value of the specified pixel.
     *@memberOf PixelDrawer
     * @method setPixel
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {ColorRGB} color The color to set.
     */
    PixelDrawer.prototype.setPixel = function(x, y, color) {
        if (x >= 0 && x < this._width && y >= 0 && y < this._height && color.a !== 0) {
            var index = (x + y * this._imageData.width) * 4;
            this._imageData.data[index + 0] = Math.round(color.r * 255);
            this._imageData.data[index + 1] = Math.round(color.g * 255);
            this._imageData.data[index + 2] = Math.round(color.b * 255);
            this._imageData.data[index + 3] = Math.round(color.a * 255);
        }
    };

    /**
     * Render image to canvas.
     * @memberOf PixelDrawer
     * @method render
     */
    PixelDrawer.prototype.render = function() {
        this._context.putImageData(this._imageData, 0, 0);
    };

    return PixelDrawer;

})();