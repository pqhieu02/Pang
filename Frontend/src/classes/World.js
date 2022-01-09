import {
    canvas,
    ctx,
    FIRE_RATE,
    TEXT_FONT_SIZE,
    TEXT_FONT_TYPE,
    WORLD_HEIGHT,
    WORLD_WIDTH,
} from "../constant.js";
import { endGame } from "../index.js";
import drawObject from "../lib/drawObject.js";
import { fire, getGameState, setKey, unsetKey } from "../lib/fetchAPI.js";
import Background from "./Background.js";

var world;
var animationFrameLocker;
var frameId;
var fps;
var times = [];

export default class World {
    constructor(playerId) {
        this.playerId = playerId;
        this.gameState = null;
        this.gunTriggerItv = null;
        this.translateX = 0;
        this.translateY = 0;
        this.background = new Background();
        this.isBeingTerminated = false;
    }

    init() {
        const startFiring = async (e) => {
            let { playerX, playerY } = this.gameState;
            let cursorX = e.clientX;
            let cursorY = e.clientY;

            window.onmousemove = (e) => {
                cursorX = e.clientX;
                cursorY = e.clientY;
            };
            await fire(this.playerId, playerX, playerY, cursorX, cursorY);
            return setInterval(async () => {
                let { playerX, playerY } = this.gameState;
                await fire(this.playerId, playerX, playerY, cursorX, cursorY);
            }, FIRE_RATE);
        };

        window.onmousedown = async (e) => {
            if (e.button !== 0) return;
            this.gunTriggerItv = await startFiring(e);
        };
        window.onmouseup = (e) => {
            if (e.button !== 0) return;
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
            x: playerX,
            y: playerY,
            size: 30,
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
        if (!this.isBeingTerminated && !gameState.isAlive) {
            endGame();
            this.endEventHandler();
            this.isBeingTerminated = true;
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

    drawPlayerName(x, y, size, text) {
        if (!text || !this.gameState.isAlive) return;
        ctx.beginPath();
        ctx.font = `${TEXT_FONT_SIZE}px ${TEXT_FONT_TYPE}`;
        let textSize = ctx.measureText(text).width;
        ctx.fillStyle = "white";
        ctx.fillText(text, x - textSize / 2, y - size - 10);
    }

    draw(object) {
        let HSLColor = `hsl(${object.color.h * 360}, ${
            object.color.s * 100
        }%, ${object.color.l * 100}%)`;
        let toDrawObject = {
            x: object.x,
            y: object.y,
            size: object.size,
            color: HSLColor,
            type: object.type,
            angle: object.angle,
        };

        ctx.translate(this.translateX, this.translateY);
        this.drawPlayerName(object.x, object.y, object.size, object.name);
        this.drawHpBar(object.x, object.y, object.size, object.hp);
        drawObject(ctx, toDrawObject);
    }

    render() {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.background.render();

        this.gameState.particles.forEach((particle) => this.draw(particle));

        this.gameState.bullets.forEach((bullet) => this.draw(bullet));

        this.gameState.mobs.forEach((mob) => {
            // console.log(mob.name);
            this.draw(mob);
        });
        this.gameState.players.forEach((player) => {
            this.draw(player);
        });
    }

    endEventHandler() {
        this.background.resetController();
        window.onmousedown = null;
        window.onmouseup = null;
        window.onkeydown = null;
        window.onkeyup = null;
    }

    end() {
        this.playerId = null;
        this.gunTriggerItv = null;
        this.background.end();
    }
}

async function gameLoop() {
    let playerId = world.playerId;
    let gameState = await getGameState(playerId);

    if (gameState !== "error") {
        world.update(gameState);
        world.render();
    }

    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(fps, 0, 30);
    if (animationFrameLocker) {
        frameId = requestAnimationFrame(gameLoop);
    }
}

function startWorld(playerId) {
    world = new World(playerId);
    animationFrameLocker = true;
    world.init();
    gameLoop();
}

function endWorld() {
    world.end();
    animationFrameLocker = false;
    cancelAnimationFrame(frameId);
}

export { startWorld, endWorld };
