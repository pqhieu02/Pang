import { endWorld, startWorld } from "./classes/World.js";
import { canvas, ctx, FADE_OUT_DURATION } from "./constant.js";
import { registerForId } from "./lib/fetchAPI.js";
import {
    endHintTextAnimation,
    startHintTextAnimation,
} from "./lib/textAnimation.js";
import { cleanCanvas, endMenu, startMenu } from "./menu.js";

const joinBtn = document.getElementById("joinBtn");
const menuContainer = document.getElementById("menuContainer");
const hint = document.getElementById("hint");

window.onload = initMenu;

function initMenu() {
    joinBtn.onclick = joinGame;
    startMenu(ctx, canvas);
    startHintTextAnimation(hint);
    menuContainer.style.display = "flex";
    menuContainer.style.animation = "fadeIn 2s forwards";
    canvas.style.animation = "fadeIn 2s forwards";
}

function joinGame() {
    let name = document.getElementById("inputName").value;
    if (name === "") {
        name = "Anonymous";
    }
    joinBtn.onclick = null;
    endMenu();
    setTimeout(async () => {
        cleanCanvas();
        endHintTextAnimation();
        menuContainer.style.display = "none";
        let playerId = await registerForId(name);
        initGame(playerId);
    }, FADE_OUT_DURATION);

    menuContainer.style.animation = "fadeOut 2s forwards";
    canvas.style.animation = "fadeOut 2s forwards";
}

async function initGame(playerId) {
    startWorld(playerId);
    canvas.style.animation = "fadeIn 2s forwards";
}

function endGame() {
    setTimeout(() => {
        endWorld();
        initMenu();
    }, FADE_OUT_DURATION);
    canvas.style.animation = "fadeOut 2s forwards";
}

export { endGame };
