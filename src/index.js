import World from "./classes/World.js";
import { drawBaseLayer, drawUpperLayer } from "./modules/drawLayer.js";

function animate(world) {
    drawUpperLayer();
    world.update();
    world.render();
    if (!world.isGameOver) {
        requestAnimationFrame(() => {
            animate(world);
        });
    }
}

function play() {
    drawBaseLayer();
    setInterval(drawBaseLayer, 500);
    let world = new World();
    world.addPlayer();
    world.init();
    animate(world);
}

play();

