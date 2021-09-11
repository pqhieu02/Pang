import { PARTICLE_FRICTION } from "../constant.js";
import OuterSpaceMatter from "./OuterSpaceMatter.js";

export default class Particle extends OuterSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }

    update() {
        super.update();
        if (
            Math.abs(this.velocity.x) < 0.25 &&
            Math.abs(this.velocity.y) < 0.25
        ) {
            this.existence = false;
        }
        this.velocity.x *= PARTICLE_FRICTION;
        this.velocity.y *= PARTICLE_FRICTION;
    }
}
