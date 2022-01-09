import {
    BACKGROUND_TOTAL_OBJECT_X,
    BACKGROUND_TOTAL_OBJECT_Y,
    canvas,
    ctx,
    OBJECT_TYPE,
    WORLD_HEIGHT,
    WORLD_WIDTH,
} from "../constant.js";
import drawObject from "../lib/drawObject.js";

const STEP = 3;
const DISTANCE_BETWEEN_WIDTH_OBJECT = canvas.width / BACKGROUND_TOTAL_OBJECT_X;
const DISTANCE_BETWEEN_HEIGHT_OBJECT =
    canvas.height / BACKGROUND_TOTAL_OBJECT_Y;
const DEFAULT_SIZE =
    Math.min(DISTANCE_BETWEEN_WIDTH_OBJECT, DISTANCE_BETWEEN_HEIGHT_OBJECT) *
    0.3;
const INITAL_X = DISTANCE_BETWEEN_WIDTH_OBJECT / 2;
const INITAL_Y = DISTANCE_BETWEEN_HEIGHT_OBJECT / 2;
const LAST_X = DISTANCE_BETWEEN_WIDTH_OBJECT * (BACKGROUND_TOTAL_OBJECT_X + 1);
const LAST_Y = DISTANCE_BETWEEN_HEIGHT_OBJECT * (BACKGROUND_TOTAL_OBJECT_Y + 1);

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
        this.angle = 180;
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
        drawObject(ctx, this);
    }
}

export default class Background {
    constructor() {
        this.objects = [];
        for (let i = -1; i < BACKGROUND_TOTAL_OBJECT_X + 1; i++)
            for (let j = -1; j < BACKGROUND_TOTAL_OBJECT_Y + 1; j++) {
                let X = INITAL_X + i * DISTANCE_BETWEEN_WIDTH_OBJECT;
                let Y = INITAL_Y + j * DISTANCE_BETWEEN_HEIGHT_OBJECT;
                let size = DEFAULT_SIZE;
                let color = `rgba(25, 25, 25, 1)`;
                // let color = `rgba(${Math.random() * 255}, ${
                //     Math.random() * 255
                // }, ${Math.random() * 255}, 0.5)`;
                let type =
                    OBJECT_TYPE[Math.floor(Math.random() * OBJECT_TYPE.length)];
                let object = new BackgroundObject(X, Y, size, color, type);
                this.objects.push(object);
            }
        this.resetController();
    }

    setControllerKey(key, value) {
        this.controller[key] = value;
    }

    resetController() {
        this.controller = {
            w: false,
            a: false,
            s: false,
            d: false,
        };
    }

    update(player) {
        let w = this.controller.w ? STEP : 0;
        let a = this.controller.a ? STEP : 0;
        let s = this.controller.s ? -STEP : 0;
        let d = this.controller.d ? -STEP : 0;

        velocity.x = a + d;
        velocity.y = w + s;

        if (player.x - player.size - canvas.width / 2 < 0) {
            velocity.x = 0;
        }
        if (player.x + player.size + canvas.width / 2 > WORLD_WIDTH) {
            velocity.x = 0;
        }

        if (player.y - player.size - canvas.height / 2 < 0) {
            velocity.y = 0;
        }
        if (player.y + player.size + canvas.height / 2 > WORLD_HEIGHT) {
            velocity.y = 0;
        }

        this.objects.forEach((object) => {
            object.update();
        });
    }

    render() {
        this.objects.forEach((object) => {
            object.render();
        });
    }

    end() {
        this.resetController();
        this.objects = [];
    }
}
