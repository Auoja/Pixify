var ColorHSL = (function() {

    /**
     * An HSL color object.
     *
     * @class ColorHSL
     * @constructor
     *
     * @param {Number} h Hue
     * @param {Number} s Saturation
     * @param {Number} l Light
     * @param {Number} a Alpha
     */
    function ColorHSL(h, s, l, a) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }

    /**
     * Darken the color
     *
     * @method darken
     * @param {Number} amount The percentage the color should be darkened.
     * @return {ColorHSL} A darker version of the `ColorHSL`
     */
    ColorHSL.prototype.darken = function(amount) {
        return new ColorHSL(this.h, this.s, this.l * (1 - (amount) / 100), 1);
    };

    /**
     * Lighten the color
     *
     * @method lighten
     * @param {Number} amount The percentage the color should be lightened.
     * @return {ColorHSL} A lighter version of the `ColorHSL`
     */
    ColorHSL.prototype.lighten = function(amount) {
        return new ColorHSL(this.h, this.s, this.l * (1 + (amount) / 100), 1);
    };

    /**
     * Create a `ColorRGB` version of the `ColorHSL`.
     *
     * @method getRGB
     * @return {ColorRGB} The RGB color representation.
     */
    ColorHSL.prototype.getRGB = function() {
        var r;
        var g;
        var b;

        function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        }

        if (this.s === 0) {
            r = g = b = this.l;
        } else {
            var q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s;
            var p = 2 * this.l - q;
            r = hue2rgb(p, q, this.h + 1 / 3);
            g = hue2rgb(p, q, this.h);
            b = hue2rgb(p, q, this.h - 1 / 3);
        }

        return new ColorRGB(r, g, b, 1);
    };

    return ColorHSL;

})();
var ColorRGB = (function() {

    /**
     * An RGB color object.
     *
     * @class ColorRGB
     * @constructor
     *
     * @param {Number} r Red
     * @param {Number} g Green
     * @param {Number} b Blue
     * @param {Number} a Alpha
     */
    function ColorRGB(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * Create a `ColorHSL` version of the `ColorRGB`
     *
     * @method getHSL
     * @return {ColorHSL} The HSL color representation.
     */
    ColorRGB.prototype.getHSL = function() {
        var max = Math.max(this.r, this.g, this.b);
        var min = Math.min(this.r, this.g, this.b);
        var h;
        var s;
        var l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case this.r:
                    h = (this.g - this.b) / d + (this.g < this.b ? 6 : 0);
                    break;
                case this.g:
                    h = (this.b - this.r) / d + 2;
                    break;
                case this.b:
                    h = (this.r - this.g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return new ColorHSL(h, s, l, 1);

    };

    /**
     * Get string representation of `ColorRGB`.
     * @method toString
     * @return {String} The string representation.
     */
    ColorRGB.prototype.toString = function() {
        return this.r + "-" + this.g + "-" + this.b + "-" + this.a;
    };

    return ColorRGB;

})();
var Palette = (function() {

    /**
     * Color palette.
     *
     * @class Palette
     * @constructor
     *
     * @param {ColorRGB} color The base color of the palette.
     */
    function Palette(color) {
        var hslColor = color.getHSL();

        /**
         * The color of the base side.
         * @property normalSide
         * @type ColorRGB
         */
        this.normalSide = color;
        /**
         * The color of the dark side.
         * @property darkSide
         * @type ColorRGB
         */
        this.darkSide = hslColor.darken(30).getRGB();
        /**
         * The color of the darkest side.
         * @property darkestSide
         * @type ColorRGB
         */
        this.darkestSide = hslColor.darken(60).getRGB();
        /**
         * The color of the highlight.
         * @property highlight
         * @type ColorRGB
         */
        this.highlight = hslColor.lighten(30).getRGB();
        /**
         * The color of the corner highlight.
         * @property cornerHighlight
         * @type ColorRGB
         */
        this.cornerHighlight = hslColor.lighten(80).getRGB();
        /**
         * The color of the outline.
         * @property outline
         * @type ColorRGB
         */
        this.outline = hslColor.darken(90).getRGB();
    }

    return Palette;

})();
var PaletteManager = (function() {

    /**
     * Manages the palettes.
     * @class PaletteManager
     * @constructor
     */
    function PaletteManager() {
        this._paletteLUT = {};
        this._paletteLookUpPattern = Pix.paletteLookUpPatterns[Pix.SUN_TOP_LEFT];
    }

    /**
     * Check if a color is valid by looking at the alpha channel.
     * @method isColorValid
     * @param {ColorRGB} color The RGB color that should be evaluated.
     * @return {Boolean} If color is valid or not.
     */
    PaletteManager.prototype.isColorValid = function(color) {
        var palette = this.getPalette(color);
        if (palette === null) {
            return false;
        }
        return true;
    };

    /**
     * Get the palette look up pattern
     * @method getPattern
     * @return {Object} The pattern.
     */
    PaletteManager.prototype.getPattern = function() {
        return this._paletteLookUpPattern;
    };

    /**
     * Get the top side version of the input color.
     * @method getTopColor
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the top side.
     */
    PaletteManager.prototype.getTopColor = function(color) {
        return this.getPalette(color)[this._paletteLookUpPattern.topSide];
    };

    /**
     * Get the left side version of the input color.
     * @method getLeftColor
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the left side.
     */
    PaletteManager.prototype.getLeftColor = function(color) {
        return this.getPalette(color)[this._paletteLookUpPattern.leftSide];
    };

    /**
     * Get the right side version of the input color.
     * @method getRightColor
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the right side.
     */
    PaletteManager.prototype.getRightColor = function(color) {
        return this.getPalette(color)[this._paletteLookUpPattern.rightSide];
    };

    /**
     * Get the outline version of the input color.
     * @method getOutlineColor
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the outline.
     */
    PaletteManager.prototype.getOutlineColor = function(color) {
        return this.getPalette(color).outline;
    };

    /**
     * Get the highlight version of the input color.
     * @method getHightLightColor
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the highlight.
     */
    PaletteManager.prototype.getHightLightColor = function(color) {
        return this.getPalette(color).highlight;
    };

    /**
     * Get the corner highlight version of the input color.
     * @method getCornerHightlightColor
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the corner highlight.
     */
    PaletteManager.prototype.getCornerHightlightColor = function(color) {
        return this.getPalette(color).cornerHighlight;
    };



    /**
     * Get the palette of the input color.
     * @method getPalette
     * @param {ColorRGB} color The input color.
     * @return {Palette|null} The palette generated from the input color or null if no palette can be generated.
     */
    PaletteManager.prototype.getPalette = function(color) {
        var palette = null;
        if (!this._paletteLUT[color]) {
            if (color.a !== 0) {
                palette = new Palette(color);
            }
            this._paletteLUT[color] = palette;
        }
        return this._paletteLUT[color];
    };

    /**
     * Set the sun position to change the palette look up pattern.
     * @method setSunPosition
     * @param {Number} position The sun position.
     */
    PaletteManager.prototype.setSunPosition = function(position) {
        if (Pix.paletteLookUpPatterns[position]) {
            this._paletteLookUpPattern = Pix.paletteLookUpPatterns[position];
        }
    };

    return PaletteManager;

})();
window.Pix = (function() {

    return {
        // Pixel Sections
        CORNERHIGHLIGHT: 0,
        LEFT: 1,
        RIGHT: 2,
        TOP: 3,
        OUTLINE: 4,
        HIGHLIGHT: 5,
        TRANSPARENT: 6,
        // Sun Positions
        SUN_LEFT: 0,
        SUN_RIGHT: 1,
        SUN_TOP_RIGHT: 2,
        SUN_TOP_LEFT: 3,
        paletteLookUpPatterns: [{
            // Left
            topSide: 'darkSide',
            leftSide: 'normalSide',
            rightSide: 'darkestSide'
        }, {
            // Right
            topSide: 'darkSide',
            leftSide: 'darkestSide',
            rightSide: 'normalSide'
        }, {
            // Top Right
            topSide: 'normalSide',
            leftSide: 'darkestSide',
            rightSide: 'darkSide'
        }, {
            // Top Left
            topSide: 'normalSide',
            leftSide: 'darkSide',
            rightSide: 'darkestSide'
        }]
    };

})();
var PixelDrawer = (function() {

    /**
     * Responsible for rendering the generated isometric pixel art.
     *
     * @class PixelDrawer
     * @constructor
     *
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
     * @method flush
     */
    PixelDrawer.prototype.flush = function() {
        this._imageData = this._context.createImageData(this._width, this._height);
    };

    /**
     * Set the color value of the specified pixel.
     *
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
     * @method render
     */
    PixelDrawer.prototype.render = function() {
        this._context.putImageData(this._imageData, 0, 0);
    };

    return PixelDrawer;

})();
var PixelTemplate = (function() {

    /**
     * The isometric pixel template.
     *
     * @class  PixelTemplate
     * @constructor
     *
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
     * @method getTemplate
     * @return {Array} The template data
     */
    PixelTemplate.prototype.getTemplate = function() {
        return this._pixelTemplate;
    };

    /**
     * Get the width of the template.
     * @method getWidth
     * @return {Number} The width of the template.
     */
    PixelTemplate.prototype.getWidth = function() {
        return this._width;
    };

    /**
     * Get the height of the template.
     * @method getHeight
     * @return {Number} The height of the template.
     */
    PixelTemplate.prototype.getHeight = function() {
        return this._height;
    };

    /**
     * Flush the template.
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
     * @method setValue
     * @param {Number} value The value to set.
     */
    PixelTemplate.prototype.setValue = function(value) {
        this._value = value;
    };

    /**
     * Set a single pixel value of the template.
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
     * @method setPaletteLookUpPattern
     * @param {Object} pattern The pattern object
     */
    PixelTemplate.prototype.setPaletteLookUpPattern = function(pattern) {
        this._paletteLookUpPattern = pattern;
    };

    /**
     * Get a colorized version of the template.
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
window.Pixify = (function() {

    /**
     * An RGB color object.
     *
     * @class Pixify
     * @constructor
     *
     * @param {Object} opts The options to initialize with.
     */
    function Pixify(opts) {
        this._canvas = opts.canvas;
        this._ctx = this._canvas.getContext('2d');

        this._padding = 10;

        this._pixelSide = 32;
        this._gap = 0;
        this._pixelHeight = 0;
        this._pixelWidth = 0;
        this._offset = 0;
        this._distance = 0;

        this.setPixelSize(opts.pixelSide);
        this.setPixelGap(opts.pixelGap);

        this._sprite = new Sprite(opts.image);
        this._paletteManager = new PaletteManager();

        this._pixelTemplate = {};
        this._pixelDrawer = {};
    }

    /**
     * Set the sun position to change the palette look up pattern.
     * @method setSunPosition
     * @param {Number} position The sun position.
     */
    Pixify.prototype.setSunPosition = function(position) {
        this._paletteManager.setSunPosition(position);
    };

    /**
     * Render the pixel art horizontally.
     * @method renderHorizontal
     */
    Pixify.prototype.renderHorizontal = function() {
        var xRes = this._sprite.getWidth();
        var yRes = this._sprite.getHeight();

        this._canvas.width = 2 * this._padding + this._pixelSide * (xRes + yRes - 2) + this._gap * (xRes + yRes - 2) + this._pixelWidth;
        this._canvas.height = 2 * this._padding + this._offset * (xRes + yRes) + (this._gap / 2) * (xRes + yRes - 2) + this._pixelHeight - 1;

        this._pixelDrawer = new PixelDrawer(this._ctx, this._canvas.width, this._canvas.height);

        var offset = {
            x: this._padding,
            y: this._padding + (xRes - 1) * this._offset + (this._gap / 2) * (xRes - 1) - 1
        };

        this._createTemplate();
        this._pixelTemplate.setPaletteLookUpPattern(this._paletteManager.getPattern());

        for (var y = 0; y < yRes; y++) {
            for (var x = xRes - 1; x >= 0; x--) {
                this._template2pixel(offset.x + (x + y) * this._distance, offset.y + (y * 0.5 - x * 0.5) * this._distance, this._sprite.getColor(x, y));
            }
        }

        this._pixelDrawer.render();
    };

    /**
     * Render the pixel art vertically.
     * @method renderVertical
     */
    Pixify.prototype.renderVertical = function() {
        var xRes = this._sprite.getWidth();
        var yRes = this._sprite.getHeight();

        this._canvas.width = 2 * this._padding + this._pixelSide * (xRes - 1) + this._gap * (xRes - 1) + this._pixelWidth;
        this._canvas.height = 2 * this._padding + this._offset * (xRes + 1) + (this._gap / 2) * (xRes - 1) + this._pixelHeight * yRes + (this._gap) * (yRes - 1) - 1;

        this._createTemplate();
        this._pixelDrawer = new PixelDrawer(this._ctx, this._canvas.width, this._canvas.height);

        var offset = {
            x: this._padding,
            y: this._padding + (xRes - 1) * this._offset + (this._gap / 2) * (xRes - 1) - 1
        };

        this._pixelTemplate.setPaletteLookUpPattern(this._paletteManager.getPattern());

        for (var y = yRes - 1; y >= 0; y--) {
            for (var x = xRes - 1; x >= 0; x--) {
                this._template2pixel(offset.x + x * this._distance, offset.y + (y - x * 0.5) * this._distance, this._sprite.getColor(x, y));
            }
        }

        this._pixelDrawer.render();
    };

    /**
     * Set the isometric pixel cube dimensions.
     * @method setPixelSize
     * @param {Number} side The side of the isometric pixel cube.
     */
    Pixify.prototype.setPixelSize = function(side) {
        this._pixelSide = side % 2 === 0 ? side : side - 1 || 32;
        this._pixelHeight = this._pixelSide;
        this._pixelWidth = this._pixelSide * 2 - 1;
        this._offset = this._pixelSide / 2;
        this._distance = this._pixelSide + this._gap;
    };

    /**
     * Set the gap between the cubes.
     * @method setPixelGap
     * @param {Number} gap The gap between the pixel cubes.
     */
    Pixify.prototype.setPixelGap = function(gap) {
        this._gap = gap % 2 === 0 ? gap : gap - 1 || 0;
        this._distance = this._pixelSide + this._gap;
    };

    /*!
     * Create the pixel cube template.
     * @method _createTemplate
     */
    Pixify.prototype._createTemplate = function() {
        this._pixelTemplate = new PixelTemplate(this._pixelWidth, this._pixelHeight + this._pixelSide);

        var x = 0;
        var y = this._pixelSide + this._offset;

        this._pixelTemplate.setValue(Pix.LEFT);
        for (var i = 1; i < this._pixelHeight; i++) {
            this._pixelTemplate.moveTo(x, y + i - this._pixelHeight);
            this._pixelTemplate.drawSlantedLineDown(this._pixelSide);
        }

        this._pixelTemplate.setValue(Pix.RIGHT);
        for (i = 1; i < this._pixelHeight; i++) {
            this._pixelTemplate.moveTo(x + this._pixelSide - 1, y + this._offset - 1 + i - this._pixelHeight);
            this._pixelTemplate.drawSlantedLineUp(this._pixelSide);
        }

        this._pixelTemplate.setValue(Pix.TOP);
        for (i = 1; i < this._pixelSide - 1; i++) {
            this._pixelTemplate.moveTo(x + i * 2, y - this._pixelHeight);
            this._pixelTemplate.drawSlantedLineUp(this._pixelSide - i - 1);
            this._pixelTemplate.moveTo(x + i * 2, y - this._pixelHeight);
            this._pixelTemplate.drawSlantedLineDown(this._pixelSide - i - 1);
        }

        this._pixelTemplate.setValue(Pix.OUTLINE);

        this._pixelTemplate.moveTo(x, y);
        this._pixelTemplate.drawSlantedLineDown(this._pixelSide);
        this._pixelTemplate.moveRelativeTo(-1, -1);
        this._pixelTemplate.drawSlantedLineUp(this._pixelSide);

        this._pixelTemplate.moveTo(x, y - this._pixelHeight);
        this._pixelTemplate.drawVerticalLine(this._pixelHeight);

        this._pixelTemplate.moveTo(x + this._pixelWidth - 1, y - this._pixelHeight);
        this._pixelTemplate.drawVerticalLine(this._pixelHeight);

        this._pixelTemplate.moveTo(x, y - this._pixelHeight);
        this._pixelTemplate.drawSlantedLineUp(this._pixelSide);
        this._pixelTemplate.moveRelativeTo(-1, 1);
        this._pixelTemplate.drawSlantedLineDown(this._pixelSide);

        this._pixelTemplate.setValue(Pix.HIGHLIGHT);

        this._pixelTemplate.moveTo(x + 2, y - this._pixelHeight + 1);
        this._pixelTemplate.drawSlantedLineDown(this._pixelSide - 2);
        this._pixelTemplate.moveRelativeTo(-1, -1);
        this._pixelTemplate.drawSlantedLineUp(this._pixelSide - 2);
        this._pixelTemplate.moveTo(x + this._pixelSide - 1, y + this._offset - 1 - this._pixelHeight);
        this._pixelTemplate.drawVerticalLine(this._pixelHeight);

        this._pixelTemplate.setValue(Pix.CORNERHIGHLIGHT);

        this._pixelTemplate.moveTo(x + this._pixelSide - 1, y + this._offset - 1 - this._pixelHeight);
        this._pixelTemplate.drawVerticalLine(3);
        this._pixelTemplate.moveTo(x + this._pixelSide - 2, y + this._offset - 1 - this._pixelHeight);
        this._pixelTemplate.drawHorizontalLine(3);
    };

    /*!
     * Colorize the template based on the input pixel art.
     * @method _template2pixel
     * @param {Number} originX The x coordinate of the pixel cube origin.
     * @param {Number} originY The y coordinate of the pixel cube origin.
     * @param {ColorRGB} color The color of the pixel cube.
     */
    Pixify.prototype._template2pixel = function(originX, originY, color) {
        if (!this._paletteManager.isColorValid(color)) {
            return;
        }

        var pixel = this._pixelTemplate.getColorizedTemplate(this._paletteManager.getPalette(color));

        for (var x = 0; x < this._pixelTemplate.getWidth(); x++) {
            for (var y = 0; y < this._pixelTemplate.getHeight(); y++) {
                var tempColor = pixel[this._pixelTemplate.getWidth() * y + x];
                if (tempColor) {
                    this._pixelDrawer.setPixel(originX + x, originY + y, tempColor);
                }
            }
        }
    };

    return Pixify;

})();
var Sprite = (function() {

    /**
     * The sprite used to create the isometric version.
     *
     * @class Sprite
     * @constructor
     *
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
     * @method getWidth
     * @return {Number} The width of the sprite.
     */
    Sprite.prototype.getWidth = function() {
        return this._xRes;
    };

    /**
     * Get the height of the sprite.
     * @method getHeight
     * @return {Number} The height of the sprite.
     */
    Sprite.prototype.getHeight = function() {
        return this._yRes;
    };

    /**
     * Get the RGB color value of the specified pixel.
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