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