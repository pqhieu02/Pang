import { canvas, WORLD_HEIGHT, WORLD_WIDTH } from "../constant.js";

const BASE_URL = "http://localhost:8080/BallBlast/Entry";
// export const BASE_URL = "https://pang.backend.quangnau.com/Entry";

export async function test(playerId) {
    console.log(`Sending ${playerId}`);
    // playerId = playerId.replace(/(\r\n|\n|\r)/gm, "");
    let res = await fetch(BASE_URL, {
        method: "post",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "test",
            playerId: playerId,
        }),
    });
}

export async function registerForId() {
    let res = await fetch(BASE_URL, {
        method: "post",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "register",
            screenWidth: canvas.width,
            screenHeight: canvas.height,
        }),
    });
    let playerId = await res.text();
    playerId = playerId.replace(/(\r\n|\n|\r)/gm, "");
    return playerId;
}

export async function getGameState(playerId) {
    try {
        let res = await fetch(BASE_URL, {
            method: "post",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "getGameState",
                playerId: playerId,
            }),
        });
        let responseDataInText = await res.text();
        let responseDataInJson = JSON.parse(responseDataInText);
        return responseDataInJson;
    } catch {
        return "error";
    }
}

export async function updatePlayerData(playerId) {
    await fetch(BASE_URL, {
        method: "post",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "updatePlayerData",
            playerId: playerId,
            screenWidth: canvas.width,
            screenHeight: canvas.height,
        }),
    });
}

export async function fire(playerId, playerX, playerY, cursorX, cursorY) {
    const fromClientCoordinateToWorldCoordinate = (
        playerX,
        playerY,
        cursorX,
        cursorY
    ) => {
        let cameraTopX, cameraTopY, cameraBotX, cameraBotY;
        let bonusBotX = 0,
            bonusBotY = 0,
            bonusTopX = 0,
            bonusTopY = 0;

        bonusTopX =
            playerX + canvas.width / 2 > WORLD_WIDTH
                ? WORLD_WIDTH - playerX - canvas.width / 2
                : 0;
        bonusBotX =
            playerX - canvas.width / 2 < 0 ? -playerX + canvas.width / 2 : 0;

        bonusTopY =
            playerY + canvas.height / 2 > WORLD_HEIGHT
                ? WORLD_HEIGHT - playerY - canvas.height / 2
                : 0;
        bonusBotY =
            playerY - canvas.height / 2 < 0 ? -playerY + canvas.height / 2 : 0;

        cameraTopX = Math.max(playerX - canvas.width / 2 + bonusTopX, 0);
        cameraTopY = Math.max(playerY - canvas.height / 2 + bonusTopY, 0);
        cameraBotX = Math.min(
            playerX + canvas.width / 2 + bonusBotX,
            WORLD_WIDTH
        );
        cameraBotY = Math.min(
            playerY + canvas.height / 2 + bonusBotY,
            WORLD_HEIGHT
        );

        let player_screen_x = playerX - cameraTopX;
        let player_screen_y = playerY - cameraTopY;

        let worldCoordinate = {
            x: playerX + (cursorX - player_screen_x),
            y: playerY + (cursorY - player_screen_y),
        };
        return worldCoordinate;
    };

    let coordinate = fromClientCoordinateToWorldCoordinate(
        playerX,
        playerY,
        cursorX,
        cursorY
    );
    await fetch(BASE_URL, {
        method: "post",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "fire",
            playerId: playerId,
            x: coordinate.x,
            y: coordinate.y,
        }),
    });
}

export async function setKey(playerId, key) {
    await fetch(BASE_URL, {
        method: "post",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "setKey",
            playerId: playerId,
            key: key,
        }),
    });
}

export async function unsetKey(playerId, key) {
    await fetch(BASE_URL, {
        method: "post",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "unsetKey",
            playerId: playerId,
            key: key,
        }),
    });
}
