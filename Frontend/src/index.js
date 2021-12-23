import { canvas, ctx, FADE_OUT_DURATION } from "./constant.js";
import { registerForId } from "./lib/fetchAPI.js";
import {
    endHintTextAnimation,
    startHintTextAnimation,
} from "./lib/textAnimation.js";
import { cleanCanvas, endMenu, initMenu } from "./menu.js";
import { startPlayingCanvas } from "./play.js";

const joinBtn = document.getElementById("joinBtn");
const menuContainer = document.getElementById("menuContainer");
const hint = document.getElementById("hint");

var world;

window.onload = startMenu;

function startMenu() {
    joinBtn.onclick = joinGame;
    initMenu(ctx, canvas);
    startHintTextAnimation(hint);
    menuContainer.style.display = "flex";
    menuContainer.style.animation = "fadeIn 2s forwards";
    canvas.style.animation = "fadeIn 2s forwards";
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

function joinGame() {
    joinBtn.onclick = null;
    menuContainer.style.animation = "fadeOut 2s forwards";
    canvas.style.animation = "fadeOut 2s forwards";
    endMenu();
    setTimeout(async () => {
        cleanCanvas();
        endHintTextAnimation();
        menuContainer.style.display = "none";
        let playerId = await registerForId();
        startPlayingCanvas(playerId);
    }, FADE_OUT_DURATION);
}

export { startMenu };
