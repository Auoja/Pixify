window.Pixify = (function() {

    function Pixify(opts) {
        var _canvas = opts.canvas;
        var _ctx = _canvas.getContext('2d');

        var _padding = 10;

        var _pixelSide = 32;
        var _gap = 0;
        var _pixelHeight;
        var _pixelWidth;
        var _offset;
        var _distance;

        _setPixelSize(opts.pixelSide);
        _setPixelGap(opts.pixelGap);

        var _sprite = new Sprite(opts.image);

        var _paletteManager = new PaletteManager();
        var _templateManager = new TemplateManager();

        var _pixelDrawer;

        this.setPixelSize = function(value) {
            _setPixelSize(value);
        };

        this.setPixelGap = function(value) {
            _setPixelGap(value);
        };

        this.setSunPosition = function(position) {
            _paletteManager.setSunPosition(position);
            _templateManager.setPaletteLookUpPattern(_paletteManager.getPattern());
        };

        this.renderHorizontal = function() {
            var xRes = _sprite.getWidth();
            var yRes = _sprite.getHeight();

            _canvas.width = 2 * _padding + _pixelSide * (xRes + yRes - 2) + _gap * (xRes + yRes - 2) + _pixelWidth;
            _canvas.height = 2 * _padding + _offset * (xRes + yRes) + (_gap / 2) * (xRes + yRes - 2) + _pixelHeight - 1;

            _pixelDrawer = new PixelDrawer(_ctx, _canvas.width, _canvas.height);

            var offset = {
                x: _padding,
                y: _padding + (xRes - 1) * _offset + (_gap / 2) * (xRes - 1) - 1
            };

            _templateManager.setTemplate(createTemplate());

            for (var y = 0; y < yRes; y++) {
                for (var x = xRes - 1; x >= 0; x--) {
                    template2pixel(offset.x + (x + y) * _distance, offset.y + (y * 0.5 - x * 0.5) * _distance, _sprite.getColor(x, y));
                }
            }

            _pixelDrawer.render();
        };

        this.renderVertical = function() {
            var xRes = _sprite.getWidth();
            var yRes = _sprite.getHeight();

            _canvas.width = 2 * _padding + _pixelSide * (xRes - 1) + _gap * (xRes - 1) + _pixelWidth;
            _canvas.height = 2 * _padding + _offset * (xRes + 1) + (_gap / 2) * (xRes - 1) + _pixelHeight * yRes + (_gap) * (yRes - 1) - 1;

            _pixelDrawer = new PixelDrawer(_ctx, _canvas.width, _canvas.height);

            var offset = {
                x: _padding,
                y: _padding + (xRes - 1) * _offset + (_gap / 2) * (xRes - 1) - 1
            };

            _templateManager.setTemplate(createTemplate());

            for (var y = yRes - 1; y >= 0; y--) {
                for (var x = xRes - 1; x >= 0; x--) {
                    template2pixel(offset.x + x * _distance, offset.y + (y - x * 0.5) * _distance, _sprite.getColor(x, y));
                }
            }

            _pixelDrawer.render();
        };

        function _setPixelSize(value) {
            _pixelSide = value % 2 === 0 ? value : value - 1 || 32;
            _pixelHeight = _pixelSide;
            _pixelWidth = _pixelSide * 2 - 1;
            _offset = _pixelSide / 2;
            _distance = _pixelSide + _gap;
        }

        function _setPixelGap(value) {
            _gap = value % 2 === 0 ? value : value - 1 || 0;
            _distance = _pixelSide + _gap;
        }

        function createTemplate() {
            var _pixelTemplate = new PixelTemplate(_pixelWidth, _pixelHeight + _pixelSide);

            var x = 0;
            var y = _pixelSide + _offset;

            _pixelTemplate.setValue("left");
            for (var i = 1; i < _pixelHeight; i++) {
                _pixelTemplate.moveTo(x, y + i - _pixelHeight);
                _pixelTemplate.drawSlantedLineDown(_pixelSide);
            }

            _pixelTemplate.setValue("right");
            for (i = 1; i < _pixelHeight; i++) {
                _pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 + i - _pixelHeight);
                _pixelTemplate.drawSlantedLineUp(_pixelSide);
            }

            _pixelTemplate.setValue("top");
            for (i = 1; i < _pixelSide - 1; i++) {
                _pixelTemplate.moveTo(x + i * 2, y - _pixelHeight);
                _pixelTemplate.drawSlantedLineUp(_pixelSide - i - 1);
                _pixelTemplate.moveTo(x + i * 2, y - _pixelHeight);
                _pixelTemplate.drawSlantedLineDown(_pixelSide - i - 1);
            }

            _pixelTemplate.setValue("outline");

            _pixelTemplate.moveTo(x, y);
            _pixelTemplate.drawSlantedLineDown(_pixelSide);
            _pixelTemplate.moveRelativeTo(-1, -1);
            _pixelTemplate.drawSlantedLineUp(_pixelSide);

            _pixelTemplate.moveTo(x, y - _pixelHeight);
            _pixelTemplate.drawVerticalLine(_pixelHeight);

            _pixelTemplate.moveTo(x + _pixelWidth - 1, y - _pixelHeight);
            _pixelTemplate.drawVerticalLine(_pixelHeight);

            _pixelTemplate.moveTo(x, y - _pixelHeight);
            _pixelTemplate.drawSlantedLineUp(_pixelSide);
            _pixelTemplate.moveRelativeTo(-1, 1);
            _pixelTemplate.drawSlantedLineDown(_pixelSide);

            _pixelTemplate.setValue("highlight");

            _pixelTemplate.moveTo(x + 2, y - _pixelHeight + 1);
            _pixelTemplate.drawSlantedLineDown(_pixelSide - 2);
            _pixelTemplate.moveRelativeTo(-1, -1);
            _pixelTemplate.drawSlantedLineUp(_pixelSide - 2);
            _pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
            _pixelTemplate.drawVerticalLine(_pixelHeight);

            _pixelTemplate.setValue("cornerhighlight");

            _pixelTemplate.moveTo(x + _pixelSide - 1, y + _offset - 1 - _pixelHeight);
            _pixelTemplate.drawVerticalLine(3);
            _pixelTemplate.moveTo(x + _pixelSide - 2, y + _offset - 1 - _pixelHeight);
            _pixelTemplate.drawHorizontalLine(3);

            return _pixelTemplate;
        }

        function template2pixel(originX, originY, color) {

            var pixel = [];

            if (!_paletteManager.isColorValid(color)) {
                return;
            }

            pixel = _templateManager.colorizeTemplate(_paletteManager.getPalette(color));

            for (var x = 0; x < _templateManager.getTemplate()._width; x++) {
                for (var y = 0; y < _templateManager.getTemplate()._height; y++) {
                    var tempColor = pixel[_templateManager.getTemplate()._width * y + x];
                    if (tempColor) {
                        _pixelDrawer.setPixel(originX + x, originY + y, tempColor);
                    }
                }
            }
        }

    }

    return Pixify;

})();