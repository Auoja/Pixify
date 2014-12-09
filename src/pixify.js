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