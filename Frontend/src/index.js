import Background from "./classes/Background.js";
import { ctx, MENU_FADE_OUT_DURATION } from "./constant.js";
import { registerForId } from "./lib/fetchAPI.js";
import { hintTextAnimation } from "./lib/textAnimation.js";
import { cleanCanvas, endMenu, initMenu } from "./menu.js";
import { play } from "./play.js";

const joinBtn = document.getElementById("joinBtn");
const menuContainer = document.getElementById("menuContainer");
const hint = document.getElementById("hint");

joinBtn.onclick = joinGame;

// window.onload = () => {
//     menuContainer.style.opacity = 1;
//     initMenu(ctx, canvas);
//     hintTextAnimation(hint);
// };
// window.onload = async () => {
// };

async function main() {
    let playerId = await registerForId();
    play(playerId);
}

// main();
let a = new Background();
function animate() {
    let player = {
        x: 500,
        y: 500,
        size: 20, // !!
    };
    a.update(player);
    a.render();
    requestAnimationFrame(animate);
}

animate();

function joinGame() {
    // joinBtn.onclick = null;
    // menuContainer.style.animation = "fadeOut 1s forwards";
    // endMenu();
    // setTimeout(async () => {
    //     cleanCanvas();
    //     menuContainer.style.display = "none";
    //     let playerId = await registerForId();
    //     play(playerId);
    // }, MENU_FADE_OUT_DURATION);
}
