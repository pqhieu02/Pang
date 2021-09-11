export const baseLayer = document.getElementById("baseLayer");
export const context = baseLayer.getContext("2d");
export const upperLayer = document.getElementById("upperLayer");
export const ctx = upperLayer.getContext("2d");

baseLayer.width = window.innerWidth;
baseLayer.height = window.innerHeight;
upperLayer.width = window.innerWidth;
upperLayer.height = window.innerHeight;

export const DIFFICULTY = 1;
export const SPEED = {
    METEOR: 1 * DIFFICULTY,
    BULLET: 8,
    PARTICLE: 10,
};
export const SPEED_TARGET_METEOR = "METEOR";
export const SPEED_TARGET_BULLET = "BULLET";

export const SCREEN_WIDTH = window.innerWidth;
export const SCREEN_HEIGHT = window.innerHeight;

export const PLAYER_INITAL_X = window.innerWidth / 2;
export const PLAYER_INITAL_Y = window.innerHeight / 2;
export const PLAYER_RADIUS = 20;
export const PLAYER_OUTLINE_RADIUS = 150;
export const PLAYER_SHADOW_RADIUS = 50;
export const PLAYER_COLOR = "white";
export const PLAYER_STEP = 5;
export const PLAYER_PARTICLE_TOTAL = 100;

export const FIRE_RATE = 100;
export const BULLET_RADIUS = 5;
export const BULLET_COLOR = "white";
export const BULLET_DAMAGE = 10;
export const BULLET_PARTICLE_TOTAL = 3;

export const METEOR_SPAWN_TIME = 2000;
export const METEOR_MAX_RADIUS = 30;
export const METEOR_MIN_RADIUS = 20;
export const METEOR_PARTICLE_TOTAL = 10;
export const METEOR_SHRINK_SPEED = 0.5;

export const PARTICLE_RADIUS = 1;
export const PARTICLE_FRICTION = 0.98;

export const CIRCLE_RADIUS = 3;
export const DISTANCE_BETWEEN_CIRCLE = 40;
export const INITAL_X = 20;
export const INITAL_Y = 20;
export const WIDTH_CIRCLE_COUNT = upperLayer.width / DISTANCE_BETWEEN_CIRCLE;
export const HEIGHT_CIRCLE_COUNT = upperLayer.height / DISTANCE_BETWEEN_CIRCLE;
