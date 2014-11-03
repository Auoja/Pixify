(function(window) {

    function hslToRgb(h, s, l) {
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

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h;
        var s;
        var l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    function createCanvas() {
        return document.createElement('canvas');
    }

    function PixelDrawer(context, width, height) {
        this._context = context;
        this._width = width;
        this._height = height;
        this._imageData = this._context.createImageData(this._width, this._height);
        this._xPos = 0;
        this._yPos = 0;
        this._color = [0, 0, 0];

        this._maxX = -1;
        this._minX = 1000000;
        this._maxY = -1;
        this._minY = 1000000;
    }

    PixelDrawer.prototype.flush = function() {
        this._imageData = this._context.createImageData(this._width, this._height);
    };

    PixelDrawer.prototype.storeExtremes = function() {
        if (this._xPos < this._minX) {
            this._minX = this._xPos;
        }
        if (this._xPos > this._maxX) {
            this._maxX = this._xPos;
        }

        if (this._yPos < this._minY) {
            this._minY = this._yPos;
        } else if (this._yPos > this._maxY) {
            this._maxY = this._yPos;
        }
    };

    PixelDrawer.prototype.moveTo = function(x, y) {
        this._xPos = x;
        this._yPos = y;
        this.storeExtremes();
    };

    PixelDrawer.prototype.moveRelativeTo = function(x, y) {
        this._xPos += x;
        this._yPos += y;
        this.storeExtremes();
    };

    PixelDrawer.prototype.setColor = function(color) {
        this._color = color;
    };

    PixelDrawer.prototype.setPixel = function(x, y, color) {
        if (x >= 0 && x < this._width && y >= 0 && y < this._height) {
            var index = (x + y * this._imageData.width) * 4;
            this._imageData.data[index + 0] = color[0];
            this._imageData.data[index + 1] = color[1];
            this._imageData.data[index + 2] = color[2];
            this._imageData.data[index + 3] = 255;
        }
    };

    PixelDrawer.prototype.drawSlantedLineUp = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._color);
            this.setPixel(this._xPos + 1, this._yPos, this._color);
            this._yPos--;
            this._xPos += 2;
        }
        this.storeExtremes();
    };

    PixelDrawer.prototype.drawSlantedLineDown = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._color);
            this.setPixel(this._xPos + 1, this._yPos, this._color);
            this._yPos++;
            this._xPos += 2;
        }
        this.storeExtremes();
    };

    PixelDrawer.prototype.drawVerticalLine = function(distance) {
        var start = this._yPos;
        while (this._yPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._color);
            this._yPos++;
        }
        this.storeExtremes();
    };

    PixelDrawer.prototype.render = function() {
        var xOffset = (this._width / 2) - (((this._maxX - this._minX) / 2) + this._minX);
        var yOffset = (this._height / 2) - (((this._maxY - this._minY) / 2) + this._minY);
        this._context.putImageData(this._imageData, xOffset, yOffset);
    };

    function Pixify(canvas, image) {
        var _canvas = canvas;
        var _ctx = _canvas.getContext('2d');
        var _pixelDrawer = new PixelDrawer(_ctx, _canvas.width, _canvas.height);
        var _colorLUT = {};
        var _spriteCanvas = createCanvas();
        var _spriteCtx = _spriteCanvas.getContext('2d');
        var xRes = image.width;
        var yRes = image.height;

        _spriteCanvas.width = xRes;
        _spriteCanvas.height = yRes;
        _spriteCtx.drawImage(image, 0, 0, xRes, yRes);

        // Todo: Figure out something smart
        var _gap = 14;
        var _pixelHeight = 40;
        var _pixelHalfWidth = 32;

        var _pixelWidth = _pixelHalfWidth * 2 - 1;
        var _offset = _pixelHalfWidth / 2 - 1;
        var _distance = _pixelHalfWidth + _gap;

        this.render = function() {
            _pixelDrawer.flush();

            var yOffset = 300;
            var xOffset = 0;

            for (var j = 0; j < _spriteCanvas.height; j++) {
                for (var i = _spriteCanvas.width; i >= 0; i--) {
                    var data = _spriteCtx.getImageData(i, j, 1, 1).data;
                    pixel2pixel(xOffset + (i + j) * _distance, yOffset + (j * 0.5 - i * 0.5) * _distance, [data[0], data[1], data[2]]);
                }
            }
            _pixelDrawer.render();
        };

        function getColorPalette(color) {
            var hash = color.toString();
            if (!_colorLUT[hash]) {
                var hslColor = rgbToHsl(color[0], color[1], color[2]);
                var colors = {
                    top: color,
                    left: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.7),
                    right: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.4),
                    highlight: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 1.3),
                    outline: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.1)
                };
                _colorLUT[hash] = colors;
            }
            return _colorLUT[hash];
        }

        function pixel2pixel(x, y, color) {
            if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
                return;
            }

            var palette = getColorPalette(color);

            _pixelDrawer.setColor(palette.left);
            for (var i = 1; i < _pixelHeight; i++) {
                _pixelDrawer.moveTo(x, y + i - _pixelHeight);
                _pixelDrawer.drawSlantedLineDown(_pixelHalfWidth);
            }

            _pixelDrawer.setColor(palette.right);
            for (i = 1; i < _pixelHeight; i++) {
                _pixelDrawer.moveTo(x + _pixelHalfWidth - 1, y + _offset + i - _pixelHeight);
                _pixelDrawer.drawSlantedLineUp(_pixelHalfWidth);
            }

            _pixelDrawer.setColor(palette.top);
            for (i = 1; i < _pixelHalfWidth - 1; i++) {
                _pixelDrawer.moveTo(x + i * 2, y - _pixelHeight);
                _pixelDrawer.drawSlantedLineUp(_pixelHalfWidth - i - 1);
                _pixelDrawer.moveTo(x + i * 2, y - _pixelHeight);
                _pixelDrawer.drawSlantedLineDown(_pixelHalfWidth - i - 1);
            }

            _pixelDrawer.setColor(palette.outline);

            _pixelDrawer.moveTo(x, y);
            _pixelDrawer.drawSlantedLineDown(_pixelHalfWidth);
            _pixelDrawer.moveRelativeTo(-1, -1);
            _pixelDrawer.drawSlantedLineUp(_pixelHalfWidth);

            _pixelDrawer.moveTo(x, y - _pixelHeight);
            _pixelDrawer.drawVerticalLine(_pixelHeight);

            _pixelDrawer.moveTo(x + _pixelWidth - 1, y - _pixelHeight);
            _pixelDrawer.drawVerticalLine(_pixelHeight);

            _pixelDrawer.moveTo(x, y - _pixelHeight);
            _pixelDrawer.drawSlantedLineUp(_pixelHalfWidth);
            _pixelDrawer.moveRelativeTo(-1, 1);
            _pixelDrawer.drawSlantedLineDown(_pixelHalfWidth);

            _pixelDrawer.setColor(palette.highlight);

            _pixelDrawer.moveTo(x + 2, y - _pixelHeight + 1);
            _pixelDrawer.drawSlantedLineDown(_pixelHalfWidth - 2);
            _pixelDrawer.moveRelativeTo(-1, -1);
            _pixelDrawer.drawSlantedLineUp(_pixelHalfWidth - 2);
            _pixelDrawer.moveTo(x + _pixelHalfWidth - 1, y + _offset - _pixelHeight);
            _pixelDrawer.drawVerticalLine(_pixelHeight);
        }
    }

    window.Pixify = Pixify;

})(this);