import { Animations } from './src/Animations';
import { FrameIndexPattern } from './src/FrameIndexPattern';
import { GameLoop } from './src/GameLoop';
import { gridCells, isSpaceFree } from './src/helpers/grid';
import { moveTowards } from './src/helpers/moveTowards';
import { DOWN, Input, LEFT, RIGHT, UP } from './src/Input';
import { walls } from './src/levels/level1';
import { STAND_LEFT, STAND_DOWN, STAND_UP, STAND_RIGHT, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from './src/objects/Hero/heroAnimation';
import { resources } from './src/Resource';
import { Sprite } from './src/Sprite';
import { Vector2 } from './src/Vector2';
import './style.css'

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const skySprite = new Sprite({
    resource: resources.images.sky,
    frameSize: new Vector2(320, 180)
})

const groundSprite = new Sprite({
    resource: resources.images.ground,
    frameSize: new Vector2(320, 180)
})

const hero = new Sprite({
    resource: resources.images.hero,
    frameSize: new Vector2(32, 32),
    hFrames: 3,
    vFrames: 8,
    frame: 1,
    position: new Vector2(gridCells(6), gridCells(5)),
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

const heroDestinationPosition = hero.position.duplicate();
let heroFacing = DOWN; 

const shadow = new Sprite({
    resource: resources.images.shadow,
    frameSize: new Vector2(32, 32)
})

const input = new Input();

const update = (delta) => {

    const distance = moveTowards(hero, heroDestinationPosition, 1)
    const hasArrived = distance <= 1;
    if (hasArrived) {
        tryMove();
    }
    
    // Work on hero animations
    hero.step(delta);
    
};

const tryMove = () => {

    if (!input.direction) {
        if (heroFacing === LEFT) {hero.animations.play("standLeft")};
        if (heroFacing === RIGHT) {hero.animations.play("standRight")};
        if (heroFacing === UP) {hero.animations.play("standUp")};
        if (heroFacing === DOWN) {hero.animations.play("standDown")}; 
        return;
    }

    let nextX = heroDestinationPosition.x;
    let nextY = heroDestinationPosition.y;
    const gridSize = 16;

    if (input.direction === DOWN) {
        nextY += gridSize;
        hero.animations.play("walkDown");
    }
    if (input.direction === UP) {
        nextY -= gridSize;
        hero.animations.play("walkUp");
    }
    if (input.direction === RIGHT) {
        nextX += gridSize;
        hero.animations.play("walkRight");
    }
    if (input.direction === LEFT) {
        nextX -= gridSize;
        hero.animations.play("walkLeft");
    }

    heroFacing = input.direction ?? heroFacing;

    // Validating that the next destination is free
    if (isSpaceFree(walls, nextX, nextY)) {
        heroDestinationPosition.x = nextX;
        heroDestinationPosition.y = nextY; 
    }

    
}

const draw = () => {
    skySprite.drawImage(ctx, 0, 0);
    groundSprite.drawImage(ctx, 0, 0);

    // Center the Hero in the cell
    const heroOffset = new Vector2(-8, -21);
    const heroPosX = hero.position.x + heroOffset.x;
    const heroPosY = hero.position.y + 1 + heroOffset.y;
    shadow.drawImage(ctx, heroPosX, heroPosY);
    hero.drawImage(ctx, heroPosX, heroPosY);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();