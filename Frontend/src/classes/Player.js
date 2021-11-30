import { canvas, ctx, WORLD_HEIGHT, WORLD_WIDTH } from "../constant.js";

export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 50;
        this.color = "yellow";
        this.velocity = {
            x: 0,
            y: 0,
        };
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

    update() {
        let w = this.controller.w ? -10 : 0;
        let a = this.controller.a ? -10 : 0;
        let s = this.controller.s ? 10 : 0;
        let d = this.controller.d ? 10 : 0;

        this.x += a + d;
        this.y += w + s;
        this.x = Math.max(0, Math.min(this.x, WORLD_WIDTH));
        this.y = Math.max(0, Math.min(this.y, WORLD_HEIGHT));
    }

    render() {
        this.update();
        ctx.save();
        ctx.beginPath();
        let translateX = -this.x + canvas.width / 2;
        let translateY = -this.y + canvas.height / 2;
        if (this.x + canvas.width / 2 > WORLD_WIDTH) translateX = canvas.width - WORLD_WIDTH;
        if (this.x - canvas.width / 2 < 0) translateX = 0;
        if (this.y + canvas.height / 2 > WORLD_HEIGHT) translateY = canvas.height - WORLD_HEIGHT;
        if (this.y - canvas.height / 2 < 0) translateY = 0;
        ctx.translate(translateX, translateY);
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
