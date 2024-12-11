
import { GameLoop } from './src/GameLoop';
import { CaveLevel1 } from './src/levels/CaveLevel1';
import { OutdoorLevel1 } from './src/levels/OutdoorLevel1';
import { Main } from './src/objects/Main/Main';
import { Vector2 } from './src/Vector2';
import './style.css'
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const mainScene = new Main({
    position: new Vector2(0,0)
});

// mainScene.setLevel(new OutdoorLevel1);
mainScene.setLevel(new CaveLevel1);

const update = (delta) => {
    mainScene.stepEntry(delta, mainScene)
    // console.log(`${hero.position.x} ${hero.position.y}`);
};

const draw = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mainScene.drawBackground(ctx);

    // Save the current state (for camera offset)
    ctx.save();
    // Offset by camera position
    if (mainScene.camera) {
        ctx.translate(mainScene.camera.position.x, mainScene.camera.position.y);
    }

    mainScene.draw(ctx, 0, 0);
    // Restore to original state
    ctx.restore();

    // Draw anything above the game world
    mainScene.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();