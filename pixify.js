(function(window) {

    function hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
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

    function rgbToString(rgb) {
        return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
    }

    function createCanvas() {
        return document.createElement('canvas');
    }

    function Pixify(canvas, image) {
        var _canvas = canvas;
        var _ctx = _canvas.getContext('2d');

        var _spriteCanvas = createCanvas();
        var _spriteCtx = _spriteCanvas.getContext('2d');
        var xRes = image.width;
        var yRes = image.height;

        _spriteCanvas.width = xRes;
        _spriteCanvas.height = yRes;
        _spriteCtx.drawImage(image, 0, 0, xRes, yRes);


        var _pixelWidth = 53;

        // _canvas.width = xRes * _pixelWidth + (xRes - 1) * horgap;
        console.log((_canvas.width - xRes * _pixelWidth) / (xRes - 1));
        // _pixelWidth = (_canvas.width - 10 * (xRes - 1)) / xRes

        // var _pixelWidth = 53;
        var _pixelHalfWidth = (_pixelWidth - 3) / 2 + 2
        var _pixelHeight = 50;
        var _gap = 0;

        var offset = _pixelHalfWidth / 2;

        var _topLeft = {
            _x: 0,
            _y: offset
        };
        var _topTop = {
            _x: _pixelHalfWidth,
            _y: 0
        };
        var _topRight = {
            _x: _pixelWidth,
            _y: offset
        };
        var _topBottom = {
            _x: _pixelHalfWidth,
            _y: offset * 2
        };
        var _bottomLeft = {
            _x: 0,
            _y: offset + _pixelHeight
        };
        var _bottomBottom = {
            _x: _pixelHalfWidth,
            _y: offset * 2 + _pixelHeight
        };
        var _bottomRight = {
            _x: _pixelWidth,
            _y: offset + _pixelHeight
        };

        var _distance = 45;//(_pixelHalfWidth) + _gap;

        // for (var i = 0; i < _spriteCanvas.width; i++) {
        for (var j = 0; j < _spriteCanvas.height; j++) {
            for (var i = _spriteCanvas.width; i >= 0; i--) {
                //     for (var j = _spriteCanvas.height; j >= 0; j--) {
                var data = _spriteCtx.getImageData(i, j, 1, 1).data;
                pixel2pixel((i + j) * _distance, 300 + (j * 0.5  - i * 0.5) * _distance, [data[0], data[1], data[2]]);
            }
        }

        function getColorPalette(color) {
            var hslColor = rgbToHsl(color[0], color[1], color[2]);
            return {
                top: rgbToString(color),
                left: rgbToString(hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.7)),
                right: rgbToString(hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.4)),
                highlight: rgbToString(hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 1.8)),
                outline: rgbToString(hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.1))
            }
        }

        function pixel2pixel(x, y, color) {
            if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
                return;
            }

            var palette = getColorPalette(color);



            // Top face
            _ctx.fillStyle = palette.top;
            _ctx.beginPath();
            _ctx.moveTo(x + _topLeft._x, y + _topLeft._y);
            _ctx.lineTo(x + _topTop._x, y + _topTop._y);
            _ctx.lineTo(x + _topRight._x, y + _topRight._y);
            _ctx.lineTo(x + _topBottom._x, y + _topBottom._y);
            _ctx.closePath();
            _ctx.fill();

            // Left face
            _ctx.fillStyle = palette.left;
            _ctx.beginPath();
            _ctx.moveTo(x + _topLeft._x, y + _topLeft._y);
            _ctx.lineTo(x + _topBottom._x, y + _topBottom._y);
            _ctx.lineTo(x + _bottomBottom._x, y + _bottomBottom._y);
            _ctx.lineTo(x + _bottomLeft._x, y + _bottomLeft._y);
            _ctx.closePath();
            _ctx.fill();

            // Right face
            _ctx.fillStyle = palette.right;
            _ctx.beginPath();
            _ctx.moveTo(x + _topBottom._x, y + _topBottom._y);
            _ctx.lineTo(x + _topRight._x, y + _topRight._y);
            _ctx.lineTo(x + _bottomRight._x, y + _bottomRight._y);
            _ctx.lineTo(x + _bottomBottom._x, y + _bottomBottom._y);

            _ctx.closePath();
            _ctx.fill();

            // Outer line
            _ctx.strokeStyle = palette.outline;
            _ctx.beginPath();
            _ctx.moveTo(x + _topLeft._x, y + _topLeft._y);
            _ctx.lineTo(x + _topTop._x, y + _topTop._y);
            _ctx.lineTo(x + _topRight._x, y + _topRight._y);
            _ctx.lineTo(x + _bottomRight._x, y + _bottomRight._y);
            _ctx.lineTo(x + _bottomBottom._x, y + _bottomBottom._y);
            _ctx.lineTo(x + _bottomLeft._x, y + _bottomLeft._y);
            _ctx.closePath();
            _ctx.stroke();

            // Highlight
            _ctx.strokeStyle = palette.highlight;
            _ctx.beginPath();
            _ctx.moveTo(x + _topLeft._x, y + _topLeft._y);
            _ctx.lineTo(x + _topBottom._x, y + _topBottom._y);
            _ctx.lineTo(x + _topRight._x, y + _topRight._y);
            _ctx.moveTo(x + _topBottom._x, y + _topBottom._y);
            _ctx.lineTo(x + _bottomBottom._x, y + _bottomBottom._y);
            _ctx.stroke();

        }
    }

    window.Pixify = Pixify;

})(this);