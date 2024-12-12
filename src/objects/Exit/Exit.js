import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { resources } from "../../Resource";
import { Sprite } from "../../Sprite";
import { events } from "../../Events";

export class Exit extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
        })
        this.addChild(new Sprite({
            resource: resources.images.exit
        }))
        this.drawLayer = "FLOOR";
        
    }

    ready() {
        events.on("HERO_POSITION", this, pos => {
            // detect overlap
            const roundedHeroX = Math.round(pos.x)
            const roundedHeroY = Math.round(pos.y)
            if (roundedHeroX === this.position.x && roundedHeroY === this.position.y) {
                events.emit("HERO_EXITS");
            }
        })
    }

}