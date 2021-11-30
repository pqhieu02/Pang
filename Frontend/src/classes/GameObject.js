import { ctx } from "../constant.js";

export default class GameObject {
    static render(x, y, radius, color, playerX, playerY) {
        ctx.save();
        ctx.beginPath();

        let translateX = -playerX + background.width / 2;
        let translateY = -playerY + background.height / 2;
        // 2000 1600 to REAL WORLD_WIDTH WORLD_HEIGHT ( 5000x5000)
        if (playerX + background.width / 2 > 2000) translateX = background.width - 2000;
        if (playerX - background.width / 2 < 0) translateX = 0;
        if (playerY + background.height / 2 > 2000)
            translateY = background.height - 2000;
        if (playerY - background.height / 2 < 0) translateY = 0;
        ctx.translate(translateX, translateY);
        let HSLColor = `hsl(${color.h * 360}, ${color.s * 100}%, ${
            color.l * 100
        }%)`;

        ctx.fillStyle = HSLColor;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
