import World from "./classes/World.js";
import { canvas, ctx } from "./constant.js";
import { getGameState } from "./lib/fetchAPI.js";

let world;

var fps;
var times = [];

async function animate() {
    let playerId = world.playerId;
    let gameState = await getGameState(playerId);
    
    let last = performance.now();
    world.update(gameState);
    world.render();
    
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;
    // console.log(performance.now() - last);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(fps, 0, 30);
    requestAnimationFrame(animate);
}

async function play(playerId) {
    console.log(playerId);
    world = new World(playerId);
    world.init();
    animate();
}

export { play };
