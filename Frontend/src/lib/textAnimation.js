import { hintList } from "../constant.js";

function hintTextAnimation(hint) {
    const waitTime = 2000;

    let text = "";
    let hintIndex = 0;
    let fullText = hintList[hintIndex];
    let direction = 1;
    let timer = 0;

    setInterval(() => {
        timer = Math.max(0, timer - 100);
        if (timer !== 0) return;
        if (direction === -1) {
            direction = text.length == 0 ? direction * -1 : direction;
            text = text.slice(0, text.length - 1);
        }
        if (direction === 1) {
            text += fullText[text.length];
            direction =
                text.length == fullText.length ? direction * -1 : direction;
            if (fullText.length === text.length) {
                timer = waitTime;
                hintIndex = (hintIndex + 1) % hintList.length;
                fullText = hintList[hintIndex];
            }
        }
        hint.innerHTML = text;
    }, 100);
}

export { hintTextAnimation };
