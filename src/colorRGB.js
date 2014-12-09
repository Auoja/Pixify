var ColorRGB = (function() {

    /**
     * An RGB color object.
     *
     * @class ColorRGB
     * @constructor
     *
     * @param {Number} r Red
     * @param {Number} g Green
     * @param {Number} b Blue
     * @param {Number} a Alpha
     */
    function ColorRGB(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * Create a `ColorHSL` version of the `ColorRGB`
     *
     * @method getHSL
     * @return {ColorHSL} The HSL color representation.
     */
    ColorRGB.prototype.getHSL = function() {
        var max = Math.max(this.r, this.g, this.b);
        var min = Math.min(this.r, this.g, this.b);
        var h;
        var s;
        var l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
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

    /**
     * Get string representation of `ColorRGB`.
     * @method toString
     * @return {String} The string representation.
     */
    ColorRGB.prototype.toString = function() {
        return this.r + "-" + this.g + "-" + this.b + "-" + this.a;
    };

    return ColorRGB;

})();