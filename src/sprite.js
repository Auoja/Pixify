var Sprite = (function() {

    /**
     * The sprite used to create the isometric version.
     *
     * @public
     * @class Sprite
     * @param {Image} image The sprite image.
     */
    function Sprite(image) {
        this._spriteCanvas = document.createElement('canvas');
        this._spriteCtx = this._spriteCanvas.getContext('2d');
        this._xRes = image.width;
        this._yRes = image.height;

        this._spriteCanvas.width = this._xRes;
        this._spriteCanvas.height = this._yRes;
        this._spriteCtx.drawImage(image, 0, 0, this._xRes, this._yRes);
    }

    /**
     * Get the width of the sprite.
     *
     * @memberOf Sprite
     * @method getWidth
     * @return {Number} The width of the sprite.
     */
    Sprite.prototype.getWidth = function() {
        return this._xRes;
    };

    /**
     * Get the height of the sprite.
     * @memberOf Sprite
     * @method getHeight
     * @return {Number} The height of the sprite.
     */
    Sprite.prototype.getHeight = function() {
        return this._yRes;
    };

    /**
     * Get the RGB color value of the specified pixel.
     * @memberOf Sprite
     * @method getColor
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @return {ColorRGB} The color of the pixel.
     */
    Sprite.prototype.getColor = function(x, y) {
        var imData = this._spriteCtx.getImageData(x, y, 1, 1).data;
        return new ColorRGB(imData[0] / 255, imData[1] / 255, imData[2] / 255, imData[3] / 255);
    };

    return Sprite;

})();