var PixelTemplate = (function() {

    function PixelTemplate(width, height) {
        this._pixelTemplate = [];
        this._width = width;
        this._height = height;
        this._xPos = 0;
        this._yPos = 0;
        this._value = Pix.TRANSPARENT;

        this._templateLUT = {};
        this._paletteLookUpPattern = {
            topSide: 'normalSide',
            leftSide: 'darkSide',
            rightSide: 'darkestSide'
        };


        var length = width * height;
        for (var i = 0; i < length; i++) {
            this._pixelTemplate.push(this._value);
        }
    }

    PixelTemplate.prototype.getTemplate = function() {
        return this._pixelTemplate;
    };

    PixelTemplate.prototype.getWidth = function() {
        return this._width;
    };

    PixelTemplate.prototype.getHeight = function() {
        return this._height;
    };

    PixelTemplate.prototype.flush = function() {
        this._pixelTemplate = [];
        this._xPos = 0;
        this._yPos = 0;
        this._value = {};
    };

    PixelTemplate.prototype.moveTo = function(x, y) {
        this._xPos = x;
        this._yPos = y;
    };

    PixelTemplate.prototype.moveRelativeTo = function(x, y) {
        this._xPos += x;
        this._yPos += y;
    };

    PixelTemplate.prototype.setValue = function(value) {
        this._value = value;
    };

    PixelTemplate.prototype.setPixel = function(x, y, value) {
        this._pixelTemplate[this._width * y + x] = value;
    };

    PixelTemplate.prototype.drawSlantedLineUp = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this.setPixel(this._xPos + 1, this._yPos, this._value);
            this._yPos--;
            this._xPos += 2;
        }
    };

    PixelTemplate.prototype.drawSlantedLineDown = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this.setPixel(this._xPos + 1, this._yPos, this._value);
            this._yPos++;
            this._xPos += 2;
        }
    };

    PixelTemplate.prototype.drawVerticalLine = function(distance) {
        var start = this._yPos;
        while (this._yPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this._yPos++;
        }
    };

    PixelTemplate.prototype.drawHorizontalLine = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._value);
            this._xPos++;
        }
    };

    PixelTemplate.prototype.setPaletteLookUpPattern = function(pattern) {
        this._paletteLookUpPattern = pattern;
    };

    PixelTemplate.prototype.getColorizedTemplate = function(palette) {
        var colorized = [];
        var baseColor = palette.normalSide;
        var transparentColor = new ColorRGB(0, 0, 0, 0);

        if (!this._templateLUT[baseColor]) {
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
            this._templateLUT[baseColor] = colorized;
        }

        return this._templateLUT[baseColor];
    };

    return PixelTemplate;

})();