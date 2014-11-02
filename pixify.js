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

    function createCanvas() {
        return document.createElement('canvas');
    }

    function Pixify(canvas, image) {
        var _canvas = canvas;
        var _ctx = _canvas.getContext('2d');
        var _imageData = _ctx.createImageData(_canvas.width, _canvas.height);

        var _spriteCanvas = createCanvas();
        var _spriteCtx = _spriteCanvas.getContext('2d');
        var xRes = image.width;
        var yRes = image.height;

        _spriteCanvas.width = xRes;
        _spriteCanvas.height = yRes;
        _spriteCtx.drawImage(image, 0, 0, xRes, yRes);

        var _pixelHalfWidth = 46;
        var _pixelWidth = _pixelHalfWidth * 2 - 1;
        var _pixelHeight = 50;
        var _gap = 0;
        var _offset = _pixelHalfWidth / 2 - 1;

        var _distance = _pixelHalfWidth + _gap;

        for (var j = 0; j < _spriteCanvas.height; j++) {
            for (var i = _spriteCanvas.width; i >= 0; i--) {
                var data = _spriteCtx.getImageData(i, j, 1, 1).data;
                pixel2pixel((i + j) * _distance, 300 + (j * 0.5 - i * 0.5) * _distance, [data[0], data[1], data[2]]);
            }
        }

        _ctx.putImageData(_imageData, 0, 0);

        function setPixel(x, y, color) {
            if (x >= 0 && x < _canvas.width && y >= 0 && y < _canvas.height) {
                var index = (x + y * _imageData.width) * 4;
                _imageData.data[index + 0] = color[0];
                _imageData.data[index + 1] = color[1];
                _imageData.data[index + 2] = color[2];
                _imageData.data[index + 3] = 255;
            }
        }

        function drawSlantedLineUp(x, y, distance, color) {
            var start = x;
            while (x < start + distance) {
                setPixel(x, y, color);
                setPixel(x + 1, y, color);
                y--;
                x += 2;
            }
        }

        function drawSlantedLineDown(x, y, distance, color) {
            var start = x;
            while (x < start + distance) {
                setPixel(x, y, color);
                setPixel(x + 1, y, color);
                y++;
                x += 2;
            }
        }

        function drawVerticalLine(x, y, distance, color) {
            var start = y;
            while (y < start + distance) {
                setPixel(x, y, color);
                y++;
            }
        }

        function getColorPalette(color) {
            var hslColor = rgbToHsl(color[0], color[1], color[2]);
            return {
                top: color,
                left: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.7),
                right: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.4),
                highlight: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 1.8),
                outline: hslToRgb(hslColor[0], hslColor[1], hslColor[2] * 0.1)
            }
        }

        function pixel2pixel(x, y, color) {
            if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
                return;
            }

            var palette = getColorPalette(color);

            for (var i = 1; i < _pixelHeight; i++) {
                drawSlantedLineDown(x, y + _offset + i, _pixelHalfWidth, palette.left);
            }

            for (var i = 1; i < _pixelHeight; i++) {
                drawSlantedLineUp(x + _pixelHalfWidth - 1, y + _offset * 2 + i, _pixelHalfWidth, palette.right);
            }

            for (var i = 1; i < _pixelHalfWidth - 1; i++) {
                drawSlantedLineUp(x + i * 2, y + _offset, _pixelHalfWidth - i - 1, palette.top);
                drawSlantedLineDown(x + i * 2, y + _offset, _pixelHalfWidth - i - 1, palette.top);
            }

            drawSlantedLineUp(x, y + _offset, _pixelHalfWidth, palette.outline);
            drawSlantedLineDown(x + _pixelHalfWidth - 1, y, _pixelHalfWidth, palette.outline);
            drawSlantedLineDown(x + 2, y + _offset + 1, _pixelHalfWidth - 2, palette.highlight);
            drawSlantedLineUp(x + _pixelHalfWidth - 1, y + 2 * _offset, _pixelHalfWidth - 2, palette.highlight);

            drawVerticalLine(x, y + _offset, _pixelHeight, palette.outline);
            drawVerticalLine(x + _pixelHalfWidth - 1, y + 2 * _offset, _pixelHeight, palette.highlight);
            drawVerticalLine(x + _pixelWidth - 1, y + _offset, _pixelHeight, palette.outline);

            drawSlantedLineDown(x, y + _offset + _pixelHeight, _pixelHalfWidth, palette.outline);
            drawSlantedLineUp(x + _pixelHalfWidth - 1, y + _offset * 2 + _pixelHeight, _pixelHalfWidth, palette.outline);

        }
    }

    window.Pixify = Pixify;

})(this);