import {
    BACKGROUND_TOTAL_OBJECT_X,
    BACKGROUND_TOTAL_OBJECT_Y,
    FADE_OUT_DURATION,
    OBJECT_TYPE,
} from "./constant.js";
import drawObject from "./lib/drawObject.js";

const OBJECT_SPEED_FACTOR_MAXIMUM = 15;
const OBJECT_SPEED_FACTOR_MINIMUM = 5;
const OBJECT_RETURN_BASE_LOCATION_SPEED = 0.05;
const ANGLE_ROTATION_SPEED = 1;

const MOUSE_MAX_RADIUS = 1000;
const MOUSE_MIN_RADIUS = 0;

const OBJECT_SPEED = 0.25;

const directions = [
    {
        x: 0,
        y: -1,
    },
    {
        x: 1,
        y: -1,
    },
    {
        x: 1,
        y: 0,
    },
    {
        x: 1,
        y: 1,
    },
    {
        x: 0,
        y: 1,
    },
    {
        x: -1,
        y: 1,
    },
    {
        x: -1,
        y: 0,
    },
    {
        x: -1,
        y: -1,
    },
];

var context = null;
var canvas = null;

var DISTANCE_BETWEEN_WIDTH_OBJECT;
var DISTANCE_BETWEEN_HEIGHT_OBJECT;
var DEFAULT_OBJECT_SIZE;
var SHRINK_SPEED;
var INITAL_X;
var INITAL_Y;
var LAST_X;
var LAST_Y;

var frameId = null;
var objects = null;
var mouse = null;
var velocity = null;
var directionItv = null;
var shouldShrink = null;

class GameObject {
    constructor(x, y, size, objectSpeedFactor, color, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.objectSpeedFactor = objectSpeedFactor;
        this.color = color;
        this.type = type;

        this.baseX = x;
        this.baseY = y;
        this.distance = null;
        this.angle = 0;
    }

    getSpeed(x0, y0, x1, y1) {
        let X = x1 - x0;
        let Y = y1 - y0;

        /**
         * (mouse.radius - this.distance) / mouse.radius is proportional to the distance between mouse and object
         * => object will move faster when near mouse and move slower when near the mouse
         */

        let speed = {
            x:
                (X / this.distance) *
                ((mouse.radius - this.distance) / mouse.radius),
            y:
                (Y / this.distance) *
                ((mouse.radius - this.distance) / mouse.radius),
        };
        return speed;
    }

    getDistance = (x0, y0, x1, y2) => {
        let X = x0 - x1;
        let Y = y0 - y2;
        let distance = Math.sqrt(X * X + Y * Y) + 1e-5;
        return distance;
    };

    update() {
        let shouldClockwise = velocity.x >= 0 ? 1 : -1;
        this.angle =
            (this.angle + ANGLE_ROTATION_SPEED * shouldClockwise) % 360;

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

        this.distance = this.getDistance(this.x, this.y, mouse.x, mouse.y);
        if (this.distance < mouse.radius) {
            let speed = this.getSpeed(mouse.x, mouse.y, this.x, this.y);
            this.x += speed.x * this.objectSpeedFactor;
            this.y += speed.y * this.objectSpeedFactor;
        }
        if (this.distance > mouse.radius) {
            let limitX =
                ((this.x - mouse.x) / this.distance) * mouse.radius + mouse.x;
            let limitY =
                ((this.y - mouse.y) / this.distance) * mouse.radius + mouse.y;
            // dx = baseX - this.x => this.x = baseX - dx
            let dx = this.baseX - this.x;
            let dy = this.baseY - this.y;

            this.x += dx * OBJECT_RETURN_BASE_LOCATION_SPEED;
            this.y += dy * OBJECT_RETURN_BASE_LOCATION_SPEED;
            if (
                this.getDistance(this.x, this.y, mouse.x, mouse.y) <
                mouse.radius
            ) {
                this.x = limitX;
                this.y = limitY;
            }
        }
    }

    render() {
        drawObject(context, this);
    }
}

function randomDirection() {
    let direction = Math.floor(Math.random() * directions.length);
    velocity.x = directions[direction].x * OBJECT_SPEED;
    velocity.y = directions[direction].y * OBJECT_SPEED;
}

function startMenu(target_context, target_canvas) {
    const initVariable = () => {
        context = target_context;
        canvas = target_canvas;

        DISTANCE_BETWEEN_WIDTH_OBJECT =
            canvas.width / BACKGROUND_TOTAL_OBJECT_X;
        DISTANCE_BETWEEN_HEIGHT_OBJECT =
            canvas.height / BACKGROUND_TOTAL_OBJECT_Y;
        DEFAULT_OBJECT_SIZE =
            Math.min(
                DISTANCE_BETWEEN_WIDTH_OBJECT,
                DISTANCE_BETWEEN_HEIGHT_OBJECT
            ) * 0.3;

        SHRINK_SPEED =
            DEFAULT_OBJECT_SIZE / ((FADE_OUT_DURATION * 60) / 1000);

        INITAL_X = DISTANCE_BETWEEN_WIDTH_OBJECT / 2;
        INITAL_Y = DISTANCE_BETWEEN_HEIGHT_OBJECT / 2;
        LAST_X =
            DISTANCE_BETWEEN_WIDTH_OBJECT * (BACKGROUND_TOTAL_OBJECT_X + 1);
        LAST_Y =
            DISTANCE_BETWEEN_HEIGHT_OBJECT * (BACKGROUND_TOTAL_OBJECT_Y + 1);

        frameId;
        objects = [];
        mouse = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 300,
        };

        velocity = {
            x: 0,
            y: 0,
        };

        directionItv;
        shouldShrink = false;
    };

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

    initVariable();

    for (let i = -1; i < BACKGROUND_TOTAL_OBJECT_X + 1; i++) {
        for (let j = -1; j < BACKGROUND_TOTAL_OBJECT_Y + 1; j++) {
            let X = INITAL_X + i * DISTANCE_BETWEEN_WIDTH_OBJECT;
            let Y = INITAL_Y + j * DISTANCE_BETWEEN_HEIGHT_OBJECT;
            let size = DEFAULT_OBJECT_SIZE;
            let objectSpeedFactor =
                Math.random() *
                    (OBJECT_SPEED_FACTOR_MAXIMUM -
                        OBJECT_SPEED_FACTOR_MINIMUM) +
                OBJECT_SPEED_FACTOR_MINIMUM;
            let color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
                Math.random() * 255
            }, 0.3)`;
            //event driven
            let type =
                OBJECT_TYPE[Math.floor(Math.random() * OBJECT_TYPE.length)];
            let object = new GameObject(
                X,
                Y,
                size,
                objectSpeedFactor,
                color,
                type
            );
            objects.push(object);
        }
    }
    randomDirection();
    directionItv = setInterval(randomDirection, 3000);
    loop();
}

function loop() {
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    objects.forEach((object) => {
        object.update();
        object.render();
    });
    frameId = requestAnimationFrame(loop);
}

function endMenu() {
    const cleanEventHandler = () => {
        window.onmousemove = null;
        window.onwheel = null;
        clearInterval(directionItv);
    };

    cleanEventHandler();
    shouldShrink = true;
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
    mouse.radius = Math.max(canvas.width, canvas.height);
}

function cleanCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(frameId);
}

export { startMenu, endMenu, cleanCanvas };
