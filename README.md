# Pixify

Readme coming soon…

### Basic Usage

```javascript
    var image = new Image();

    image.onload = function() {
        var pix = new Pixify({
            canvas: document.getElementById('canvas'),
            image: image,
            pixelSide: 28,
            pixelGap: 4
        });
        pix.renderVertical();
    }

    image.src = 'foo.png';
```

### [Live Demo](http://auoja.github.io/Pixify/)
