var PixelTemplate = (function() {

    function PixelTemplate(width, height) {
        this._template = [];
        this._width = width;
        this._height = height;
        this._xPos = 0;
        this._yPos = 0;
        this._value = "nothing";

        var length = width * height;
        for (var i = 0; i < length; i++) {
            this._template.push(this._value);
        }
    }

    PixelTemplate.prototype.getTemplate = function() {
        return this._template;
    };

    PixelTemplate.prototype.flush = function() {
        this._template = [];
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
        this._template[this._width * y + x] = value;
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

    return PixelTemplate;

})();