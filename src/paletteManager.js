var PaletteManager = (function() {

    function PaletteManager() {
        var _colorLUT = {};
        var _paletteLookUpPattern = {
            topSide: 'normalSide',
            leftSide: 'darkSide',
            rightSide: 'darkestSide'
        };

        // Private
        function _getPalette(color) {
            var hash = color.getHash();
            if (!_colorLUT[hash]) {
                var palette = null;
                if (color._a !== 0) {
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
                _colorLUT[hash] = palette;
            }
            return _colorLUT[hash];
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
            var palette = _getPalette(color);
            return palette[_paletteLookUpPattern.topSide];
        };

        this.getLeftColor = function(color) {
            var palette = _getPalette(color);
            return palette[_paletteLookUpPattern.leftSide];
        };

        this.getRightColor = function(color) {
            var palette = _getPalette(color);
            return palette[_paletteLookUpPattern.rightSide];
        };

        this.getOutlineColor = function(color) {
            var palette = _getPalette(color);
            return palette.outline;
        };

        this.getHightLightColor = function(color) {
            var palette = _getPalette(color);
            return palette.highlight;
        };

        this.getCornerHightlightColor = function(color) {
            var palette = _getPalette(color);
            return palette.cornerHighlight;
        };

        this.getPalette = function(color) {
            return _getPalette(color);
        };

        this.setSunPosition = function(position) {
            switch (position) {
                case 'left':
                    _paletteLookUpPattern = {
                        topSide: 'darkSide',
                        leftSide: 'normalSide',
                        rightSide: 'darkestSide'
                    };
                    break;
                case 'right':
                    _paletteLookUpPattern = {
                        topSide: 'darkSide',
                        leftSide: 'darkestSide',
                        rightSide: 'normalSide'
                    };
                    break;
                case 'top-right':
                    _paletteLookUpPattern = {
                        topSide: 'normalSide',
                        leftSide: 'darkestSide',
                        rightSide: 'darkSide'
                    };
                    break;
                default:
                case 'top-left':
                    _paletteLookUpPattern = {
                        topSide: 'normalSide',
                        leftSide: 'darkSide',
                        rightSide: 'darkestSide'
                    };
            }
        };

    }

    return PaletteManager;

})();