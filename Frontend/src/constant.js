export const backgroundCanvas = document.getElementById("backgroundCanvas");
export const background = backgroundCanvas.getContext("2d");
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export const WORLD_WIDTH = 6000;
export const WORLD_HEIGHT = 6000;
export const FIRE_RATE = 100;

export const TYPE_HEXAGON = "HEXAGON";
export const TYPE_SQUARE = "SQUARE";
export const TYPE_CIRCLE = "CIRCLE";
export const TYPE_TRIANGLE = "TRIANGLE";

export const MENU_FADE_OUT_DURATION = 500;

export const hintList = [
    "Scroll up or down to change background effect!",
    "Don't run into other objects!",
];

export const BASE_URL = "http://localhost:8080/BallBlast/Entry";
