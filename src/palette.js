var Palette = (function() {

    /**
     * Color palette.
     *
     * @public
     * @class Palette
     * @param {ColorRGB} color The base color of the palette.
     */
    function Palette(color) {
        var hslColor = color.getHSL();

        /**
         * The color of the base side.
         * @memberOf Palette
         * @property normalSide
         * @type ColorRGB
         */
        this.normalSide = color;
        /**
         * The color of the dark side.
         * @memberOf Palette
         * @property darkSide
         * @type ColorRGB
         */
        this.darkSide = hslColor.darken(30).getRGB();
        /**
         * The color of the darkest side.
         * @memberOf Palette
         * @property darkestSide
         * @type ColorRGB
         */
        this.darkestSide = hslColor.darken(60).getRGB();
        /**
         * The color of the highlight.
         * @memberOf Palette
         * @property highlight
         * @type ColorRGB
         */
        this.highlight = hslColor.lighten(30).getRGB();
        /**
         * The color of the corner highlight.
         * @memberOf Palette
         * @property cornerHighlight
         * @type ColorRGB
         */
        this.cornerHighlight = hslColor.lighten(80).getRGB();
        /**
         * The color of the outline.
         * @memberOf Palette
         * @property outline
         * @type ColorRGB
         */
        this.outline = hslColor.darken(90).getRGB();
    }

    return Palette;

})();