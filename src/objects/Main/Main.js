import { Camera } from "../../Camera";
import { events } from "../../Events";
import { GameObject } from "../../GameObject";
import { Input } from "../../Input";
import { Inventory } from "../Inventory/Inventory";
import { SpriteTextString } from "../SpriteTextString/SpriteTextString";

export class Main extends GameObject {
    constructor() {
        super({

        });
        this.level = null;
        this.input = new Input();
        this.camera = new Camera();
        
    }

    ready() {
        const inventory = new Inventory();
        this.addChild(inventory);

        setTimeout(() => {
            const textbox = new SpriteTextString("Hello! This is a content! This is a content! This is a content! This is a content!");
        this.addChild(textbox);
        }, 300);
        
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

    drawObjects(ctx) {
        this.children.forEach(child => {
            if (child.drawLayer !== "HUD") {
                child.draw(ctx, 0, 0);
            }
        }) 
    }

    drawForeground(ctx) {
 
        this.children.forEach(child => {
            if (child.drawLayer === "HUD") {
                child.draw(ctx, 0, 0);
            }
        })
    }
}