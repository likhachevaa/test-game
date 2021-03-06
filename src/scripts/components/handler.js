import GameAlgorithm from "./GameAlgorithm";
import gameSettings from "../config/game-config";

export class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
        this.score = 0;
        this.scoreText = "";
    }

    preload() {

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        /* Отрисовка макетов */

        this.items = this.add.group([
            {
                key: "progressBar",
                setXY: {
                    x: width / 2 - 25,
                    y: 63
                }
            },
            {
                key: "menuButton",
                setXY: {
                    x: width - 75,
                    y: 68
                }
            },
            {
                key: "gameField",
                setXY: {
                    x: width / 4 + 25,
                    y: height / 2 + 50
                },
                setScale: {
                    x: 1.02,
                    y: 1.03
                }
            },
            {
                key: "scorePanel",
                setXY: {
                    x: width / 5 * 4 - 30,
                    y: height / 2 - 80
                }
            },
            {
                key: "bonusBar",
                setXY: {
                    x: width / 5 * 4 - 35,
                    y: height / 5 * 4 + 27
                }
            }
        ]);

        this.load.spritesheet("cubes_sprite", "assets/cubes/cubesSprite.png", {
            frameWidth: 62.2,
            frameHeight: 71
        });
        this.scoreText = this.add.text(width / 5 * 4 - 80, height / 2 + 30, '0', { fontSize: '55px', fill: '#fff', align: "center" });
    }

    create() {
        this.newGame = new GameAlgorithm({
            rows: 9,
            columns: 9,
            items: 5
        });
        this.newGame.createBoard();
        this.createPlayField();
        this.canBreak = true;
        this.input.on("pointerdown", this.cubeSelection, this);
    }

    createPlayField() {
        this.poolArray = [];
        for (let i = 0; i < this.newGame.getRows(); i++) {
            for (let j = 0; j < this.newGame.getColumns(); j++) {
                let cubeX = gameSettings.boardOffset.x + gameSettings.cubeProportions_x * j + gameSettings.cubeProportions_x / 2;
                let cubeY = gameSettings.boardOffset.y + gameSettings.cubeProportions_y * i + gameSettings.cubeProportions_y / 2;
                let cube = this.add.sprite(cubeX, cubeY, "cubes_sprite", this.newGame.getValue(i, j));
                this.newGame.setCustomData(i, j, cube);
            }
        }
    }

    cubeSelection(pointer) {
        if (this.canBreak) {
            let row = Math.floor((pointer.y - gameSettings.boardOffset.y) / gameSettings.cubeProportions_y);
            let col = Math.floor((pointer.x - gameSettings.boardOffset.x) / gameSettings.cubeProportions_x);
            if (this.newGame.valPick(row, col)) {
                if (this.newGame.countConnectItems(row, col) > 1) {
                    this.canBreak = false;
                    let removeCube = this.newGame.listConnectItems(row, col);
                    let destroyed = 0;
                    removeCube.forEach(function (cube) {
                        destroyed++;
                        this.poolArray.push(this.newGame.getCustomData(cube.row, cube.column));
                        this.tweens.add({
                            targets: this.newGame.getCustomData(cube.row, cube.column),
                            alpha: 0,
                            duration: gameSettings.breakSpeed,
                            callbackScope: this,
                            onComplete: function () {
                                destroyed--;
                                if (destroyed === 0) {
                                    this.newGame.removeConnectItems(row, col);
                                    this.cubeFalling();
                                }
                            }
                        });
                    }.bind(this))
                }
            }
        }
    }

    cubeFalling() {
        let fallingCubes = 0;
        let moves = this.newGame.fallBoard();
        let refillMoves = this.newGame.refillBoard();
        this.changeScore(this.newGame.plotFillArray.length,);
        moves.forEach(function (movement) {
            fallingCubes++;
            this.tweens.add({
                targets: this.newGame.getCustomData(movement.row, movement.column),
                y: this.newGame.getCustomData(movement.row, movement.column).y + gameSettings.cubeProportions_y * movement.deltaRow,
                duration: gameSettings.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    fallingCubes--;
                    if (fallingCubes === 0) {
                        this.canBreak = true
                    }
                }
            })
        }.bind(this));
        refillMoves.forEach(function (movement) {
            fallingCubes++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = gameSettings.boardOffset.y + gameSettings.cubeProportions_y * (movement.row - movement.deltaRow + 1) - gameSettings.cubeProportions_y / 2;
            sprite.x = gameSettings.boardOffset.x + gameSettings.cubeProportions_x * movement.column + gameSettings.cubeProportions_x / 2;
            sprite.setFrame(this.newGame.getValue(movement.row, movement.column));
            this.newGame.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: gameSettings.boardOffset.y + gameSettings.cubeProportions_y * movement.row + gameSettings.cubeProportions_y / 2,
                duration: gameSettings.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    fallingCubes--;
                    if (fallingCubes === 0) {
                        this.canBreak = true
                    }
                }
            });
        }.bind(this))
    }

    /* Подсчет очков */

    changeScore(cube) {
        if (cube < 3) {
            this.score += 5 * cube;
        } else if (cube >= 3 && cube < 5) {
            this.score += 10 * cube;
        } else if (cube >= 5) {
            this.score += 20 * cube;
        }
        this.scoreText.setText(this.score);
    }
}
