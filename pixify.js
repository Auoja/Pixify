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

function PaletteManager() {
    var _colorLUT = {};
    var _paletteLookUpPattern = {
        topSide: 'normalSide',
        leftSide: 'darkSide',
        rightSide: 'darkestSide'
    };

    // Private
    function _getPalette(color) {
        var hash = color.getHash();
        if (!_colorLUT[hash]) {
            var palette = null;
            if (color._a !== 0) {
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
            _colorLUT[hash] = palette;
        }
        return _colorLUT[hash];
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
        var palette = _getPalette(color);
        return palette[_paletteLookUpPattern.topSide];
    };

    this.getLeftColor = function(color) {
        var palette = _getPalette(color);
        return palette[_paletteLookUpPattern.leftSide];
    };

    this.getRightColor = function(color) {
        var palette = _getPalette(color);
        return palette[_paletteLookUpPattern.rightSide];
    };

    this.getOutlineColor = function(color) {
        var palette = _getPalette(color);
        return palette.outline;
    };

    this.getHightLightColor = function(color) {
        var palette = _getPalette(color);
        return palette.highlight;
    };

    this.getCornerHightlightColor = function(color) {
        var palette = _getPalette(color);
        return palette.cornerHighlight;
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
    if (x >= 0 && x < this._width && y >= 0 && y < this._height && color._a !== 0) {
        var index = (x + y * this._imageData.width) * 4;
        this._imageData.data[index + 0] = Math.round(color._r * 255);
        this._imageData.data[index + 1] = Math.round(color._g * 255);
        this._imageData.data[index + 2] = Math.round(color._b * 255);
        this._imageData.data[index + 3] = Math.round(color._a * 255);
    }
};

PixelDrawer.prototype.render = function() {
    this._context.putImageData(this._imageData, 0, 0);
};

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
    var _templateManager = new TemplateManager();

    var _pixelDrawer;

    this.setPixelSize = function(value) {
        _setPixelSize(value);
    };

    this.setPixelGap = function(value) {
        _setPixelGap(value);
    };

    this.setSunPosition = function(position) {
        _paletteManager.setSunPosition(position);
        _templateManager.setPaletteLookUpPattern(_paletteManager.getPattern());
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

        _templateManager.setTemplate(createTemplate());

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

        _templateManager.setTemplate(createTemplate());

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
        var _pixelTemplate = new PixelTemplate(_pixelWidth, _pixelHeight + _pixelSide);

        var x = 0;
        var y = _pixelSide + _offset;

        _pixelTemplate.setValue("left");
        for (var i = 1; i < _pixelHeight; i++) {
            _pixelTemplate.moveTo(x, y + i - _pixelHeight);
            _pixelTemplate.drawSlantedLineDown(_pixelSide);
        }

        _pixelTemplate.setValue("right");
        for (i = 1; i < _pixelHeight; i++) {
            _pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 + i - _pixelHeight);
            _pixelTemplate.drawSlantedLineUp(_pixelSide);
        }

        _pixelTemplate.setValue("top");
        for (i = 1; i < _pixelSide - 1; i++) {
            _pixelTemplate.moveTo(x + i * 2, y - _pixelHeight);
            _pixelTemplate.drawSlantedLineUp(_pixelSide - i - 1);
            _pixelTemplate.moveTo(x + i * 2, y - _pixelHeight);
            _pixelTemplate.drawSlantedLineDown(_pixelSide - i - 1);
        }

        _pixelTemplate.setValue("outline");

        _pixelTemplate.moveTo(x, y);
        _pixelTemplate.drawSlantedLineDown(_pixelSide);
        _pixelTemplate.moveRelativeTo(-1, -1);
        _pixelTemplate.drawSlantedLineUp(_pixelSide);

        _pixelTemplate.moveTo(x, y - _pixelHeight);
        _pixelTemplate.drawVerticalLine(_pixelHeight);

        _pixelTemplate.moveTo(x + _pixelWidth - 1, y - _pixelHeight);
        _pixelTemplate.drawVerticalLine(_pixelHeight);

        _pixelTemplate.moveTo(x, y - _pixelHeight);
        _pixelTemplate.drawSlantedLineUp(_pixelSide);
        _pixelTemplate.moveRelativeTo(-1, 1);
        _pixelTemplate.drawSlantedLineDown(_pixelSide);

        _pixelTemplate.setValue("highlight");

        _pixelTemplate.moveTo(x + 2, y - _pixelHeight + 1);
        _pixelTemplate.drawSlantedLineDown(_pixelSide - 2);
        _pixelTemplate.moveRelativeTo(-1, -1);
        _pixelTemplate.drawSlantedLineUp(_pixelSide - 2);
        _pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
        _pixelTemplate.drawVerticalLine(_pixelHeight);

        _pixelTemplate.setValue("cornerhighlight");

        _pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
        _pixelTemplate.drawVerticalLine(3);
        _pixelTemplate.moveTo(x + _pixelSide - 2, y + _offset - 1 - _pixelHeight);
        _pixelTemplate.drawHorizontalLine(3);

        return _pixelTemplate;
    }

    function template2pixel(originX, originY, color) {

        var pixel = [];

        if (!_paletteManager.isColorValid(color)) {
            return;
        }

        pixel = _templateManager.colorizeTemplate(_paletteManager.getPalette(color));

        for (var x = 0; x < _templateManager.getTemplate()._width; x++) {
            for (var y = 0; y < _templateManager.getTemplate()._height; y++) {
                var tempColor = pixel[_templateManager.getTemplate()._width * y + x];
                if (tempColor) {
                    _pixelDrawer.setPixel(originX + x, originY + y, tempColor);
                }
            }
        }
    }

}

window.Pixify = Pixify;
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
function TemplateManager() {
    this._template = {};
    this._templateLUT = {};
    this._paletteLookUpPattern = {
        topSide: 'normalSide',
        leftSide: 'darkSide',
        rightSide: 'darkestSide'
    };
    this._transparentColor = new ColorRGB(0, 0, 0, 0);
}

TemplateManager.prototype.setTemplate = function(template) {
    this._template = template;
};

TemplateManager.prototype.getTemplate = function() {
    return this._template;
};

TemplateManager.prototype.setPaletteLookUpPattern = function(pattern) {
    this._paletteLookUpPattern = pattern;
};

TemplateManager.prototype.colorizeTemplate = function(palette) {
    var colorized = [];
    var hash = palette.normalSide.getHash();

    if (!this._templateLUT[hash]) {
        for (var i = 0; i < this._template.getTemplate().length; i++) {
            switch (this._template.getTemplate()[i]) {
                case "left":
                    colorized[i] = palette[this._paletteLookUpPattern.leftSide];
                    break;
                case "right":
                    colorized[i] = palette[this._paletteLookUpPattern.rightSide];
                    break;
                case "top":
                    colorized[i] = palette[this._paletteLookUpPattern.topSide];
                    break;
                case "outline":
                    colorized[i] = palette.outline;
                    break;
                case "highlight":
                    colorized[i] = palette.highlight;
                    break;
                case "cornerhighlight":
                    colorized[i] = palette.cornerHighlight;
                    break;
                case "nothing":
                    colorized[i] = this._transparentColor;
            }
        }
        this._templateLUT[hash] = colorized;
    }

    return this._templateLUT[hash];
};