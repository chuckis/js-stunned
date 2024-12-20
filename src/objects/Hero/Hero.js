import { GameObject } from "../../GameObject";
import { DOWN, LEFT, UP, RIGHT } from "../../Input";
import { Sprite } from "../../Sprite";
import { Vector2 } from "../../Vector2";
import { resources } from "../../Resource";
import { Animations } from "../../Animations";
import { FrameIndexPattern } from "../../FrameIndexPattern";
import { 
    STAND_LEFT, 
    STAND_DOWN, 
    STAND_UP, 
    STAND_RIGHT, 
    WALK_DOWN, 
    WALK_LEFT, 
    WALK_RIGHT, 
    WALK_UP, 
    PICK_UP_DOWN
} from './heroAnimation';
import { moveTowards } from "../../helpers/moveTowards";
import { isSpaceFree } from "../../helpers/grid";
import { events } from "../../Events";

export class Hero extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y)
        });

        this.body = new Sprite({
            resource: resources.images.hero,
            frameSize: new Vector2(32, 32),
            hFrames: 3,
            vFrames: 8,
            frame: 1,
            position: new Vector2(-8, -20),
            animations: new Animations({
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                walkUp: new FrameIndexPattern(WALK_UP),
                walkDown: new FrameIndexPattern(WALK_DOWN),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                standUp: new FrameIndexPattern(STAND_UP),
                standDown: new FrameIndexPattern(STAND_DOWN),
                standRight: new FrameIndexPattern(STAND_RIGHT),
                pickUpDown: new FrameIndexPattern(PICK_UP_DOWN)
            })
        })
        this.facingDirection = DOWN;
        this.destinationPosition = this.position.duplicate()
        this.addChild(this.body);
        this.isLocked = false;

        this.shadow = new Sprite({
            resource: resources.images.shadow,
            frameSize: new Vector2(32, 32),
            position: new Vector2(-8, -19)
        })
        this.addChild(this.shadow);
        this.itemPickupTime = 0;
        this.itemPickupShell =null;

        events.on("HERO_PICKS_UP_ITEM", this, data => {
            this.onPickupItem(data)
        })
    }

    ready() {
        events.on("START_TEXT_BOX", this, () => {
            this.isLocked = true;
        })
        events.on("END_TEXT_BOX", this, () => {
            this.isLocked = false;
        })
    }

    step(delta, root) {

        if (this.isLocked) {
            return;
        }

        if (this.itemPickupTime > 0) {
            
            this.workOnItemPickup(delta);
            return;
        }

        // Check for input
        const input = root.input;
        if(input?.getActionJustPressed("Space")) {
            const objAtPosition = this.parent.children.find(child => {
                return child.position.matches(this.position.toNeighbor(this.facingDirection));
            })
            if (objAtPosition) {
                events.emit("HERO_REQUESTS_ACTION", objAtPosition);
            }
        }


        const distance = moveTowards(this, this.destinationPosition, 1)
        const hasArrived = distance <= 1;
        if (hasArrived) {
            this.tryMove(root);
        }
        this.tryEmitPosition()
    }

    tryEmitPosition() {
        if (this.lastX === this.position.x && this.lastY === this.position.y) {
            return
        }
        this.lastX = this.position.x;
        this.lastY = this.position.y;

        events.emit('HERO_POSITION', this.position);
    }

    tryMove(root) {

        const { input } = root;

        if (!input.direction) {
            if (this.facingDirection === LEFT) { this.body.animations.play("standLeft") };
            if (this.facingDirection === RIGHT) { this.body.animations.play("standRight") };
            if (this.facingDirection === UP) { this.body.animations.play("standUp") };
            if (this.facingDirection === DOWN) { this.body.animations.play("standDown") };
            return;
        }

        let nextX = this.destinationPosition.x;
        let nextY = this.destinationPosition.y;
        const gridSize = 16;

        if (input.direction === DOWN) {
            nextY += gridSize;
            this.body.animations.play("walkDown");
        }
        if (input.direction === UP) {
            nextY -= gridSize;
            this.body.animations.play("walkUp");
        }
        if (input.direction === RIGHT) {
            nextX += gridSize;
            this.body.animations.play("walkRight");
        }
        if (input.direction === LEFT) {
            nextX -= gridSize;
            this.body.animations.play("walkLeft");
        }

        this.facingDirection = input.direction ?? this.facingDirection;

        // Validating that the next destination is free

        const spaceIsFree = isSpaceFree(root.level?.walls, nextX, nextY);
        const solidBodyAtSpace = this.parent.children.find(c => {
            return c.isSolid && c.position.x === nextX && c.position.y === nextY;
        })
         
        if (spaceIsFree && !solidBodyAtSpace) {
            this.destinationPosition.x = nextX;
            this.destinationPosition.y = nextY;
        }


    }

    onPickupItem({ image, position }) {
        // make sure we land right on the item
        this.destinationPosition = position.duplicate();
        // Start th pickup animation
        this.itemPickupTime = 500; // ms
        this.itemPickupShell = new GameObject({});
        this.itemPickupShell.addChild(new Sprite({
            resource: image,
            position: new Vector2(0, -18)
        }))
        this.addChild(this.itemPickupShell);
        
    }

    workOnItemPickup(delta) {
        this.itemPickupTime -= delta;
        this.body.animations.play("pickUpDown");
        // remove item being overhead
        if (this.itemPickupTime <= 0) {
            this.itemPickupShell.destroy()
        }
    }
}