import {
    background,
    canvas,
    ctx,
    FIRE_RATE,
    TYPE_CIRCLE,
    TYPE_HEXAGON,
    TYPE_SQUARE,
    TYPE_TRIANGLE,
    WORLD_HEIGHT,
    WORLD_WIDTH,
} from "../constant.js";
import { fire, setKey, unsetKey } from "../lib/fetchAPI.js";
import Background from "./Background.js";

export default class World {
    constructor(playerId) {
        background.fillStyle = "rgba(128,128,128,1)";
        // background.fillRect(0, 0, canvas.width, canvas.height);
        this.playerId = playerId;
        this.gameState = null;
        this.gunTriggerItv = null;
        this.translateX = 0;
        this.translateY = 0;
        this.background = new Background();
    }

    init() {
        // startFiring return interval
        const startFiring = async (e) => {
            let { playerX, playerY } = this.gameState;
            let cursorX = e.clientX;
            let cursorY = e.clientY;

            window.onmousemove = (e) => {
                cursorX = e.clientX;
                cursorY = e.clientY;
            };
            await fire(this.playerId, playerX, playerY, cursorX, cursorY);
            // this.gunTriggerItv = setInterval(async () => {
            //     let { playerX, playerY } = this.gameState;
            //     await fire(this.playerId, playerX, playerY, cursorX, cursorY);
            // }, FIRE_RATE);
            return setInterval(async () => {
                let { playerX, playerY } = this.gameState;
                await fire(this.playerId, playerX, playerY, cursorX, cursorY);
            }, FIRE_RATE);
        };

        window.onmousedown = async (e) => {
            this.gunTriggerItv = await startFiring(e);
        };
        window.onmouseup = () => {
            clearInterval(this.gunTriggerItv);
            window.onmousemove = null;
        };

        window.onkeydown = async (e) => {
            let key = e.key.toLowerCase();
            if (["a", "s", "d", "w"].includes(key)) {
                this.background.setControllerKey(key, true);
                await setKey(this.playerId, key);
            }
        };
        window.onkeyup = async (e) => {
            let key = e.key.toLowerCase();
            if (["a", "s", "d", "w"].includes(key)) {
                this.background.setControllerKey(key, false);
                await unsetKey(this.playerId, key);
            }
        };
    }

    update(gameState) {
        this.gameState = gameState;
        let playerX = this.gameState.playerX;
        let playerY = this.gameState.playerY;
        let player = {
            x: this.playerX,
            y: this.playerY,
            size: 20, // !!
        };
        this.background.update(player);
        this.translateX = -playerX + canvas.width / 2;
        this.translateY = -playerY + canvas.height / 2;

        if (playerX + canvas.width / 2 > WORLD_WIDTH)
            this.translateX = canvas.width - WORLD_WIDTH;

        if (playerX - canvas.width / 2 < 0) this.translateX = 0;

        if (playerY + canvas.height / 2 > WORLD_HEIGHT)
            this.translateY = canvas.height - WORLD_HEIGHT;
        if (playerY - canvas.height / 2 < 0) this.translateY = 0;

        if (canvas.width >= WORLD_WIDTH) {
            this.translateX = 0;
        }
        if (canvas.height >= WORLD_HEIGHT) {
            this.translateY = 0;
        }
    }

    drawHpBar(x, y, size, hp) {
        if (hp >= 1 || hp <= 0) return;
        let hpSize = Math.max(size, 20);

        ctx.beginPath();
        ctx.strokeStyle = "slategray";
        ctx.lineWidth = 3;
        ctx.fillStyle = "slategray";
        ctx.rect(x - hpSize, y + hpSize / 2 + 30, hpSize * 2, 7);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "lime";
        ctx.rect(x - hpSize, y + hpSize / 2 + 30, hpSize * 2 * hp, 7);
        ctx.fill();
    }

    draw(object) {
        ctx.translate(this.translateX, this.translateY);

        this.drawHpBar(object.x, object.y, object.size, object.hp);

        // Draw object
        //https://www.khanacademy.org/computing/pixar/sets/rotation/v/sets-9
        //https://en.wikipedia.org/wiki/Rotation_matrix

        let radian = object.angle * (Math.PI / 180);
        let size = object.size;
        let HSLColor = `hsl(${object.color.h * 360}, ${
            object.color.s * 100
        }%, ${object.color.l * 100}%)`;

        ctx.beginPath();
        ctx.transform(
            Math.cos(radian),
            Math.sin(radian),
            Math.sin(radian),
            -Math.cos(radian),
            object.x,
            object.y
        );
        switch (object.type) {
            case TYPE_HEXAGON: {
                let a = (2 * Math.PI) / 6;
                let height = size;
                let centerToVertices = height / (Math.sqrt(3) / 2);

                for (let i = 0; i < 6; i++) {
                    ctx.lineTo(
                        centerToVertices * Math.cos(a * i),
                        centerToVertices * Math.sin(a * i)
                    );
                }
                break;
            }
            case TYPE_CIRCLE: {
                ctx.arc(0, 0, size, 0, Math.PI * 2);
                break;
            }
            case TYPE_SQUARE: {
                ctx.rect(-size, -size, size * 2, size * 2);
                break;
            }
            case TYPE_TRIANGLE: {
                let a = size / (Math.sqrt(3) / 6);
                let height = a * (Math.sqrt(3) / 2);
                let distanceFromCenterToVertex = height * (2 / 3);
                let X = 0;
                let Y = -distanceFromCenterToVertex;

                ctx.moveTo(X, Y);
                ctx.lineTo(X - a / 2, Y + height);
                ctx.lineTo(X + a / 2, Y + height);
                break;
            }
        }

        ctx.fillStyle = HSLColor;
        ctx.fill();
        ctx.resetTransform();
    }

    render() {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.background.render();

        this.gameState.particles.forEach((particle) => this.draw(particle));

        this.gameState.bullets.forEach((bullet) => this.draw(bullet));

        this.gameState.mobs.forEach((mob) => {
            // console.log(mob);
            this.draw(mob);
        });
        this.gameState.players.forEach((player) => this.draw(player));
    }

    stopEventHandlerAndAnimation() {
        this.background.resetController();
        window.onmousedown = null;
        window.onmouseup = null;
        window.onkeydown = null;
        window.onkeyup = null;
    }

    end() {
        this.playerId = null;
        this.gunTriggerItv = null;
        window.onmousedown = null;
        window.onmouseup = null;
        window.onkeydown = null;
        window.onkeyup = null;
    }
}
