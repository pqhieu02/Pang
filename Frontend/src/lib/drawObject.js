import {
    TYPE_CIRCLE,
    TYPE_HEXAGON,
    TYPE_SQUARE,
    TYPE_TRIANGLE,
} from "../constant.js";

export default function drawObject(context, object) {
    //https://www.khanacademy.org/computing/pixar/sets/rotation/v/sets-9
    //https://en.wikipedia.org/wiki/Rotation_matrix
    let radian = (object.angle * Math.PI) / 180;
    context.beginPath();
    context.fillStyle = object.color;
    context.transform(
        Math.cos(radian),
        Math.sin(radian),
        Math.sin(radian),
        -Math.cos(radian),
        object.x,
        object.y
    );
    switch (object.type) {
        case TYPE_HEXAGON: {
            let a = (2 * Math.PI) / 6;
            let height = object.size;
            let centerToVertices = height / (Math.sqrt(3) / 2);

            for (let i = 0; i < 6; i++) {
                context.lineTo(
                    centerToVertices * Math.cos(a * i),
                    centerToVertices * Math.sin(a * i)
                );
            }
            break;
        }
        case TYPE_CIRCLE: {
            context.arc(0, 0, object.size, 0, Math.PI * 2);
            break;
        }
        case TYPE_SQUARE: {
            context.rect(
                -object.size,
                -object.size,
                object.size * 2,
                object.size * 2
            );
            break;
        }
        case TYPE_TRIANGLE: {
            // let a = object.size / (Math.sqrt(3) / 6);
            // let height = a * (Math.sqrt(3) / 2);
            // let distanceFromCenterToVertex = height * (2 / 3);
            // let X = 0;
            // let Y = -distanceFromCenterToVertex;

            // context.moveTo(X, Y);
            // context.lineTo(X - a / 2, Y + height);
            // context.lineTo(X + a / 2, Y + height);
            // break;
            
            // object.size *= 2;
            let a = object.size * 2;
            let height = a * (Math.sqrt(3) / 2);
            let distanceFromCenterToVertex = (2 * height) / 3;
            let X = 0;
            let Y = -distanceFromCenterToVertex;

            context.moveTo(X, Y);
            context.lineTo(-a / 2, height / 3);
            context.lineTo(a / 2, height / 3);
            break;
        }
    }
    context.fill();
    context.resetTransform();
}
