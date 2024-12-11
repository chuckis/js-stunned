import { events } from "./Events";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export class Camera extends GameObject {
    constructor() {
        super({});

        events.on('HERO_POSITION', this, heroPosition => {
            this.centerPositionOnTarget(heroPosition);
        })
        // Camera knows when a new level starts
        events.on("CHANGE_LEVEL", this, (newMap) => {
            this.centerPositionOnTarget(newMap.heroStartPosition);
        })

    }
    centerPositionOnTarget(pos) {
        // Create a new position based on the incoming position
        const personHalf = 8;
        const canvasWidth = 320;
        const canvasHeight = 180;
        const halfWidth = -personHalf + canvasWidth / 2;
        const halfHeight = -personHalf + canvasHeight / 2;

        // console.log("HERO MOVED!", heroPosition)
        this.position = new Vector2(
            -pos.x + halfWidth, 
            -pos.y + halfHeight, 
        )
    }
}