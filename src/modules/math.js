import { SPEED } from "../constant.js";

export const getVelocity = (a, b, c, d, target) => {
    let X = c - a;
    let Y = d - b;
    let mag = Math.sqrt(X * X + Y * Y);
    return {
        x: (X / mag) * SPEED[target],
        y: (Y / mag) * SPEED[target],
    };
};

export const random = (min, max) => {
    return Math.random() * (max - min) + min;
};
