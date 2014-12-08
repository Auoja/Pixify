var PaletteManager = (function() {

    function PaletteManager() {
        var _colorLUT = {};
        var _paletteLookUpPatterns = [{
            // Left
            topSide: 'darkSide',
            leftSide: 'normalSide',
            rightSide: 'darkestSide'
        }, {
            // Right
            topSide: 'darkSide',
            leftSide: 'darkestSide',
            rightSide: 'normalSide'
        }, {
            // Top Right
            topSide: 'normalSide',
            leftSide: 'darkestSide',
            rightSide: 'darkSide'
        }, {
            // Top Left
            topSide: 'normalSide',
            leftSide: 'darkSide',
            rightSide: 'darkestSide'
        }];

        var _paletteLookUpPattern = _paletteLookUpPatterns[Pix.SUN_TOP_LEFT];

        // Private
        function _getPalette(color) {
            var palette = null;

            if (!_colorLUT[color]) {
                if (color.a !== 0) {
                    var hslColor = color.getHSL();
                    palette = {
                        'normalSide': color,
                        'darkSide': hslColor.darken(30).getRGB(),
                        'darkestSide': hslColor.darken(60).getRGB(),
                        'highlight': hslColor.lighten(30).getRGB(),
                        'cornerHighlight': hslColor.lighten(80).getRGB(),
                        'outline': hslColor.darken(90).getRGB()
                    };
                }
                _colorLUT[color] = palette;
            }
            return _colorLUT[color];
        }

        // Public
        this.isColorValid = function(color) {
            var palette = _getPalette(color);
            if (palette === null) {
                return false;
            }
            return true;
        };

        this.getPattern = function() {
            return _paletteLookUpPattern;
        };

        this.getTopColor = function(color) {
            return _getPalette(color)[_paletteLookUpPattern.topSide];
        };

        this.getLeftColor = function(color) {
            return _getPalette(color)[_paletteLookUpPattern.leftSide];
        };

        this.getRightColor = function(color) {
            return _getPalette(color)[_paletteLookUpPattern.rightSide];
        };

        this.getOutlineColor = function(color) {
            return _getPalette(color).outline;
        };

        this.getHightLightColor = function(color) {
            return _getPalette(color).highlight;
        };

        this.getCornerHightlightColor = function(color) {
            return _getPalette(color).cornerHighlight;
        };

        this.getPalette = function(color) {
            return _getPalette(color);
        };

        this.setSunPosition = function(position) {
            if (_paletteLookUpPatterns[position]) {
                _paletteLookUpPattern = _paletteLookUpPatterns[position];
            }
        };

    }

    return PaletteManager;

})();