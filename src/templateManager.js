var TemplateManager = (function() {

    function TemplateManager() {
        this._template = {};
        this._templateLUT = {};
        this._paletteLookUpPattern = {
            topSide: 'normalSide',
            leftSide: 'darkSide',
            rightSide: 'darkestSide'
        };
        this._transparentColor = new ColorRGB(0, 0, 0, 0);
    }

    TemplateManager.prototype.setTemplate = function(template) {
        this._template = template;
    };

    TemplateManager.prototype.getTemplate = function() {
        return this._template;
    };

    TemplateManager.prototype.setPaletteLookUpPattern = function(pattern) {
        this._paletteLookUpPattern = pattern;
    };

    TemplateManager.prototype.colorizeTemplate = function(palette) {
        var colorized = [];
        var baseColor = palette.normalSide;

        if (!this._templateLUT[baseColor]) {
            for (var i = 0; i < this._template.getTemplate().length; i++) {
                switch (this._template.getTemplate()[i]) {
                    case Pix.LEFT:
                        colorized[i] = palette[this._paletteLookUpPattern.leftSide];
                        break;
                    case Pix.RIGHT:
                        colorized[i] = palette[this._paletteLookUpPattern.rightSide];
                        break;
                    case Pix.TOP:
                        colorized[i] = palette[this._paletteLookUpPattern.topSide];
                        break;
                    case Pix.OUTLINE:
                        colorized[i] = palette.outline;
                        break;
                    case Pix.HIGHLIGHT:
                        colorized[i] = palette.highlight;
                        break;
                    case Pix.CORNERHIGHLIGHT:
                        colorized[i] = palette.cornerHighlight;
                        break;
                    case Pix.TRANSPARENT:
                        colorized[i] = this._transparentColor;
                }
            }
            this._templateLUT[baseColor] = colorized;
        }

        return this._templateLUT[baseColor];
    };

    return TemplateManager;

})();