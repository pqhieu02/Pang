import {
    BULLET_DAMAGE,
    METEOR_SHRINK_SPEED,
    SPEED_TARGET_METEOR,
    BULLET_RADIUS,
} from "../constant.js";
import { getVelocity } from "../modules/math.js";
import OuterSpaceMatter from "./OuterSpaceMatter.js";

export default class Meteor extends OuterSpaceMatter {
    constructor(x, y, radius, color) {
        super(x, y, radius, color);
        this.expectRadius = this.radius;
    }

    isExisting() {
        if (this.radius <= 0 && this.particles.length === 0) {
            return false;
        }
        return true;
    }

    update(playerX, playerY, playerExistence) {
        if (playerExistence) {
            this.velocity = getVelocity(
                this.x,
                this.y,
                playerX,
                playerY,
                SPEED_TARGET_METEOR
            );
        } else {
            this.velocity = getVelocity(
                playerX,
                playerY,
                this.x,
                this.y,
                SPEED_TARGET_METEOR
            );
            this.velocity.x *= 2;
            this.velocity.y *= 2;
        }
        if (this.radius > this.expectRadius) {
            this.radius =
                this.radius >= BULLET_RADIUS
                    ? this.radius - METEOR_SHRINK_SPEED
                    : 0;
        }
        super.update();
    }

    shrink() {
        if (this.expectRadius === 0) return;
        this.expectRadius =
            this.expectRadius >= BULLET_RADIUS
                ? this.expectRadius - BULLET_DAMAGE
                : 0;
    }
}
