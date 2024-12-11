import { GameObject } from "../../GameObject";
import { Vector2 } from "../../Vector2";
import { resources } from "../../Resource";
import { Sprite } from "../../Sprite";

export class Exit extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
        })
        this.addChild(new Sprite({
            resource: resources.images.exit
        }))
        
    }
}