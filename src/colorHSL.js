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