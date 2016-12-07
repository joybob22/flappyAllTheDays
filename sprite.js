/**
 * Created by braydenlemke on 12/2/16.
 */


var fishSprite;
var backgroundSprite;
var foregroundSprite;
var topPipeSprite;
var bottomPipeSprite;
var okButtonSprite;

function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Sprite.prototype.draw = function(renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

function initSprites(img) {
    fishSprite = [
        new Sprite(img, 1, 311, 101, 69),
        new Sprite(img, 101, 311, 101, 69),
        new Sprite(img, 201, 311, 101, 69)
    ];

    bottomPipeSprite = new Sprite(img, 412, 218, 81, 741);
    topPipeSprite = new Sprite(img, 498, 219, 83, 664);
    //backgroundSprite = new Sprite(img, 45, 150, 100, 40);

    okButtonSprite = new Sprite(img, 17, 474, 114, 41);

    foregroundSprite = new Sprite(img, 13, 235, 288, 74);
}