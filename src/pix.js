window.Pix = (function() {

    return {
        // Pixel Sections
        CORNERHIGHLIGHT: 0,
        LEFT: 1,
        RIGHT: 2,
        TOP: 3,
        OUTLINE: 4,
        HIGHLIGHT: 5,
        TRANSPARENT: 6,
        // Sun Positions
        SUN_LEFT: 0,
        SUN_RIGHT: 1,
        SUN_TOP_RIGHT: 2,
        SUN_TOP_LEFT: 3,
        paletteLookUpPatterns: [{
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
        }]
    };

})();