(function(window) {

    function ColorHSL(h, s, l, a) {
        this._h = h || 0;
        this._s = s || 0;
        this._l = l || 0;
        this._a = a || 1;
    }

    ColorHSL.prototype.darken = function(amount) {
        return new ColorHSL(this._h, this._s, this._l * (1 - (amount) / 100), 1);
    };

    ColorHSL.prototype.lighten = function(amount) {
        return new ColorHSL(this._h, this._s, this._l * (1 + (amount) / 100), 1);
    };

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

        if (this._s === 0) {
            r = g = b = this._l; // achromatic
        } else {
            var q = this._l < 0.5 ? this._l * (1 + this._s) : this._l + this._s - this._l * this._s;
            var p = 2 * this._l - q;
            r = hue2rgb(p, q, this._h + 1 / 3);
            g = hue2rgb(p, q, this._h);
            b = hue2rgb(p, q, this._h - 1 / 3);
        }

        return new ColorRGB(r, g, b, 1);
    };


    function ColorRGB(r, g, b, a) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    ColorRGB.prototype.getHSL = function() {
        var max = Math.max(this._r, this._g, this._b);
        var min = Math.min(this._r, this._g, this._b);
        var h;
        var s;
        var l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case this._r:
                    h = (this._g - this._b) / d + (this._g < this._b ? 6 : 0);
                    break;
                case this._g:
                    h = (this._b - this._r) / d + 2;
                    break;
                case this._b:
                    h = (this._r - this._g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return new ColorHSL(h, s, l, 1);

    };

    ColorRGB.prototype.getHash = function() {
        return this._r + "-" + this._g + "-" + this._b + "-" + this._a;
    };

    function PixelDrawer(context, width, height) {
        this._context = context;
        this._width = width;
        this._height = height;
        this._imageData = this._context.createImageData(this._width, this._height);
        this._xPos = 0;
        this._yPos = 0;
        this._color = new ColorRGB(0, 0, 0, 1);
    }

    PixelDrawer.prototype.flush = function() {
        this._imageData = this._context.createImageData(this._width, this._height);
    };

    PixelDrawer.prototype.moveTo = function(x, y) {
        this._xPos = x;
        this._yPos = y;
    };

    PixelDrawer.prototype.moveRelativeTo = function(x, y) {
        this._xPos += x;
        this._yPos += y;
    };

    PixelDrawer.prototype.setColor = function(color) {
        this._color = color;
    };

    PixelDrawer.prototype.setPixel = function(x, y, color) {
        if (x >= 0 && x < this._width && y >= 0 && y < this._height) {
            var index = (x + y * this._imageData.width) * 4;
            this._imageData.data[index + 0] = Math.round(color._r * 255);
            this._imageData.data[index + 1] = Math.round(color._g * 255);
            this._imageData.data[index + 2] = Math.round(color._b * 255);
            this._imageData.data[index + 3] = Math.round(color._a * 255);
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
    };

    PixelDrawer.prototype.drawSlantedLineDown = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._color);
            this.setPixel(this._xPos + 1, this._yPos, this._color);
            this._yPos++;
            this._xPos += 2;
        }
    };

    PixelDrawer.prototype.drawVerticalLine = function(distance) {
        var start = this._yPos;
        while (this._yPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._color);
            this._yPos++;
        }
    };

    PixelDrawer.prototype.drawHorizontalLine = function(distance) {
        var start = this._xPos;
        while (this._xPos < start + distance) {
            this.setPixel(this._xPos, this._yPos, this._color);
            this._xPos++;
        }
    };

    PixelDrawer.prototype.render = function() {
        this._context.putImageData(this._imageData, 0, 0);
    };

    function Pixify(opts) {
        var _canvas = opts.canvas;
        var _ctx = _canvas.getContext('2d');
        var _colorLUT = {};
        var _spriteCanvas;
        var _spriteCtx;
        var _xRes;
        var _yRes;

        var _padding = 10;

        var _gap = opts.pixelGap % 2 === 0 ? opts.pixelGap : opts.pixelGap - 1 || 0;
        var _pixelSide = opts.pixelSide % 2 === 0 ? opts.pixelSide : opts.pixelSide - 1 || 32;

        var _pixelHeight = _pixelSide;
        var _pixelWidth = _pixelSide * 2 - 1;
        var _offset = _pixelSide / 2;
        var _distance = _pixelSide + _gap;

        setupSpriteCanvas(opts.image);

        var _pixelDrawer;

        this.renderHorizontal = function() {

            _canvas.width = 2 * _padding + _pixelSide * (_xRes + _yRes - 2) + _gap * (_xRes + _yRes - 2) + _pixelWidth;
            _canvas.height = 2 * _padding + _offset * (_xRes + _yRes) + (_gap / 2) * (_xRes + _yRes - 2) + _pixelHeight;
            _pixelDrawer = new PixelDrawer(_ctx, _canvas.width, _canvas.height);

            var offset = {
                x: _padding,
                y: _padding + _xRes * _offset + (_gap / 2) * (_xRes - 1) + _pixelHeight
            };

            for (var j = 0; j < _yRes; j++) {
                for (var i = _xRes - 1; i >= 0; i--) {
                    var data = _spriteCtx.getImageData(i, j, 1, 1).data;
                    pixel2pixel(offset.x + (i + j) * _distance, offset.y + (j * 0.5 - i * 0.5) * _distance, new ColorRGB(data[0] / 255, data[1] / 255, data[2] / 255, data[3] / 255));
                }
            }

            _pixelDrawer.render();
        };

        this.renderVertical = function() {

            _canvas.width = 2 * _padding + _pixelSide * (_xRes - 1) + _gap * (_xRes - 1) + _pixelWidth;
            _canvas.height = 2 * _padding + _offset * (_xRes + 1) + (_gap / 2) * (_xRes - 1) + _pixelHeight * _yRes + (_gap) * (_yRes - 1) - 1; // Why -1
            _pixelDrawer = new PixelDrawer(_ctx, _canvas.width, _canvas.height);

            var offset = {
                x: _padding,
                y: _padding + (_xRes) * _offset + (_gap / 2) * (_xRes - 1) + _pixelHeight
            };

            for (var j = _yRes - 1; j >= 0; j--) {
                for (var i = _xRes - 1; i >= 0; i--) {
                    var data = _spriteCtx.getImageData(i, j, 1, 1).data;
                    pixel2pixel(offset.x + i * _distance, offset.y + (j - i * 0.5) * _distance, new ColorRGB(data[0] / 255, data[1] / 255, data[2] / 255, data[3] / 255));
                }
            }

            _pixelDrawer.render();
        };

        function setupSpriteCanvas(image) {
            _spriteCanvas = document.createElement('canvas');
            _spriteCtx = _spriteCanvas.getContext('2d');
            _xRes = image.width;
            _yRes = image.height;

            _spriteCanvas.width = _xRes;
            _spriteCanvas.height = _yRes;
            _spriteCtx.drawImage(image, 0, 0, _xRes, _yRes);
        }

        function getColorPalette(color) {
            var hash = color.getHash();
            if (!_colorLUT[hash]) {
                var palette = null;
                if (color._a !== 0) {
                    var hslColor = color.getHSL();
                    palette = {
                        top: color,
                        left: hslColor.darken(30).getRGB(),
                        right: hslColor.darken(60).getRGB(),
                        highlight: hslColor.lighten(30).getRGB(),
                        cornerHighlight: hslColor.lighten(80).getRGB(),
                        outline: hslColor.darken(90).getRGB()
                    };
                }
                _colorLUT[hash] = palette;
            }
            return _colorLUT[hash];
        }

        function pixel2pixel(x, y, color) {

            var palette = getColorPalette(color);

            if (palette === null) {
                return;
            }

            _pixelDrawer.setColor(palette.left);
            for (var i = 1; i < _pixelHeight; i++) {
                _pixelDrawer.moveTo(x, y + i - _pixelHeight);
                _pixelDrawer.drawSlantedLineDown(_pixelSide);
            }

            _pixelDrawer.setColor(palette.right);
            for (i = 1; i < _pixelHeight; i++) {
                _pixelDrawer.moveTo(x + _pixelSide - 1, y + _offset - 1 + i - _pixelHeight);
                _pixelDrawer.drawSlantedLineUp(_pixelSide);
            }

            _pixelDrawer.setColor(palette.top);
            for (i = 1; i < _pixelSide - 1; i++) {
                _pixelDrawer.moveTo(x + i * 2, y - _pixelHeight);
                _pixelDrawer.drawSlantedLineUp(_pixelSide - i - 1);
                _pixelDrawer.moveTo(x + i * 2, y - _pixelHeight);
                _pixelDrawer.drawSlantedLineDown(_pixelSide - i - 1);
            }

            _pixelDrawer.setColor(palette.outline);

            _pixelDrawer.moveTo(x, y);
            _pixelDrawer.drawSlantedLineDown(_pixelSide);
            _pixelDrawer.moveRelativeTo(-1, -1);
            _pixelDrawer.drawSlantedLineUp(_pixelSide);

            _pixelDrawer.moveTo(x, y - _pixelHeight);
            _pixelDrawer.drawVerticalLine(_pixelHeight);

            _pixelDrawer.moveTo(x + _pixelWidth - 1, y - _pixelHeight);
            _pixelDrawer.drawVerticalLine(_pixelHeight);

            _pixelDrawer.moveTo(x, y - _pixelHeight);
            _pixelDrawer.drawSlantedLineUp(_pixelSide);
            _pixelDrawer.moveRelativeTo(-1, 1);
            _pixelDrawer.drawSlantedLineDown(_pixelSide);

            _pixelDrawer.setColor(palette.highlight);

            _pixelDrawer.moveTo(x + 2, y - _pixelHeight + 1);
            _pixelDrawer.drawSlantedLineDown(_pixelSide - 2);
            _pixelDrawer.moveRelativeTo(-1, -1);
            _pixelDrawer.drawSlantedLineUp(_pixelSide - 2);
            _pixelDrawer.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
            _pixelDrawer.drawVerticalLine(_pixelHeight);

            _pixelDrawer.setColor(palette.cornerHighlight);

            _pixelDrawer.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
            _pixelDrawer.drawVerticalLine(3);
            _pixelDrawer.moveTo(x + _pixelSide - 2, y + _offset - 1 - _pixelHeight);
            _pixelDrawer.drawHorizontalLine(3);
        }
    }

    window.Pixify = Pixify;

})(this);