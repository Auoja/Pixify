var Palette = (function() {

    /**
     * Color palette.
     *
     * @class Palette
     * @constructor
     *
     * @param {ColorRGB} color The base color of the palette.
     */
    function Palette(color) {
        var hslColor = color.getHSL();

        /**
         * The color of the base side.
         * @property normalSide
         * @type ColorRGB
         */
        this.normalSide = color;
        /**
         * The color of the dark side.
         * @property darkSide
         * @type ColorRGB
         */
        this.darkSide = hslColor.darken(30).getRGB();
        /**
         * The color of the darkest side.
         * @property darkestSide
         * @type ColorRGB
         */
        this.darkestSide = hslColor.darken(60).getRGB();
        /**
         * The color of the highlight.
         * @property highlight
         * @type ColorRGB
         */
        this.highlight = hslColor.lighten(30).getRGB();
        /**
         * The color of the corner highlight.
         * @property cornerHighlight
         * @type ColorRGB
         */
        this.cornerHighlight = hslColor.lighten(80).getRGB();
        /**
         * The color of the outline.
         * @property outline
         * @type ColorRGB
         */
        this.outline = hslColor.darken(90).getRGB();
    }

    return Palette;

})();