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
