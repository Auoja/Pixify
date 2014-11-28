function Sprite(image) {
    this._spriteCanvas = document.createElement('canvas');
    this._spriteCtx = this._spriteCanvas.getContext('2d');
    this._xRes = image.width;
    this._yRes = image.height;

    this._spriteCanvas.width = this._xRes;
    this._spriteCanvas.height = this._yRes;
    this._spriteCtx.drawImage(image, 0, 0, this._xRes, this._yRes);

    this._colorLUT = {};
}

Sprite.prototype.getWidth = function() {
    return this._xRes;
};

Sprite.prototype.getHeight = function() {
    return this._yRes;
};

Sprite.prototype.getColor = function(x, y) {
    var imData = this._spriteCtx.getImageData(x, y, 1, 1).data;
    return new ColorRGB(imData[0] / 255, imData[1] / 255, imData[2] / 255, imData[3] / 255);
};