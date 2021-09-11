import {
    CIRCLE_RADIUS,
    context,
    ctx,
    DISTANCE_BETWEEN_CIRCLE,
    HEIGHT_CIRCLE_COUNT,
    INITAL_X,
    INITAL_Y,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    upperLayer,
    WIDTH_CIRCLE_COUNT,
} from "../constant.js";

export function drawBaseLayer() {
    context.fillRect(0, 0, upperLayer.width, upperLayer.height);
    let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    for (let i = 0; i < WIDTH_CIRCLE_COUNT; i++)
        for (let j = 0; j < HEIGHT_CIRCLE_COUNT; j++) {
            context.save();
            context.globalAlpha = 1;
            context.beginPath();
            context.fillStyle = color;
            context.strokeStyle = color;
            context.arc(
                i * DISTANCE_BETWEEN_CIRCLE + INITAL_X,
                j * DISTANCE_BETWEEN_CIRCLE + INITAL_Y,
                CIRCLE_RADIUS,
                0,
                Math.PI * 2
            );
            context.fill();
            context.stroke();
            context.restore();
        }
}

export function drawUpperLayer() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < WIDTH_CIRCLE_COUNT; i++)
        for (let j = 0; j < HEIGHT_CIRCLE_COUNT; j++) {
            let color = "hsl(0, 0%, 10%)";
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.arc(
                i * DISTANCE_BETWEEN_CIRCLE + INITAL_X,
                j * DISTANCE_BETWEEN_CIRCLE + INITAL_Y,
                CIRCLE_RADIUS,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
}
