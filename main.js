/**
 * Created by braydenlemke on 12/2/16.
 */

var frames = 0,
    fish,
    canvas,
    renderingContext,
    width,
    height,
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    },
    pipes,
    currentState,
    foregroundPosition = 0,
    score = 0,
    passed = true,
    iteration = 0;

function PipeCollection() {
    this._pipes = [];

    /**
     * Empty pipes array
     */
    this.reset = function () {
        this._pipes = [];
    };

    /**
     * Creates and adds a new Pipe to the game.
     */
    this.add = function () {
        this._pipes.push(new Pipe()); // Create and push pipe to array
    };

    /**
     * Update the position of existing pipes and add new pipes when necessary.
     */
    this.update = function () {
        if (frames % 80 === 0) { // Add a new pipe to the game every 100 frames.
            this.add();
            passed = true;
        }

        for (var i = 0, len = this._pipes.length; i < len; i++) { // Iterate through the array of pipes and update each.
            var pipe = this._pipes[i]; // The current pipe.

            if (i === 0) { // If this is the leftmost pipe, it is the only pipe that the fish can collide with . . .
                pipe.detectCollision(); // . . . so, determine if the fish has collided with this leftmost pipe.
                if(fish.x > pipe.x) {
                    if(passed) {
                        passed = false;
                        iteration++;
                        score++;
                        if(iteration === 2) {
                            score = 1;
                        }
                        document.getElementById("score").innerHTML = "Score: " + score;
                    }
                }
            }

            pipe.x -= 4.05; // Each frame, move each pipe two pixels to the left. Higher/lower values change the movement speed.
            if (pipe.x < -pipe.width) { // If the pipe has moved off screen . . .
                this._pipes.splice(i, 1); // . . . remove it.
                i--;
                len--;
            }
        }
    };

    /**
     * Draw all pipes to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._pipes.length; i < len; i++) {
            var pipe = this._pipes[i];
            pipe.draw();
        }
    };
}

/**
 * The Pipe class. Creates instances of Pipe.
 */
function Pipe() {
    this.x = 1000;
    this.y = height - (bottomPipeSprite.height + foregroundSprite.height + 140 + 450 * Math.random());
    this.width = bottomPipeSprite.width;
    this.height = bottomPipeSprite.height;

    /**
     * Determines if the fish has collided with the Pipe.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
        // intersection
        var cx = Math.min(Math.max(fish.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(fish.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(fish.y, this.y + this.height + 140), this.y + 2 * this.height + 80);
        // Closest difference
        var dx = fish.x - cx;
        var dy1 = fish.y - cy1;
        var dy2 = fish.y - cy2;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = fish.radius * fish.radius;
        // Determine intersection
        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
        if(fish.y === 0) {
            currentState = states.Score;
        }
    };

    this.draw = function () {
        bottomPipeSprite.draw(renderingContext, this.x, this.y);
        topPipeSprite.draw(renderingContext, this.x, this.y + 140 + this.height);
    }
}

function Fish() {
    this.frame = 0;
    this.animation = [0, 1, 2, 1];
    this.x = 100;
    this.y = 50;
    this.rotation = 0;
    this.radius = 12;
    this.velocity = 0;

    this.gravity = 0.5;
    this._jump = 8;

    this.jump = function() {
        this.velocity = -this._jump;
    };

    this.update = function() {
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if(currentState === states.Splash) {
            this.updateIdleFish();
        } else {
            this.updatePlayingFish();
        }
    };

    this.updateIdleFish = function() {
        this.y = height - 400 + 15 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    this.updatePlayingFish = function() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if(this.y >= height - foregroundSprite.height - 30) {
            this.y = height - foregroundSprite.height - 30;
            if(currentState === states.Game) {
                currentState = states.Score;
            }
            this.velocity = this._jump;
        }

        if (this.y <= -100) {
            currentState = states.Score;
        }

        if(this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.3;
        }
    };

    this.draw = function() {
        renderingContext.save();

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        fishSprite[n].draw(renderingContext, -fishSprite[n].width / 2, -fishSprite[n].height / 2);
        renderingContext.restore();
    }
}

function main() {
    fish = new Fish();
    pipes = new PipeCollection();
    windowSetup();
    canvasSetup();
    loadGraphics();
    currentState = states.Splash;
    document.body.appendChild(canvas);

}

function windowSetup() {
    width = window.innerWidth;
    height = window.innerHeight;

    var inputEvent = "touchstart";
    if(width >= 500) {
        width = 800;
        height = 700;
        inputEvent = "mousedown";
    }

    document.addEventListener(inputEvent, onpress);
}

function onpress(event) {
    switch(currentState) {
        case states.Splash:
            currentState = states.Game;
            fish.jump();
            break;
        case states.Game:
            fish.jump();
            break;
        case states.Score:
            break;
    }
}

function canvasSetup() {
    canvas = document.createElement("canvas");

    canvas.style.border = "1px solid chartreuse";

    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    //initiate the sprite sheet
    var img = new Image();
    img.src = "spriteSheet-1.png";
    img.onload = function() {
        initSprites(this);
        renderingContext.fillStyle = "#8be4fd";
        gameLoop();
        //fishSprite[1].draw(renderingContext, 50, 50);
    };
}

function gameLoop() {
    update();
    render();

    window.requestAnimationFrame(gameLoop);
}

function update() {
    frames++;

    fish.update();
    // console.log(frames);

    if(currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 4) % 47;
    }

    if (currentState === states.Game) {
        pipes.update();
    }
}

function render() {
    renderingContext.fillRect(0, 0, width, height);
    //backgroundSprite.draw(renderingContext, 0, 150);
    pipes.draw(renderingContext);
    fish.draw(renderingContext);



    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height + 1);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height + 1);
    foregroundSprite.draw(renderingContext, foregroundPosition + (foregroundSprite.width * 2), height - foregroundSprite.height + 1);
}
