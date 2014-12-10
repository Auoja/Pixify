var PixelTemplate = (function() {

    /**
     * The isometric pixel template.
     *
     * @public
     * @class  PixelTemplate
     * @param {Number} width The width of the template
     * @param {Number} height The height of the template
     */
    function PixelTemplate(width, height) {
        this._pixelTemplate = [];
        this._width = width;
        this._height = height;
        this._xPos = 0;
        this._yPos = 0;
        this._value = Pix.TRANSPARENT;

        this._templateLUT = {};
        this._paletteLookUpPattern = Pix.paletteLookUpPatterns[Pix.SUN_TOP_LEFT];

        var length = width * height;
        for (var i = 0; i < length; i++) {
            this._pixelTemplate.push(this._value);
        }
    }

    /**
     * Get the template data array.
     *
     * @memberOf PixelTemplate
     * @method getTemplate
     * @return {Array} The template data
     */
    PixelTemplate.prototype.getTemplate = function() {
        return this._pixelTemplate;
    };

    /**
     * Get the width of the template.
     *
     * @memberOf PixelTemplate
     * @method getWidth
     * @return {Number} The width of the template.
     */
    PixelTemplate.prototype.getWidth = function() {
        return this._width;
    };

    /**
     * Get the height of the template.
     *
     * @memberOf PixelTemplate
     * @method getHeight
     * @return {Number} The height of the template.
     */
    PixelTemplate.prototype.getHeight = function() {
        return this._height;
    };

    /**
     * Flush the template.
     *
     * @memberOf PixelTemplate
     * @method flush
     */
    PixelTemplate.prototype.flush = function() {
        this._pixelTemplate = [];
        this._xPos = 0;
        this._yPos = 0;
        this._value = {};
    };

    /**
     * Set the cordinate the draw commands will start at.
     *
     * @memberOf PixelTemplate
     * @method moveTo
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     */
    PixelTemplate.prototype.moveTo = function(x, y) {
        this._xPos = x;
        this._yPos = y;
    };

    /**
     * Move the coordinate the draw commands will start at without drawing anything to the template.
     *
     * @memberOf PixelTemplate
     * @method moveRelativeTo
     * @param {Number} x The x coordinate move distance.
     * @param {Number} y The y coordinate move distance.
     */
    PixelTemplate.prototype.moveRelativeTo = function(x, y) {
        this._xPos += x;
        this._yPos += y;
    };

    /**
     * Set the value the draw commands should set pixels to.
     *
     * @memberOf PixelTemplate
     * @method setValue
     * @param {Number} value The value to set.
     */
    PixelTemplate.prototype.setValue = function(value) {
        this._value = value;
    };

    /**
     * Set a single pixel value of the template.
     *
     * @memberOf PixelTemplate
     * @method setPixel
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} value The value to set the pixel to.
     */
    PixelTemplate.prototype.setPixel = function(x, y, value) {
        this._pixelTemplate[this._width * y + x] = value;
    };

    /**
     * Draw a upwards slanted line on the template.
     *
     * @memberOf PixelTemplate
     * @method drawSlantedLineUp
     * @param {Number} distance The distance to draw.
     */
    PixelTemplate.prototype.drawSlantedLineUp = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this.setPixel(this._xPos + 1, this._yPos, this._value);
            this._yPos--;
            this._xPos += 2;
        }
    };

    /**
     * Draw a downwards slanted line on the template.
     *
     * @memberOf PixelTemplate
     * @method drawSlantedLineDown
     * @param {Number} distance The distance to draw.
     */
    PixelTemplate.prototype.drawSlantedLineDown = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this.setPixel(this._xPos + 1, this._yPos, this._value);
            this._yPos++;
            this._xPos += 2;
        }
    };

    /**
     * Draw a vertical line on the template.
     *
     * @memberOf PixelTemplate
     * @method drawVerticalLine
     * @param {Number} distance The distance to draw.
     */
    PixelTemplate.prototype.drawVerticalLine = function(distance) {
        var start = this._yPos;
        while (this._yPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this._yPos++;
        }
    };

    /**
     * Draw a horizontal line on the template.
     *
     * @memberOf PixelTemplate
     * @method drawHorizontalLine
     * @param {Number} distance The distance to draw.
     */
    PixelTemplate.prototype.drawHorizontalLine = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this._xPos++;
        }
    };

    /**
     * Set the palette look up pattern of the template, used in `getColorizedTemplate()` for shading.
     *
     * @memberOf PixelTemplate
     * @method setPaletteLookUpPattern
     * @param {Object} pattern The pattern object
     */
    PixelTemplate.prototype.setPaletteLookUpPattern = function(pattern) {
        this._paletteLookUpPattern = pattern;
    };

    /**
     * Get a colorized version of the template.
     *
     * @memberOf PixelTemplate
     * @method getColorizedTemplate
     * @param {Palette} palette The palette to color the template with.
     * @return {Array} A colorized version of the template.
     */
    PixelTemplate.prototype.getColorizedTemplate = function(palette) {
        var colorized = [];
        var color = palette.normalSide;
        var transparentColor = new ColorRGB(0, 0, 0, 0);

        if (!this._templateLUT[color]) {
            for (var i = 0; i < this._pixelTemplate.length; i++) {
                switch (this._pixelTemplate[i]) {
                    case Pix.LEFT:
                        colorized[i] = palette[this._paletteLookUpPattern.leftSide];
                        break;
                    case Pix.RIGHT:
                        colorized[i] = palette[this._paletteLookUpPattern.rightSide];
                        break;
                    case Pix.TOP:
                        colorized[i] = palette[this._paletteLookUpPattern.topSide];
                        break;
                    case Pix.OUTLINE:
                        colorized[i] = palette.outline;
                        break;
                    case Pix.HIGHLIGHT:
                        colorized[i] = palette.highlight;
                        break;
                    case Pix.CORNERHIGHLIGHT:
                        colorized[i] = palette.cornerHighlight;
                        break;
                    case Pix.TRANSPARENT:
                        colorized[i] = transparentColor;
                }
            }
            this._templateLUT[color] = colorized;
        }

        return this._templateLUT[color];
    };

    return PixelTemplate;

})();