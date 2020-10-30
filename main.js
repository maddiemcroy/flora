let flowers = [];
let backgroundColor;
let colorOptions = [];
let mic;
let volume = 0;

function setup() {
    getAudioContext().suspend();
    mic = new p5.AudioIn();

    colorMode(HSB, 360, 100, 100);
    createCanvas(window.innerWidth, window.innerHeight);
    noStroke();

    const rootColor = color(random(0, 360), random(25, 80), random(75, 85));
    colorOptions.push(rootColor);
    for (let i = 0; i < 5; i++) {
        console.log(colorOptions);
        colorOptions.push(spinHue(colorOptions[i], 25));
    }

    backgroundColor = color(hue(rootColor), saturation(rootColor), brightness(90));
    

    const totalFlowers = 200;
    const variance = 25;
    const padding = 30;

    for (let i = 0; i < sqrt(totalFlowers); i++) {
        for (let j = 0; j < sqrt(totalFlowers); j++) {
            let centerX = i/sqrt(totalFlowers)*(window.innerWidth + padding);
            let centerY = j/sqrt(totalFlowers)*(window.innerHeight + padding);
            let randomCol = colorOptions[int(random(0,colorOptions.length))];
            let flower = new Flower(random(centerX - variance, centerX + variance), random(centerY - variance, centerY + variance), randomCol, int(random(150, 300)), int(random(0, 2)));
            flowers.push(flower);
            }
        }
  }

function mousePressed() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
        mic.start();
    }
}
  
function draw() {
    if (getAudioContext().state === 'running') {
        if (mic.getLevel() > 0.05) {
            if (volume < mic.getLevel() * 50) {
                volume = mic.getLevel() * 50;
            }
        } else {
            if (volume > 0.5) {
                volume -= 0.5;
            }
        }

        background(backgroundColor);
        flowers.forEach(f => {
            if (f.isHovered()) {
                f.rotation = (f.rotation + (2 * f.direction))%360;
                f.col = spinHue(f.col, 3);
                f.innerCol = spinHue(f.innerCol, 3);
                if (f.size < f.initialSize*2) {
                    f.size = f.size + 5;
                }
            } else {
                f.rotation = (f.rotation + ((0.25 + volume) * f.direction))%360;
                if (f.col.toString() !== f.initialCol.toString()) {
                    f.col = spinHue(f.col, 3);
                    f.innerCol = spinHue(f.innerCol, 3);
                }
                if (f.size !== f.initialSize) {
                    f.size = f.size - 1;
                }
            }
            f.draw();
        })
    } else {
        fill(0);
        textAlign(CENTER);
        textSize(32);
        text('click to start', width/2, height/2);
    }
    
}

function spinHue(col, change) {
    return color((hue(col) + change)%360, saturation(col), brightness(col));
}

function randomSign() {
    return 1 - (round(random(0, 1)) * 2);
}

class Flower {
    constructor(x, y, col, size, type) {
        this.x = x;
        this.y = y;
        this.col = col;
        this.initialCol = col.toString();
        this.size = size;
        this.initialSize = size;
        this.type = type;
        this.rotation = 0;
        this.direction = randomSign();
        
        this.bounds = {
            top: y + (this.size/3.0),
            bottom: y - (this.size/3.0),
            left: x - (this.size/3.0),
            right: x + (this.size/3.0)
        }

        this.innerCol = colorOptions[int(random(0, colorOptions.length))];
    }

    draw() {
        fill(this.col);
        push();
        translate(this.x, this.y);
        switch(this.type) {
            case 0:
                rotate(radians(this.rotation));
                ellipse(0, 0, this.size*0.2, this.size);

                for (let i = 0; i < 5; i++) {
                    rotate(radians(30));
                    ellipse(0, 0, this.size*0.2, this.size);
                }

                rotate(radians(15));
                fill(this.innerCol);
                ellipse(0, 0, this.size*0.2, this.size*0.9);

                for (let i = 0; i < 5; i++) {
                    rotate(radians(30));
                    ellipse(0, 0, this.size*0.2, this.size*0.9);
                }
                break;

            case 1:
                rotate(radians(this.rotation));
                let petalSize = this.size/5;
                ellipse(0, -petalSize*0.8, petalSize, petalSize);

                for (let i = 0; i < 4; i++) {
                    rotate(radians(72));
                    ellipse(0, -petalSize*0.8, petalSize, petalSize);
                }
                fill(this.innerCol);
                ellipse(0, 0, petalSize, petalSize);
                break;

            case 2:
                rotate(radians(this.rotation));
                ellipse(0, 0, this.size*0.2, this.size);
                for (let i = 0; i < 4; i++) {
                    rotate(radians(72));
                    ellipse(0, 0, this.size*0.2, this.size);
                }
        }
        pop();
    }

    isHovered() {
        if (
            mouseX >= this.bounds.left &&
            mouseX <= this.bounds.right &&
            mouseY >= this.bounds.bottom &&
            mouseY <= this.bounds.top
        ) {
            return true;
        }
        return false;
    }
}