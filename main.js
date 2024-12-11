import { Animations } from './src/Animations';
import { Camera } from './src/Camera';
import { events } from './src/Events';
import { FrameIndexPattern } from './src/FrameIndexPattern';
import { GameLoop } from './src/GameLoop';
import { GameObject } from './src/GameObject';
import { gridCells, isSpaceFree } from './src/helpers/grid';
import { moveTowards } from './src/helpers/moveTowards';
import { DOWN, Input, LEFT, RIGHT, UP } from './src/Input';
import { walls } from './src/levels/level1';
import { Exit } from './src/objects/Exit/Exit';
import { Hero } from './src/objects/Hero/Hero';
import { Inventory } from './src/objects/Inventory/Inventory';
import { Rod } from './src/objects/Rod/Rod';
import { resources } from './src/Resource';
import { Sprite } from './src/Sprite';
import { Vector2 } from './src/Vector2';
import './style.css'

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const mainScene = new GameObject({
    position: new Vector2(0,0)
});
const skySprite = new Sprite({
    resource: resources.images.sky,
    frameSize: new Vector2(320, 180)
})

const groundSprite = new Sprite({
    resource: resources.images.ground,
    frameSize: new Vector2(320, 180)
})
mainScene.addChild(groundSprite)

const exit = new Exit(gridCells(6), gridCells(3));
mainScene.addChild(exit);

const hero = new Hero(gridCells(6), gridCells(5))
mainScene.addChild(hero);

const camera = new Camera();
mainScene.addChild(camera);

const rod = new Rod(gridCells(7), gridCells(6));
mainScene.addChild(rod);

const inventory  =new Inventory()

mainScene.input = new Input();

const update = (delta) => {
    mainScene.stepEntry(delta, mainScene)
    // console.log(`${hero.position.x} ${hero.position.y}`);
};

const draw = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    skySprite.drawImage(ctx, 0, 0);

    // Save the current state (for camera offset)
    ctx.save();
    // Offset by camera position
    ctx.translate(camera.position.x, camera.position.y);

    mainScene.draw(ctx, 0, 0);
    // Restore to original state
    ctx.restore();

    // Draw anything above the game world
    inventory.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();