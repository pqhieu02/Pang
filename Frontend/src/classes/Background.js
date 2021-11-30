import {
    ctx,
    TYPE_CIRCLE,
    TYPE_HEXAGON,
    TYPE_SQUARE,
    TYPE_TRIANGLE,
    WORLD_HEIGHT,
    WORLD_WIDTH,
} from "../constant.js";

const STEP = 2;

const TOTAL_WIDTH_OBJECT = 20;
const TOTAL_HEIGHT_OBJECT = 20;

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

var objects = [];

var velocity = {
    x: 0,
    y: 0,
};

class BackgroundObject {
    constructor(x, y, size, color, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.type = type;
    }

    update() {
        this.x += velocity.x;
        this.y += velocity.y;

        if (this.x < -(INITAL_X + DISTANCE_BETWEEN_WIDTH_OBJECT)) {
            this.x = LAST_X - DISTANCE_BETWEEN_WIDTH_OBJECT / 2 - STEP;
        }
        if (this.x > LAST_X + DISTANCE_BETWEEN_WIDTH_OBJECT / 2) {
            this.x = -INITAL_X + STEP;
        }

        if (this.y < -(INITAL_Y + DISTANCE_BETWEEN_HEIGHT_OBJECT)) {
            this.y = LAST_Y - DISTANCE_BETWEEN_HEIGHT_OBJECT / 2 - STEP;
        }
        if (this.y > LAST_Y + DISTANCE_BETWEEN_HEIGHT_OBJECT / 2) {
            this.y = -INITAL_Y + STEP;
        }
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        switch (this.type) {
            case TYPE_HEXAGON: {
                let a = (2 * Math.PI) / 6;
                let height = this.size / 2;
                let centerToVertices = height / (Math.sqrt(3) / 2);
                for (let i = 0; i < 6; i++) {
                    ctx.lineTo(
                        centerToVertices * Math.cos(a * i),
                        centerToVertices * Math.sin(a * i)
                    );
                }
                break;
            }
            case TYPE_SQUARE: {
                ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            }
            case TYPE_TRIANGLE: {
                let height = this.size * (Math.sqrt(3) / 2);
                let distanceFromCenterToVertex = (2 * height) / 3;
                let X = 0;
                let Y = -distanceFromCenterToVertex;

                ctx.moveTo(X, Y);
                ctx.lineTo(-this.size / 2, height / 3);
                ctx.lineTo(this.size / 2, height / 3);
                break;
            }
            case TYPE_CIRCLE: {
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                break;
            }
        }
        ctx.fill();
        ctx.resetTransform();
    }
}

export default class Background {
    constructor() {
        for (let i = -1; i < TOTAL_WIDTH_OBJECT + 1; i++)
            for (let j = -1; j < TOTAL_HEIGHT_OBJECT + 1; j++) {
                let X = INITAL_X + i * DISTANCE_BETWEEN_WIDTH_OBJECT;
                let Y = INITAL_Y + j * DISTANCE_BETWEEN_HEIGHT_OBJECT;
                let size = DEFAULT_SIZE;
                let color = `rgba(25, 25, 25, 1)`;
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
                let object = new BackgroundObject(X, Y, size, color, type);
                objects.push(object);
            }
        this.controller = {
            w: false,
            a: false,
            s: false,
            d: false,
        };
    }

    setControllerKey(key, value) {
        this.controller[key] = value;
    }

    update(player) {
        let w = this.controller.w ? STEP : 0;
        let a = this.controller.a ? STEP : 0;
        let s = this.controller.s ? -STEP : 0;
        let d = this.controller.d ? -STEP : 0;

        velocity.x = a + d;
        velocity.y = w + s;

        if (player.x - player.size - backgroundCanvas.width / 2 < 0) {
            velocity.x = 0;
        }
        if (player.x + player.size + backgroundCanvas.width / 2 > WORLD_WIDTH) {
            velocity.x = 0;
        }

        if (player.y - player.size - backgroundCanvas.height / 2 < 0) {
            velocity.y = 0;
        }
        if (
            player.y + player.size + backgroundCanvas.height / 2 >
            WORLD_HEIGHT
        ) {
            velocity.y = 0;
        }

        objects.forEach((object) => {
            object.update();
        });
    }

    render() {
        objects.forEach((object) => {
            object.render();
        });
    }
}
