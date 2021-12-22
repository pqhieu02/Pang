export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const WORLD_WIDTH = 6000;
export const WORLD_HEIGHT = 6000;
export const FIRE_RATE = 100;

export const TYPE_HEXAGON = "HEXAGON";
export const TYPE_SQUARE = "SQUARE";
export const TYPE_CIRCLE = "CIRCLE";
export const TYPE_TRIANGLE = "TRIANGLE";

export const OBJECT_TYPE = [
    TYPE_HEXAGON,
    TYPE_SQUARE,
    TYPE_CIRCLE,
    TYPE_TRIANGLE,
];

export const BACKGROUND_TOTAL_OBJECT_X = 20;
export const BACKGROUND_TOTAL_OBJECT_Y = 20;

export const MENU_FADE_OUT_DURATION = 2000;

export const hintList = [
    "Scroll up or down to change background effect!",
    "Don't run into other objects!",
];
