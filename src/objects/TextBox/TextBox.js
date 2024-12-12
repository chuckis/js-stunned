import { GameObject } from "../../GameObject";
import { resources } from "../../Resource";
import { Sprite } from "../../Sprite";
import { Vector2 } from "../../Vector2";

export class TextBox extends GameObject {
    constructor() {
        super({
            position: new Vector2(32, 112)
        });

        this.content = "Hello, How are You?";
        this.backdrop = new Sprite({
            resource: resources.images.textBox,
            frameSize: new Vector2(256, 64),

        })
    }
    drawImage(ctx, drawPosX, drawPosY) {

        // Draw bakdrop first
        this.backdrop.drawImage(ctx, drawPosX, drawPosY)

        // Now we draw text...
        ctx.font = "12px fontRetroGaming";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#fff";

        const MAX_WIDTH = 250;
        const LINE_HEIGHT = 20;
        const PADDING_LEFT = 10;
        const PADDING_TOP = 12;

        ctx.fillText(this.content, drawPosX+PADDING_LEFT, drawPosY+PADDING_TOP);
    }
}