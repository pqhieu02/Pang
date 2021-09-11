import OuterSpaceMatter from "./OuterSpaceMatter.js";
import {
    ctx,
    PLAYER_OUTLINE_RADIUS,
    PLAYER_RADIUS,
    PLAYER_STEP,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
} from "../constant.js";

export default class Player extends OuterSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
        this.WASD = {
            w: false,
            a: false,
            s: false,
            d: false,
        };
    }

    update() {
        let w = this.WASD.w ? -PLAYER_STEP : 0;
        let a = this.WASD.a ? -PLAYER_STEP : 0;
        let s = this.WASD.s ? PLAYER_STEP : 0;
        let d = this.WASD.d ? PLAYER_STEP : 0;
        this.velocity.x = a + d;
        this.velocity.y = w + s;
        this.x = Math.max(PLAYER_RADIUS, Math.min(this.x + this.velocity.x, SCREEN_WIDTH - PLAYER_RADIUS));
        this.y = Math.max(PLAYER_RADIUS, Math.min(this.y + this.velocity.y, SCREEN_HEIGHT- PLAYER_RADIUS));
    }

    render() {
        if (!this.existence) return;

        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.arc(this.x, this.y, PLAYER_OUTLINE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        super.render();
    }
}
