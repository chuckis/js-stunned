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
    WALK_UP 
} from './heroAnimation';
import { moveTowards } from "../../helpers/moveTowards";
import { isSpaceFree } from "../../helpers/grid";
import { walls } from "../../levels/level1";

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
                standRight: new FrameIndexPattern(STAND_RIGHT)
            })
        })
        this.facingDirection = DOWN;
        this.destinationPosition = this.position.duplicate()
        this.addChild(this.body);

        this.shadow = new Sprite({
            resource: resources.images.shadow,
            frameSize: new Vector2(32, 32),
            position: new Vector2(-8, -19)
        })
        this.addChild(this.shadow);
    }

    step(delta, root) {
        const distance = moveTowards(this, this.destinationPosition, 1)
        const hasArrived = distance <= 1;
        if (hasArrived) {
            this.tryMove(root);
        }
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
        if (isSpaceFree(walls, nextX, nextY)) {
            this.destinationPosition.x = nextX;
            this.destinationPosition.y = nextY;
        }


    }
}