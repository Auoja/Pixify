(function(window) {

    function Pixify(canvas) {
        var _canvas = canvas;
        var _ctx = _canvas.getContext('2d');

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

        this.pixel2pixel = function(x, y, color) {
            var height = 80;
            var palette = getColorPalette(color);
            // TODO: Calculate relationship
            var width = 83;
            var halfWidth = (width - 3) / 2 + 2;
            var offset = halfWidth / 2;

            var topLeft = {
                _x: x,
                _y: y + offset
            };
            var topTop = {
                _x: x + halfWidth,
                _y: y
            };
            var topRight = {
                _x: x + width,
                _y: y + offset
            };
            var topBottom = {
                _x: x + halfWidth,
                _y: y + offset * 2
            };
            var bottomLeft = {
                _x: x,
                _y: y + offset + height
            };
            var bottomBottom = {
                _x: x + halfWidth,
                _y: y + offset * 2 + height
            };
            var bottomRight = {
                _x: x + width,
                _y: y + offset + height
            };

            // Top face
            _ctx.fillStyle = palette.top;
            _ctx.beginPath();
            _ctx.moveTo(topLeft._x, topLeft._y);
            _ctx.lineTo(topTop._x, topTop._y);
            _ctx.lineTo(topRight._x, topRight._y);
            _ctx.lineTo(topBottom._x, topBottom._y);
            _ctx.closePath();
            _ctx.fill();

            // Left face
            _ctx.fillStyle = palette.left;
            _ctx.beginPath();
            _ctx.moveTo(topLeft._x, topLeft._y);
            _ctx.lineTo(topBottom._x, topBottom._y);
            _ctx.lineTo(bottomBottom._x, bottomBottom._y);
            _ctx.lineTo(bottomLeft._x, bottomLeft._y);
            _ctx.closePath();
            _ctx.fill();

            // Right face
            _ctx.fillStyle = palette.right;
            _ctx.beginPath();
            _ctx.moveTo(topBottom._x, topBottom._y);
            _ctx.lineTo(topRight._x, topRight._y);
            _ctx.lineTo(bottomRight._x, bottomRight._y);
            _ctx.lineTo(bottomBottom._x, bottomBottom._y);

            _ctx.closePath();
            _ctx.fill();

            // Outer line
            _ctx.strokeStyle = palette.outline;
            _ctx.beginPath();
            _ctx.moveTo(topLeft._x, topLeft._y);
            _ctx.lineTo(topTop._x, topTop._y);
            _ctx.lineTo(topRight._x, topRight._y);
            _ctx.lineTo(bottomRight._x, bottomRight._y);
            _ctx.lineTo(bottomBottom._x, bottomBottom._y);
            _ctx.lineTo(bottomLeft._x, bottomLeft._y);
            _ctx.closePath();
            _ctx.stroke();

            // Highlight
            _ctx.strokeStyle = palette.highlight;
            _ctx.beginPath();
            _ctx.moveTo(topLeft._x, topLeft._y);
            _ctx.lineTo(topBottom._x, topBottom._y);
            _ctx.lineTo(topRight._x, topRight._y);
            _ctx.moveTo(topBottom._x, topBottom._y);
            _ctx.lineTo(bottomBottom._x, bottomBottom._y);
            _ctx.stroke();

        }
    }

    window.Pixify = Pixify;

})(this);