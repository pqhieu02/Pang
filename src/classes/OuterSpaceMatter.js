import { ctx, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constant.js";

export default class OuterSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.particles = [];
        this.velocity = velocity;
        this.existence = true;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    isExisting() {
        if (
            this.x < 0 ||
            this.x > SCREEN_WIDTH ||
            this.y < 0 ||
            this.y > SCREEN_HEIGHT
        )
            this.existence = false;
        return this.existence;
    }

    kill() {
        this.existence = false;
    }

    render() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

    }
}
