import Background from "./classes/Background.js";
import { canvas, ctx, MENU_FADE_OUT_DURATION } from "./constant.js";
import { registerForId } from "./lib/fetchAPI.js";
import { hintTextAnimation } from "./lib/textAnimation.js";
import { cleanCanvas, endMenu, initMenu } from "./menu.js";
import { play } from "./play.js";

const joinBtn = document.getElementById("joinBtn");
const menuContainer = document.getElementById("menuContainer");
const hint = document.getElementById("hint");

joinBtn.onclick = joinGame;

async function main() {
    let playerId = await registerForId();
    // console.log(playerId);
    play(playerId);
}

// main();
// let a = new Background();
// let x = 30;
// let y = 30;
// let size = 30;

// function animate() {
//     let player = {
//         x: x,
//         y: y,
//         size: size,
//     };
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     a.update(player);
//     a.render();
//     requestAnimationFrame(animate);
// }

// window.onkeydown = async (e) => {
//     let key = e.key.toLowerCase();
//     if (["a", "s", "d", "w"].includes(key)) {

//         a.setControllerKey(key, true);
//     }
// };
// window.onkeyup = async (e) => {
//     let key = e.key.toLowerCase();
//     if (["a", "s", "d", "w"].includes(key)) {
//         a.setControllerKey(key, false);
//     }
// };

// animate();

window.onload = () => {
    menuContainer.style.opacity = 1;
    initMenu(ctx, canvas);
    hintTextAnimation(hint);
};

function joinGame() {
    joinBtn.onclick = null;
    menuContainer.style.animation = "fadeOut 1s forwards";
    endMenu();
    setTimeout(async () => {
        cleanCanvas();
        menuContainer.style.display = "none";
        let playerId = await registerForId();
        play(playerId);
    }, MENU_FADE_OUT_DURATION);
}
