var ColorRGB = (function() {

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

    return ColorRGB;

})();