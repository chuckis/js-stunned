import { Animations } from './src/Animations';
import { FrameIndexPattern } from './src/FrameIndexPattern';
import { GameLoop } from './src/GameLoop';
import { GameObject } from './src/GameObject';
import { gridCells, isSpaceFree } from './src/helpers/grid';
import { moveTowards } from './src/helpers/moveTowards';
import { DOWN, Input, LEFT, RIGHT, UP } from './src/Input';
import { walls } from './src/levels/level1';
import { Hero } from './src/objects/Hero/Hero';
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
mainScene.addChild(skySprite)
const groundSprite = new Sprite({
    resource: resources.images.ground,
    frameSize: new Vector2(320, 180)
})
mainScene.addChild(groundSprite)

const hero = new Hero(gridCells(6), gridCells(5))
mainScene.addChild(hero);

mainScene.input = new Input();

const update = (delta) => {
    mainScene.stepEntry(delta, mainScene)
    // console.log(`${hero.position.x} ${hero.position.y}`);
};

const draw = () => {

    mainScene.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();