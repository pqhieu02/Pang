import { canvas, ctx } from "../constant.js";

export default class Stone {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 50;
        this.color = "yellow";
    }
    render() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
