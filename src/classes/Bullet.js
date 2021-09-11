import OuterSpaceMatter from "./OuterSpaceMatter.js";
import { BULLET_DAMAGE } from "../constant.js";

export default class Bullet extends OuterSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
        this.damage = BULLET_DAMAGE;
    }
}
