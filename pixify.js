var ColorHSL = (function() {

    function ColorHSL(h, s, l, a) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }

    ColorHSL.prototype.darken = function(amount) {
        return new ColorHSL(this.h, this.s, this.l * (1 - (amount) / 100), 1);
    };

    ColorHSL.prototype.lighten = function(amount) {
        return new ColorHSL(this.h, this.s, this.l * (1 + (amount) / 100), 1);
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

        if (this.s === 0) {
            r = g = b = this.l; // achromatic
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

    function ColorRGB(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    ColorRGB.prototype.getHSL = function() {
        var max = Math.max(this.r, this.g, this.b);
        var min = Math.min(this.r, this.g, this.b);
        var h;
        var s;
        var l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
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

    ColorRGB.prototype.toString = function() {
        return this.r + "-" + this.g + "-" + this.b + "-" + this.a;
    };

    return ColorRGB;

})();
var PaletteManager = (function() {

    function PaletteManager() {
        var _colorLUT = {};
        var _paletteLookUpPattern = {
            topSide: 'normalSide',
            leftSide: 'darkSide',
            rightSide: 'darkestSide'
        };

        // Private
        function _getPalette(color) {
            var palette = null;

            if (!_colorLUT[color]) {
                if (color.a !== 0) {
                    var hslColor = color.getHSL();
                    palette = {
                        'normalSide': color,
                        'darkSide': hslColor.darken(30).getRGB(),
                        'darkestSide': hslColor.darken(60).getRGB(),
                        'highlight': hslColor.lighten(30).getRGB(),
                        'cornerHighlight': hslColor.lighten(80).getRGB(),
                        'outline': hslColor.darken(90).getRGB()
                    };
                }
                _colorLUT[color] = palette;
            }
            return _colorLUT[color];
        }

        // Public
        this.isColorValid = function(color) {
            var palette = _getPalette(color);
            if (palette === null) {
                return false;
            }
            return true;
        };

        this.getPattern = function() {
            return _paletteLookUpPattern;
        };

        this.getTopColor = function(color) {
            return _getPalette(color)[_paletteLookUpPattern.topSide];
        };

        this.getLeftColor = function(color) {
            return _getPalette(color)[_paletteLookUpPattern.leftSide];
        };

        this.getRightColor = function(color) {
            return _getPalette(color)[_paletteLookUpPattern.rightSide];
        };

        this.getOutlineColor = function(color) {
            return _getPalette(color).outline;
        };

        this.getHightLightColor = function(color) {
            return _getPalette(color).highlight;
        };

        this.getCornerHightlightColor = function(color) {
            return _getPalette(color).cornerHighlight;
        };

        this.getPalette = function(color) {
            return _getPalette(color);
        };

        this.setSunPosition = function(position) {
            switch (position) {
                case 'left':
                    _paletteLookUpPattern = {
                        topSide: 'darkSide',
                        leftSide: 'normalSide',
                        rightSide: 'darkestSide'
                    };
                    break;
                case 'right':
                    _paletteLookUpPattern = {
                        topSide: 'darkSide',
                        leftSide: 'darkestSide',
                        rightSide: 'normalSide'
                    };
                    break;
                case 'top-right':
                    _paletteLookUpPattern = {
                        topSide: 'normalSide',
                        leftSide: 'darkestSide',
                        rightSide: 'darkSide'
                    };
                    break;
                default:
                case 'top-left':
                    _paletteLookUpPattern = {
                        topSide: 'normalSide',
                        leftSide: 'darkSide',
                        rightSide: 'darkestSide'
                    };
            }
        };

    }

    return PaletteManager;

})();
var Pix = (function() {

    return {
        CORNERHIGHLIGHT: 0,
        LEFT: 1,
        RIGHT: 2,
        TOP: 3,
        OUTLINE: 4,
        HIGHLIGHT: 5,
        TRANSPARENT: 6
    };

})();
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
window.Pixify = (function() {

    function Pixify(opts) {
        var _canvas = opts.canvas;
        var _ctx = _canvas.getContext('2d');

        var _padding = 10;

        var _pixelSide = 32;
        var _gap = 0;
        var _pixelHeight;
        var _pixelWidth;
        var _offset;
        var _distance;

        _setPixelSize(opts.pixelSide);
        _setPixelGap(opts.pixelGap);

        var _sprite = new Sprite(opts.image);

        var _paletteManager = new PaletteManager();

        var _pixelTemplate;

        var _pixelDrawer;

        this.setPixelSize = function(value) {
            _setPixelSize(value);
        };

        this.setPixelGap = function(value) {
            _setPixelGap(value);
        };

        this.setSunPosition = function(position) {
            _paletteManager.setSunPosition(position);
        };

        this.renderHorizontal = function() {
            var xRes = _sprite.getWidth();
            var yRes = _sprite.getHeight();

            _canvas.width = 2 * _padding + _pixelSide * (xRes + yRes - 2) + _gap * (xRes + yRes - 2) + _pixelWidth;
            _canvas.height = 2 * _padding + _offset * (xRes + yRes) + (_gap / 2) * (xRes + yRes - 2) + _pixelHeight - 1;

            _pixelDrawer = new PixelDrawer(_ctx, _canvas.width, _canvas.height);

            var offset = {
                x: _padding,
                y: _padding + (xRes - 1) * _offset + (_gap / 2) * (xRes - 1) - 1
            };

            _pixelTemplate = createTemplate();
            _pixelTemplate.setPaletteLookUpPattern(_paletteManager.getPattern());

            for (var y = 0; y < yRes; y++) {
                for (var x = xRes - 1; x >= 0; x--) {
                    template2pixel(offset.x + (x + y) * _distance, offset.y + (y * 0.5 - x * 0.5) * _distance, _sprite.getColor(x, y));
                }
            }

            _pixelDrawer.render();
        };

        this.renderVertical = function() {
            var xRes = _sprite.getWidth();
            var yRes = _sprite.getHeight();

            _canvas.width = 2 * _padding + _pixelSide * (xRes - 1) + _gap * (xRes - 1) + _pixelWidth;
            _canvas.height = 2 * _padding + _offset * (xRes + 1) + (_gap / 2) * (xRes - 1) + _pixelHeight * yRes + (_gap) * (yRes - 1) - 1;

            _pixelDrawer = new PixelDrawer(_ctx, _canvas.width, _canvas.height);

            var offset = {
                x: _padding,
                y: _padding + (xRes - 1) * _offset + (_gap / 2) * (xRes - 1) - 1
            };

            _pixelTemplate = createTemplate();
            _pixelTemplate.setPaletteLookUpPattern(_paletteManager.getPattern());

            for (var y = yRes - 1; y >= 0; y--) {
                for (var x = xRes - 1; x >= 0; x--) {
                    template2pixel(offset.x + x * _distance, offset.y + (y - x * 0.5) * _distance, _sprite.getColor(x, y));
                }
            }

            _pixelDrawer.render();
        };

        function _setPixelSize(value) {
            _pixelSide = value % 2 === 0 ? value : value - 1 || 32;
            _pixelHeight = _pixelSide;
            _pixelWidth = _pixelSide * 2 - 1;
            _offset = _pixelSide / 2;
            _distance = _pixelSide + _gap;
        }

        function _setPixelGap(value) {
            _gap = value % 2 === 0 ? value : value - 1 || 0;
            _distance = _pixelSide + _gap;
        }

        function createTemplate() {
            var pixelTemplate = new PixelTemplate(_pixelWidth, _pixelHeight + _pixelSide);

            var x = 0;
            var y = _pixelSide + _offset;

            pixelTemplate.setValue(Pix.LEFT);
            for (var i = 1; i < _pixelHeight; i++) {
                pixelTemplate.moveTo(x, y + i - _pixelHeight);
                pixelTemplate.drawSlantedLineDown(_pixelSide);
            }

            pixelTemplate.setValue(Pix.RIGHT);
            for (i = 1; i < _pixelHeight; i++) {
                pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 + i - _pixelHeight);
                pixelTemplate.drawSlantedLineUp(_pixelSide);
            }

            pixelTemplate.setValue(Pix.TOP);
            for (i = 1; i < _pixelSide - 1; i++) {
                pixelTemplate.moveTo(x + i * 2, y - _pixelHeight);
                pixelTemplate.drawSlantedLineUp(_pixelSide - i - 1);
                pixelTemplate.moveTo(x + i * 2, y - _pixelHeight);
                pixelTemplate.drawSlantedLineDown(_pixelSide - i - 1);
            }

            pixelTemplate.setValue(Pix.OUTLINE);

            pixelTemplate.moveTo(x, y);
            pixelTemplate.drawSlantedLineDown(_pixelSide);
            pixelTemplate.moveRelativeTo(-1, -1);
            pixelTemplate.drawSlantedLineUp(_pixelSide);

            pixelTemplate.moveTo(x, y - _pixelHeight);
            pixelTemplate.drawVerticalLine(_pixelHeight);

            pixelTemplate.moveTo(x + _pixelWidth - 1, y - _pixelHeight);
            pixelTemplate.drawVerticalLine(_pixelHeight);

            pixelTemplate.moveTo(x, y - _pixelHeight);
            pixelTemplate.drawSlantedLineUp(_pixelSide);
            pixelTemplate.moveRelativeTo(-1, 1);
            pixelTemplate.drawSlantedLineDown(_pixelSide);

            pixelTemplate.setValue(Pix.HIGHLIGHT);

            pixelTemplate.moveTo(x + 2, y - _pixelHeight + 1);
            pixelTemplate.drawSlantedLineDown(_pixelSide - 2);
            pixelTemplate.moveRelativeTo(-1, -1);
            pixelTemplate.drawSlantedLineUp(_pixelSide - 2);
            pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
            pixelTemplate.drawVerticalLine(_pixelHeight);

            pixelTemplate.setValue(Pix.CORNERHIGHLIGHT);

            pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
            pixelTemplate.drawVerticalLine(3);
            pixelTemplate.moveTo(x + _pixelSide - 2, y + _offset - 1 - _pixelHeight);
            pixelTemplate.drawHorizontalLine(3);

            return pixelTemplate;
        }

        function template2pixel(originX, originY, color) {
            if (!_paletteManager.isColorValid(color)) {
                return;
            }

            var pixel = _pixelTemplate.getColorizedTemplate(_paletteManager.getPalette(color));

            for (var x = 0; x < _pixelTemplate.getWidth(); x++) {
                for (var y = 0; y < _pixelTemplate.getHeight(); y++) {
                    var tempColor = pixel[_pixelTemplate.getWidth() * y + x];
                    if (tempColor) {
                        _pixelDrawer.setPixel(originX + x, originY + y, tempColor);
                    }
                }
            }
        }

    }

    return Pixify;

})();
var Sprite = (function() {

    function Sprite(image) {
        this._spriteCanvas = document.createElement('canvas');
        this._spriteCtx = this._spriteCanvas.getContext('2d');
        this._xRes = image.width;
        this._yRes = image.height;

        this._spriteCanvas.width = this._xRes;
        this._spriteCanvas.height = this._yRes;
        this._spriteCtx.drawImage(image, 0, 0, this._xRes, this._yRes);

        this._colorLUT = {};
    }

    Sprite.prototype.getWidth = function() {
        return this._xRes;
    };

    Sprite.prototype.getHeight = function() {
        return this._yRes;
    };

    Sprite.prototype.getColor = function(x, y) {
        var imData = this._spriteCtx.getImageData(x, y, 1, 1).data;
        return new ColorRGB(imData[0] / 255, imData[1] / 255, imData[2] / 255, imData[3] / 255);
    };

    return Sprite;

})();