export class PreloaderScene extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        /* Макеты */
        this.load.image("progressBar", "assets/layouts/progressBarBg.png");
        this.load.image("menuButton", "assets/layouts/menuButtonBg.png");
        this.load.image("gameField", "assets/layouts/gameFieldBg.png");
        this.load.image("scorePanel", "assets/layouts/scorePanelBg.png");
        this.load.image("bonusBar", "assets/layouts/bonusBarBg.png");

        /* Элементы */

        this.load.image("purpleCube", "assets/cubes/purpleCube.png");
        this.load.image("redCube", "assets/cubes/redCube.png");
        this.load.image("yellowCube", "assets/cubes/yellowCube.png");
        this.load.image("blueCube", "assets/cubes/blueCube.png");
        this.load.image("greenCube", "assets/cubes/greenCube.png");
    }

    create() {
        this.scene.start("Game");
    }
}
