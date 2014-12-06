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
        var hash = palette.normalSide.getHash();

        if (!this._templateLUT[hash]) {
            for (var i = 0; i < this._template.getTemplate().length; i++) {
                switch (this._template.getTemplate()[i]) {
                    case "left":
                        colorized[i] = palette[this._paletteLookUpPattern.leftSide];
                        break;
                    case "right":
                        colorized[i] = palette[this._paletteLookUpPattern.rightSide];
                        break;
                    case "top":
                        colorized[i] = palette[this._paletteLookUpPattern.topSide];
                        break;
                    case "outline":
                        colorized[i] = palette.outline;
                        break;
                    case "highlight":
                        colorized[i] = palette.highlight;
                        break;
                    case "cornerhighlight":
                        colorized[i] = palette.cornerHighlight;
                        break;
                    case "nothing":
                        colorized[i] = this._transparentColor;
                }
            }
            this._templateLUT[hash] = colorized;
        }

        return this._templateLUT[hash];
    };

    return TemplateManager;

})();