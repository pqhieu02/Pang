const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DIFFICULTY = 1;
const SPEED = {
    METEOR: 1 * DIFFICULTY,
    BULLET: 8,
    PARTICLE: 10,
};
const SPEED_TARGET_METEOR = "METEOR";
const SPEED_TARGET_BULLET = "BULLET";

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const PLAYER_X = window.innerWidth / 2;
const PLAYER_Y = window.innerHeight / 2;
const PLAYER_RADIUS = 20;
const PLAYER_COLOR = "white";

const BULLET_RADIUS = 5;
const BULLET_COLOR = "white";
const BULLET_DAMAGE = 10;
const BULLET_PARTICLE_TOTAL = 3;

const METEOR_SPAWN_TIME = 2000;
const METEOR_MAX_RADIUS = 30;
const METEOR_MIN_RADIUS = 50;
const METEOR_PARTICLE_TOTAL = 10;
const REDUCE_METEOR_RADIUS_SPEED = 0.5;

const PARTICLE_RADIUS = 1;
const PARTICLE_FRICTION = 0.98;

class outerSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.existence = true;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    isExisting() {
        return this.existence;
    }

    vanish() {
        this.existence = false;
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

class Player extends outerSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }

    // render() {
    //     ctx.beginPath();
    //     ctx.fillStyle = this.color;
    //     ctx.strokeStyle = this.color;
    //     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    //     ctx.fill();
    //     ctx.stroke();
    // }
}

class Bullet extends outerSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
        this.damage = BULLET_DAMAGE;
    }

    addBulletParticles(meteor_velocity) {
        for (let i = 0; i < BULLET_PARTICLE_TOTAL; i++) {
            let velocity = {
                x: meteor_velocity.x * random(3, 10),
                y: meteor_velocity.y * random(3, 10),
            };
            let particle = new Particle(
                this.x,
                this.y,
                PARTICLE_RADIUS,
                this.color,
                velocity
            );
            particles.push(particle);
        }
    }

    explode(meteor_velocity) {
        this.addBulletParticles(meteor_velocity);
        super.vanish();
    }

    isExisting() {
        if (
            this.x < 0 ||
            this.x > SCREEN_WIDTH ||
            this.y < 0 ||
            this.y > SCREEN_HEIGHT
        )
            this.existence = false;
        return super.isExisting();
    }
}

class Meteor extends outerSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
        this.expectRadius = this.radius;
    }

    addMeteorParticles() {
        for (let i = 0; i < METEOR_PARTICLE_TOTAL; i++) {
            let velocity = {
                x: (Math.random() - 0.5) * SPEED.PARTICLE,
                y: (Math.random() - 0.5) * SPEED.PARTICLE,
            };
            let particle = new Particle(
                this.x,
                this.y,
                PARTICLE_RADIUS,
                this.color,
                velocity
            );
            particles.push(particle);
        }
    }

    shrink() {
        if (this.expectRadius === 0) return;
        if (this.expectRadius - BULLET_DAMAGE < BULLET_DAMAGE) {
            this.expectRadius = 0;
        } else {
            this.expectRadius = this.expectRadius - BULLET_DAMAGE;
        }
        this.addMeteorParticles();
    }

    render() {
        if (this.radius > this.expectRadius) {
            this.radius = Math.max(this.radius - REDUCE_METEOR_RADIUS_SPEED, 0);
        }
        super.render();
    }

    isExisting() {
        if (this.radius <= 0) {
            return false;
        }
        return true;
    }
}

class Particle extends outerSpaceMatter {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }

    update() {
        super.update();
        if (
            Math.abs(this.velocity.x) < 0.1 &&
            Math.abs(this.velocity.y) < 0.1
        ) {
            this.existence = false;
        }
        this.velocity.x *= PARTICLE_FRICTION;
        this.velocity.y *= PARTICLE_FRICTION;
    }
}

var isGameOver;
var bullets;
var meteors;
var particles;

function init() {
    isGameOver = false;
    bullets = [];
    meteors = [];
    particles = [];
    player = new Player(PLAYER_X, PLAYER_Y, PLAYER_RADIUS, PLAYER_COLOR, {
        x: 0,
        y: 0,
    });
    player.render();
}

function getVelocity(a, b, c, d, target) {
    let X = c - a;
    let Y = d - b;
    let mag = Math.sqrt(X * X + Y * Y);
    return {
        x: (X / mag) * SPEED[target],
        y: (Y / mag) * SPEED[target],
    };
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function spawnMeteor() {
    setInterval(() => {
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
        let meteor_velocity = getVelocity(
            x,
            y,
            PLAYER_X,
            PLAYER_Y,
            SPEED_TARGET_METEOR
        );
        meteors.push(
            new Meteor(x, y, meteor_radius, meteor_color, meteor_velocity)
        );
    }, METEOR_SPAWN_TIME);
}

function updateCanvas() {
    bullets.forEach((bullet) => {
        bullet.update();
    });
    meteors.forEach((meteor) => {
        meteor.update();
    });
    particles.forEach((particle) => {
        particle.update();
    });
}

function removeBullets() {
    let newArray = [];
    bullets.forEach((bullet) => {
        if (!bullet.isExisting()) return;
        newArray.push(bullet);
    });
    bullets = newArray;
}

function removeMeteors() {
    let newArray = [];
    meteors.forEach((meteor) => {
        if (!meteor.isExisting()) return;
        newArray.push(meteor);
    });
    meteors = newArray;
}

function removeParticles() {
    let newArray = [];
    particles.forEach((particle) => {
        if (!particle.isExisting()) return;
        newArray.push(particle);
    });
    particles = newArray;
}

function detectCollision() {
    meteors.forEach((meteor) => {
        let target = {
            first: {
                x: PLAYER_X,
                y: PLAYER_Y,
                radius: PLAYER_RADIUS,
            },
            second: {
                x: meteor.x,
                y: meteor.y,
                radius: meteor.radius,
            },
        };
        if (isColliding(target)) {
            isGameOver = true;
        }
    });
    for (let i = 0; i < bullets.length; i++)
        for (let j = 0; j < meteors.length; j++) {
            let bullet = bullets[i];
            let meteor = meteors[j];
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
                meteor.shrink();
                bullet.explode(meteor.velocity);
            }
        }
}

function isColliding(target) {
    let X = target.first.x - target.second.x;
    let Y = target.first.y - target.second.y;
    let limit = target.first.radius + target.second.radius;
    let distance = Math.sqrt(X * X + Y * Y);
    if (distance <= limit) return true;
    return false;
}

function drawCanvas() {
    particles.forEach((particle) => {
        particle.render();
    });
    bullets.forEach((bullet) => {
        bullet.render();
    });
    meteors.forEach((meteor) => {
        meteor.render();
    });
    player.render();
}

function animate() {
    let gameId = requestAnimationFrame(animate);

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    detectCollision();
    updateCanvas();
    removeBullets();
    removeMeteors();
    removeParticles();
    drawCanvas();

    if (isGameOver) {
        cancelAnimationFrame(gameId);
    }
}

function play() {
    init();
    
    spawnMeteor();
    window.addEventListener("click", (e) => {
        let cursorX = e.clientX;
        let cursorY = e.clientY;
        let velocity = getVelocity(
            PLAYER_X,
            PLAYER_Y,
            cursorX,
            cursorY,
            SPEED_TARGET_BULLET
        );
        bullets.push(
            new Bullet(
                PLAYER_X,
                PLAYER_Y,
                BULLET_RADIUS,
                BULLET_COLOR,
                velocity
            )
        );
    });
    animate();
}

play();
