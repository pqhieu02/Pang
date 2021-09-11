import {
    BULLET_COLOR,
    BULLET_RADIUS,
    FIRE_RATE,
    METEOR_MAX_RADIUS,
    METEOR_MIN_RADIUS,
    METEOR_PARTICLE_TOTAL,
    METEOR_SPAWN_TIME,
    PARTICLE_RADIUS,
    PLAYER_COLOR,
    PLAYER_INITAL_X,
    PLAYER_INITAL_Y,
    PLAYER_PARTICLE_TOTAL,
    PLAYER_RADIUS,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    SPEED,
    SPEED_TARGET_BULLET,
} from "../constant.js";
import { getVelocity, random } from "../modules/math.js";
import Bullet from "./Bullet.js";
import Meteor from "./Meteor.js";
import Particle from "./Particle.js";
import Player from "./Player.js";

export default class World {
    constructor() {
        this.id = 1;
        this.player;
        this.bullets = [];
        this.meteors = [];
        this.particles = [];
        this.isGameOver = false;

        this.meteorSpawner;
    }

    init() {
        const spawnMeteor = () => {
            let x, y;
            let meteor_radius = random(METEOR_MIN_RADIUS, METEOR_MAX_RADIUS);
            let meteor_color = `hsl(${Math.random() * 360}, 100%, 50%)`;

            if (Math.random() < 0.5) {
                if (Math.random() < 0.5) {
                    x = -meteor_radius;
                } else {
                    x = SCREEN_WIDTH + meteor_radius;
                }
                y = Math.random() * SCREEN_HEIGHT;
            } else {
                if (Math.random() < 0.5) {
                    y = -meteor_radius;
                } else {
                    y = SCREEN_HEIGHT + meteor_radius;
                }
                x = Math.random() * SCREEN_WIDTH;
            }
            this.meteors.push(new Meteor(x, y, meteor_radius, meteor_color));
        };

        const fire = (cursorX, cursorY) => {
            let velocity = getVelocity(
                this.player.x,
                this.player.y,
                cursorX,
                cursorY,
                SPEED_TARGET_BULLET
            );
            this.bullets.push(
                new Bullet(
                    this.player.x,
                    this.player.y,
                    BULLET_RADIUS,
                    BULLET_COLOR,
                    velocity
                )
            );
        };

        const setKey = (e, bool) => {
            let key = e.key.toLowerCase();
            if (["a", "s", "d", "w"].includes(key)) {
                this.player.WASD[key] = bool;
            }
        };

        let itv;
        window.onmousedown = (e) => {
            let cursorX = e.clientX;
            let cursorY = e.clientY;
            window.onmousemove = (e) => {
                cursorX = e.clientX;
                cursorY = e.clientY;
            };
            fire(cursorX, cursorY);
            itv = setInterval(() => fire(cursorX, cursorY), FIRE_RATE);
        };
        window.onmouseup = () => {
            clearInterval(itv);
            window.onmousemove = null;
        };
        window.onkeydown = (e) => setKey(e, true);
        window.onkeyup = (e) => setKey(e, false);

        this.meteorSpawner = setInterval(spawnMeteor, METEOR_SPAWN_TIME);
    }

    addPlayer() {
        this.player = new Player(
            PLAYER_INITAL_X,
            PLAYER_INITAL_Y,
            PLAYER_RADIUS,
            PLAYER_COLOR,
            {
                x: 0,
                y: 0,
            }
        );
    }

    update() {
        const manageCollison = () => {
            const isColliding = (target) => {
                if (target.first.radius <= 0 || target.second.radius <= 0)
                    return false;
                let X = target.first.x - target.second.x;
                let Y = target.first.y - target.second.y;
                let limit = target.first.radius + target.second.radius;
                let distance = Math.sqrt(X * X + Y * Y);
                if (distance <= limit) return true;
                return false;
            };

            const addParticles = (x, y, color, n) => {
                for (let i = 0; i < n; i++) {
                    let velocity = {
                        x: (Math.random() - 0.5) * SPEED.PARTICLE,
                        y: (Math.random() - 0.5) * SPEED.PARTICLE,
                    };
                    let particle = new Particle(
                        x,
                        y,
                        PARTICLE_RADIUS,
                        color,
                        velocity
                    );
                    this.particles.push(particle);
                }
            };

            const meteorAndBullet = () => {
                for (let i = 0; i < this.bullets.length; i++)
                    for (let j = 0; j < this.meteors.length; j++) {
                        let bullet = this.bullets[i];
                        let meteor = this.meteors[j];
                        let target = {
                            first: {
                                x: bullet.x,
                                y: bullet.y,
                                radius: bullet.radius,
                            },
                            second: {
                                x: meteor.x,
                                y: meteor.y,
                                radius: meteor.radius,
                            },
                        };
                        if (isColliding(target)) {
                            addParticles(
                                meteor.x,
                                meteor.y,
                                meteor.color,
                                METEOR_PARTICLE_TOTAL
                            );
                            meteor.shrink();
                            bullet.kill();
                        }
                    }
            };

            const meteorAndPlayer = () => {
                this.meteors.forEach((meteor) => {
                    let target = {
                        first: {
                            x: this.player.x,
                            y: this.player.y,
                            radius: this.player.radius,
                        },
                        second: {
                            x: meteor.x,
                            y: meteor.y,
                            radius: meteor.radius,
                        },
                    };
                    if (isColliding(target)) {
                        addParticles(
                            this.player.x,
                            this.player.y,
                            this.player.color,
                            PLAYER_PARTICLE_TOTAL
                        );
                        this.player.kill();
                        this.end();
                    }
                });
            };

            meteorAndBullet();
            meteorAndPlayer();
        };

        const removeDestroyedObjects = () => {
            const removeBullets = () => {
                let newArray = [];
                this.bullets.forEach((bullet) => {
                    if (!bullet.isExisting()) return;
                    newArray.push(bullet);
                });
                this.bullets = newArray;
            };

            const removeMeteors = () => {
                let newArray = [];
                this.meteors.forEach((meteor) => {
                    if (!meteor.isExisting()) return;
                    newArray.push(meteor);
                });
                this.meteors = newArray;
            };

            const removeParticles = () => {
                let newArray = [];
                this.particles.forEach((particle) => {
                    if (!particle.isExisting()) return;
                    newArray.push(particle);
                });
                this.particles = newArray;
            };

            removeBullets();
            removeMeteors();
            removeParticles();
        };

        const updateObjectsData = () => {
            this.bullets.forEach((bullet) => {
                bullet.update();
            });

            this.meteors.forEach((meteor) => {
                meteor.update(
                    this.player.x,
                    this.player.y,
                    this.player.isExisting()
                );
            });

            this.particles.forEach((particle) => {
                particle.update();
            });

            if (this.player.isExisting()) this.player.update();
        };

        manageCollison();
        removeDestroyedObjects();
        updateObjectsData();
    }

    render() {
        this.particles.forEach((particle) => {
            particle.render();
        });

        this.bullets.forEach((bullet) => {
            bullet.render();
        });

        this.player.render();
        this.meteors.forEach((meteor) => {
            meteor.render();
        });
    }

    end() {
        window.onmousedown = null;
        window.onmouseup = null;
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        clearInterval(this.meteorSpawner);
        setTimeout(() => (this.isGameOver = true), 3000);
    }
}
