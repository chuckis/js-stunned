import { Camera } from "../../Camera";
import { events } from "../../Events";
import { GameObject } from "../../GameObject";
import { Input } from "../../Input";
import { Inventory } from "../Inventory/Inventory";
import { TextBox } from "../TextBox/TextBox";

export class Main extends GameObject {
    constructor() {
        super({

        });
        this.level = null;
        this.input = new Input();
        this.inventory  =new Inventory();
        this.camera = new Camera();
        this.textbox = new TextBox()
    }

    ready() {
        events.on("CHANGE_LEVEL", this, newLevelInstance => {
            this,this.setLevel(newLevelInstance);
        })
    }

    setLevel(newLevelInstance) {

        if (this.level) {
            this.level.destroy();
        }

        this.level = newLevelInstance;
        this.addChild(this.level);
    }

    drawBackground(ctx) {
        this.level?.background.drawImage(ctx, 0, 0);
    }

    drawForeground(ctx) {
        this.inventory.draw(ctx, this.inventory.position.x, this.inventory.position.y);
        this.textbox.draw(ctx, 0, 0);
    }
}