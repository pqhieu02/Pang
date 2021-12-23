import World from "./classes/World.js";
import { canvas, ctx, FADE_OUT_DURATION } from "./constant.js";
import { startMenu } from "./index.js";
import { getGameState } from "./lib/fetchAPI.js";

let world;

var frameId;
var fps;
var times = [];

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
    frameId = requestAnimationFrame(gameLoop);
}

function end() {
    setTimeout(() => {
        cancelAnimationFrame(frameId);
        startMenu();
    }, FADE_OUT_DURATION);
    canvas.style.animation = "fadeOut 2s forwards";
}

async function startPlayingCanvas(playerId) {
    canvas.style.animation = "fadeIn 2s forwards";
    world = new World(playerId);
    world.init();
    gameLoop();
    setTimeout(() => {
        end();
    }, 5000);
}

export { startPlayingCanvas };
