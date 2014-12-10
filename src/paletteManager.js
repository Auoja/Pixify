var PaletteManager = (function() {

    /**
     * Manages the palettes.
     *
     * @public
     * @class PaletteManager
     */
    function PaletteManager() {
        this._paletteLUT = {};
        this._paletteLookUpPattern = Pix.paletteLookUpPatterns[Pix.SUN_TOP_LEFT];
    }

    /**
     * Check if a color is valid by looking at the alpha channel.
     *
     * @method isColorValid
     * @memberOf PaletteManager
     * @param {ColorRGB} color The RGB color that should be evaluated.
     * @return {Boolean} If color is valid or not.
     */
    PaletteManager.prototype.isColorValid = function(color) {
        var palette = this.getPalette(color);
        if (palette === null) {
            return false;
        }
        return true;
    };

    /**
     * Get the palette look up pattern
     *
     * @method getPattern
     * @memberOf PaletteManager
     * @return {Object} The pattern.
     */
    PaletteManager.prototype.getPattern = function() {
        return this._paletteLookUpPattern;
    };

    /**
     * Get the top side version of the input color.
     *
     * @method getTopColor
     * @memberOf PaletteManager
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the top side.
     */
    PaletteManager.prototype.getTopColor = function(color) {
        return this.getPalette(color)[this._paletteLookUpPattern.topSide];
    };

    /**
     * Get the left side version of the input color.
     *
     * @method getLeftColor
     * @memberOf PaletteManager
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the left side.
     */
    PaletteManager.prototype.getLeftColor = function(color) {
        return this.getPalette(color)[this._paletteLookUpPattern.leftSide];
    };

    /**
     * Get the right side version of the input color.
     *
     * @method getRightColor
     * @memberOf PaletteManager
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the right side.
     */
    PaletteManager.prototype.getRightColor = function(color) {
        return this.getPalette(color)[this._paletteLookUpPattern.rightSide];
    };

    /**
     * Get the outline version of the input color.
     *
     * @method getOutlineColor
     * @memberOf PaletteManager
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the outline.
     */
    PaletteManager.prototype.getOutlineColor = function(color) {
        return this.getPalette(color).outline;
    };

    /**
     * Get the highlight version of the input color.
     *
     * @method getHightLightColor
     * @memberOf PaletteManager
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the highlight.
     */
    PaletteManager.prototype.getHightLightColor = function(color) {
        return this.getPalette(color).highlight;
    };

    /**
     * Get the corner highlight version of the input color.
     *
     * @method getCornerHightlightColor
     * @memberOf PaletteManager
     * @param {ColorRGB} color The input color.
     * @return {ColorRGB} The RGB color of the corner highlight.
     */
    PaletteManager.prototype.getCornerHightlightColor = function(color) {
        return this.getPalette(color).cornerHighlight;
    };



    /**
     * Get the palette of the input color.
     *
     * @method getPalette
     * @memberOf PaletteManager
     * @param {ColorRGB} color The input color.
     * @return {Palette|null} The palette generated from the input color or null if no palette can be generated.
     */
    PaletteManager.prototype.getPalette = function(color) {
        var palette = null;
        if (!this._paletteLUT[color]) {
            if (color.a !== 0) {
                palette = new Palette(color);
            }
            this._paletteLUT[color] = palette;
        }
        return this._paletteLUT[color];
    };

    /**
     * Set the sun position to change the palette look up pattern.
     *
     * @method setSunPosition
     * @memberOf PaletteManager
     * @param {Number} position The sun position.
     */
    PaletteManager.prototype.setSunPosition = function(position) {
        if (Pix.paletteLookUpPatterns[position]) {
            this._paletteLookUpPattern = Pix.paletteLookUpPatterns[position];
        }
    };

    return PaletteManager;

})();