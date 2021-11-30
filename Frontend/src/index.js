import { MENU_FADE_OUT_DURATION } from "./constant.js";
import { registerForId } from "./lib/fetchAPI.js";
import { hintTextAnimation } from "./lib/textAnimation.js";
import { cleanBackgroundCanvas, endMenu, initMenu } from "./menu.js";
import { play } from "./play.js";

const joinBtn = document.getElementById("joinBtn");
const menuContainer = document.getElementById("menuContainer");

joinBtn.onclick = joinGame;

window.onload = () => {
    initMenu();
    hintTextAnimation();
};

function joinGame() {
    joinBtn.onclick = null;
    menuContainer.style.animation = "fadeOut 1s forwards";
    endMenu();
    setTimeout(async () => {
        cleanBackgroundCanvas();
        menuContainer.style.display = "none";
        let playerId = await registerForId();
        play(playerId);
    }, MENU_FADE_OUT_DURATION);
}
