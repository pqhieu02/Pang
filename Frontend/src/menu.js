import {
    background,
    backgroundCanvas,
    MENU_FADE_OUT_DURATION,
    TYPE_CIRCLE,
    TYPE_HEXAGON,
    TYPE_SQUARE,
    TYPE_TRIANGLE,
} from "./constant.js";

const OBJECT_RETURN_BASE_LOCATION_SPEED = 0.05;

const ANGLE_ROTATE_SPEED = 0.5;

const TOTAL_WIDTH_OBJECT = 20;
const TOTAL_HEIGHT_OBJECT = 20;
const OBJECT_MASS_MAXIMUM = 15;
const OBJECT_MASS_MINIMUM = 5;

const MOUSE_MAX_RADIUS = 1000;
const MOUSE_MIN_RADIUS = 0;

const DISTANCE_BETWEEN_WIDTH_OBJECT =
    backgroundCanvas.width / TOTAL_WIDTH_OBJECT;
const DISTANCE_BETWEEN_HEIGHT_OBJECT =
    backgroundCanvas.height / TOTAL_HEIGHT_OBJECT;
const DEFAULT_SIZE =
    ((DISTANCE_BETWEEN_WIDTH_OBJECT + DISTANCE_BETWEEN_HEIGHT_OBJECT) / 2) *
    0.4;

const INITAL_X = DISTANCE_BETWEEN_WIDTH_OBJECT / 2;
const INITAL_Y = DISTANCE_BETWEEN_HEIGHT_OBJECT / 2;
const LAST_X = DISTANCE_BETWEEN_WIDTH_OBJECT * (TOTAL_WIDTH_OBJECT + 1);
const LAST_Y = DISTANCE_BETWEEN_HEIGHT_OBJECT * (TOTAL_HEIGHT_OBJECT + 1);

const DIRECTION_NORTH = 0;
const DIRECTION_NORTH_EAST = 1;
const DIRECTION_EAST = 2;
const DIRECTION_SOUTH_EAST = 3;
const DIRECTION_SOUTH = 4;
const DIRECTION_SOUTH_WEST = 5;
const DIRECTION_WEST = 6;
const DIRECTION_NORTH_WEST = 7;

const SHRINK_SPEED = DEFAULT_SIZE / ((MENU_FADE_OUT_DURATION * 60) / 1000);

var id;
var objects = [];
var mouse = {
    x: -backgroundCanvas.width,
    y: -backgroundCanvas.height,
    radius: 0,
};
var directions = {
    [DIRECTION_NORTH]: {
        x: 0,
        y: -0.25,
    },
    [DIRECTION_NORTH_EAST]: {
        x: 0.25,
        y: -0.25,
    },
    [DIRECTION_EAST]: {
        x: 0.25,
        y: 0,
    },
    [DIRECTION_SOUTH_EAST]: {
        x: 0.25,
        y: 0.25,
    },
    [DIRECTION_SOUTH]: {
        x: 0,
        y: 0.25,
    },
    [DIRECTION_SOUTH_WEST]: {
        x: -0.25,
        y: 0.25,
    },
    [DIRECTION_WEST]: {
        x: -0.25,
        y: 0,
    },
    [DIRECTION_NORTH_WEST]: {
        x: -0.25,
        y: -0.25,
    },
};

var velocity = {
    x: 0,
    y: 0,
};

var directionItv;

var shouldShrink = false;

class GameObject {
    constructor(x, y, size, color, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.type = type;

        this.baseX = x;
        this.baseY = y;
        this.mass =
            Math.random() * (OBJECT_MASS_MAXIMUM - OBJECT_MASS_MINIMUM) +
            OBJECT_MASS_MINIMUM;
        this.distance = null;
        this.angle = 0;
    }

    update() {
        const getDistance = (a, b, c, d) => {
            let X = a - c;
            let Y = b - d;
            let distance = Math.sqrt(X * X + Y * Y) + 1e-5;
            return distance;
        };

        const getSpeed = (a, b, c, d) => {
            let X = c - a;
            let Y = d - b;
            let speed = {
                x:
                    (X / this.distance) *
                    ((mouse.radius - this.distance) / mouse.radius),
                y:
                    (Y / this.distance) *
                    ((mouse.radius - this.distance) / mouse.radius),
            };
            return speed;
        };

        let shouldClockwise = velocity.x >= 0 ? 1 : -1;
        this.angle = (this.angle + ANGLE_ROTATE_SPEED * shouldClockwise) % 360;

        this.size = shouldShrink
            ? Math.max(this.size - SHRINK_SPEED, 0)
            : this.size;

        this.baseX += velocity.x;
        this.baseY += velocity.y;
        this.x += velocity.x;
        this.y += velocity.y;

        if (this.baseX < -(INITAL_X + DISTANCE_BETWEEN_WIDTH_OBJECT)) {
            this.baseX = LAST_X - DISTANCE_BETWEEN_WIDTH_OBJECT / 2;
            this.x = this.baseX;
        }
        if (this.baseX > LAST_X + DISTANCE_BETWEEN_WIDTH_OBJECT / 2) {
            this.baseX = -INITAL_X;
            this.x = this.baseX;
        }

        if (this.baseY < -(INITAL_Y + DISTANCE_BETWEEN_HEIGHT_OBJECT)) {
            this.baseY = LAST_Y - DISTANCE_BETWEEN_HEIGHT_OBJECT / 2;
            this.y = this.baseY;
        }
        if (this.baseY > LAST_Y + DISTANCE_BETWEEN_HEIGHT_OBJECT / 2) {
            this.baseY = -INITAL_Y;
            this.y = this.baseY;
        }

        this.distance = getDistance(this.x, this.y, mouse.x, mouse.y);
        if (this.distance < mouse.radius) {
            let speed = getSpeed(mouse.x, mouse.y, this.x, this.y);
            this.x += speed.x * this.mass;
            this.y += speed.y * this.mass;
        }
        if (this.distance > mouse.radius) {
            let limitX =
                ((this.x - mouse.x) / this.distance) * mouse.radius + mouse.x;
            let limitY =
                ((this.y - mouse.y) / this.distance) * mouse.radius + mouse.y;
            /**
             * this.x + X = baseX
             *  => this.x = baseX - X (1)
             * dx = this.x - baseX
             *  => this.x = dx + baseX (2)
             *
             * (1)(2)
             * baseX - X = dx + baseX
             *  => X = -dx
             *
             * ==> this.x - dx = baseX
             */
            let dx = this.x - this.baseX;
            let dy = this.y - this.baseY;

            this.x -= dx * OBJECT_RETURN_BASE_LOCATION_SPEED;
            this.y -= dy * OBJECT_RETURN_BASE_LOCATION_SPEED;
            if (getDistance(this.x, this.y, mouse.x, mouse.y) < mouse.radius) {
                this.x = limitX;
                this.y = limitY;
            }
        }
    }

    render() {
        let radian = (this.angle * Math.PI) / 180;

        background.beginPath();
        background.fillStyle = this.color;
        background.transform(
            Math.cos(radian),
            Math.sin(radian),
            Math.sin(radian),
            -Math.cos(radian),
            this.x,
            this.y
        );
        switch (this.type) {
            case TYPE_HEXAGON: {
                let a = (2 * Math.PI) / 6;
                let height = this.size / 2;
                let centerToVertices = height / (Math.sqrt(3) / 2);
                for (let i = 0; i < 6; i++) {
                    background.lineTo(
                        centerToVertices * Math.cos(a * i),
                        centerToVertices * Math.sin(a * i)
                    );
                }
                break;
            }
            case TYPE_SQUARE: {
                background.rect(
                    -this.size / 2,
                    -this.size / 2,
                    this.size,
                    this.size
                );
                break;
            }
            case TYPE_TRIANGLE: {
                let height = this.size * (Math.sqrt(3) / 2);
                let distanceFromCenterToVertex = (2 * height) / 3;
                let X = 0;
                let Y = -distanceFromCenterToVertex;

                background.moveTo(X, Y);
                background.lineTo(-this.size / 2, height / 3);
                background.lineTo(this.size / 2, height / 3);
                break;
            }
            case TYPE_CIRCLE: {
                background.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                break;
            }
        }
        background.fill();
        background.resetTransform();
    }
}

function randomBackgroundVelocityDirection() {
    let direction = Math.floor(Math.random() * 8);
    velocity = directions[direction];
}

function initMenu() {
    window.onmousemove = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    window.onwheel = (e) => {
        if (e.deltaY > 0) {
            mouse.radius = Math.max(MOUSE_MIN_RADIUS, mouse.radius - 100);
        } else {
            mouse.radius = Math.min(MOUSE_MAX_RADIUS, mouse.radius + 100);
        }
    };
    
    for (let i = -1; i < TOTAL_WIDTH_OBJECT + 1; i++)
        for (let j = -1; j < TOTAL_HEIGHT_OBJECT + 1; j++) {
            let X = INITAL_X + i * DISTANCE_BETWEEN_WIDTH_OBJECT;
            let Y = INITAL_Y + j * DISTANCE_BETWEEN_HEIGHT_OBJECT;
            let color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
                Math.random() * 255
            }, 0.3)`;
            let index = Math.floor(Math.random() * 4);
            let type;

            switch (Math.floor(index % 4)) {
                case 0: {
                    type = TYPE_SQUARE;
                    break;
                }
                case 1: {
                    type = TYPE_CIRCLE;
                    break;
                }
                case 2: {
                    type = TYPE_TRIANGLE;
                    break;
                }
                case 3: {
                    type = TYPE_HEXAGON;
                    break;
                }
            }
            let size = DEFAULT_SIZE;
            let object = new GameObject(X, Y, size, color, type);
            objects.push(object);
        }
    randomBackgroundVelocityDirection();
    directionItv = setInterval(randomBackgroundVelocityDirection, 3000);
    loop();
}

function loop() {
    background.fillStyle = "rgba(0, 0, 0, 1)";
    background.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    objects.forEach((object) => {
        object.update();
        object.render();
    });
    id = requestAnimationFrame(loop);
}

function endMenu() {
    const cleanEventHandler = () => {
        window.onmousemove = null;
        window.onwheel = null;
        clearInterval(directionItv);
    };

    cleanEventHandler();
    shouldShrink = true;
    mouse.x = backgroundCanvas.width / 2;
    mouse.y = backgroundCanvas.height / 2;
    mouse.radius = backgroundCanvas.width;
    mouse.radius = Math.max(backgroundCanvas.width, backgroundCanvas.height);
}

function cleanBackgroundCanvas() {
    background.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    cancelAnimationFrame(id);
}

export { initMenu, endMenu, cleanBackgroundCanvas };
