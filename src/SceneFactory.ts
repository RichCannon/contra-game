import { EnemiesFactory } from "./entities/Enemies/EnemiesFactory";
import Platform from "./entities/Platforms/Platform";
import PlatformFactory from "./entities/Platforms/PlatformFactory";

export default class SceneFactory {
  #platformsFactory: PlatformFactory;
  #enemiesFactory: EnemiesFactory;

  #blockSize = 128;

  constructor(
    platformFactory: PlatformFactory,
    enemiesFactory: EnemiesFactory
  ) {
    this.#platformsFactory = platformFactory;
    this.#enemiesFactory = enemiesFactory;
  }

  get platforms() {
    return this.#platformsFactory.platforms;
  }

  createScene() {
    this.#createPlatform();
    this.#createGround();
    this.#createWater();
    this.#createBossWall();
    this.#createBridges();
    this.#createEnemies();
  }

  #createPlatform() {
    let xIndexes = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];

    this.#create(xIndexes, 276, this.#platformsFactory.createPlatform);

    xIndexes = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25,
      34, 35, 36, 45, 46, 47, 48,
    ];
    this.#create(xIndexes, 384, this.#platformsFactory.createPlatform);
    xIndexes = [5, 6, 7, 13, 14, 31, 32, 49];
    this.#create(xIndexes, 492, this.#platformsFactory.createPlatform);
    xIndexes = [46, 47, 48];
    this.#create(xIndexes, 578, this.#platformsFactory.createPlatform);
    xIndexes = [8, 11, 28, 29, 30];
    this.#create(xIndexes, 600, this.#platformsFactory.createPlatform);
    xIndexes = [50];
    this.#create(xIndexes, 624, this.#platformsFactory.createPlatform);
  }

  #create(
    xIndexes: number[],
    y: number,
    createFunc: (x: number, y: number, isClimb?: boolean) => void
  ) {
    const xBLockW = 128;
    // const yBlockH = 128;
    for (let i = 0; i < xIndexes.length; i++) {
      const x = xIndexes[i];
      createFunc.call(this.#platformsFactory, xBLockW * x, y);
    }
  }

  #createGround() {
    let xIndexes = [9, 10, 25, 26, 27, 32, 33, 34];
    this.#create(xIndexes, 720, this.#platformsFactory.createStepBox);
    xIndexes = [36, 37, 39, 40];
    this.#create(xIndexes, 600, this.#platformsFactory.createBox);
    xIndexes = [42, 43];
    this.#create(xIndexes, 492, this.#platformsFactory.createBox);
    xIndexes = [35, 45, 46, 47, 48, 49, 50, 51, 52];
    this.#create(xIndexes, 720, this.#platformsFactory.createBox);
  }
  #createWater() {
    let xIndexes = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 28, 29, 30, 31,
    ];
    this.#create(xIndexes, 768, this.#platformsFactory.createWater);
  }

  #createBossWall() {
    let xIndexes = [52];
    this.#create(xIndexes, 170, this.#platformsFactory.createBossWall);
  }

  #createBridges() {
    let xIndexes = [16, 17, 18, 19];
    this.#create(xIndexes, 384, this.#platformsFactory.createBridge);
  }

  #createEnemies() {
    this.#enemiesFactory.createRunner(this.#blockSize * 9, 290);
    this.#enemiesFactory.createRunner(this.#blockSize * 10, 290);
    this.#enemiesFactory.createRunner(this.#blockSize * 11, 290);

    this.#enemiesFactory.createRunner(this.#blockSize * 13, 290);
    this.#enemiesFactory.createRunner(this.#blockSize * 13 + 50, 290);
    this.#enemiesFactory.createRunner(this.#blockSize * 13 + 100, 290);

    this.#enemiesFactory.createRunner(this.#blockSize * 16, 290);

    this.#enemiesFactory.createRunner(this.#blockSize * 20, 290);
    this.#enemiesFactory.createRunner(this.#blockSize * 21, 290);

    this.#enemiesFactory.createRunner(this.#blockSize * 29, 290);
    this.#enemiesFactory.createRunner(this.#blockSize * 30, 290);

    this.#enemiesFactory.createRunner(this.#blockSize * 40, 400, 1);
    this.#enemiesFactory.createRunner(this.#blockSize * 42, 400, 1);

    this.#enemiesFactory.createTurret(this.#blockSize * 10, 670);
    this.#enemiesFactory.createTurret(this.#blockSize * 22 + 50, 500);
    this.#enemiesFactory.createTurret(this.#blockSize * 29 + 64, 550);
    this.#enemiesFactory.createTurret(this.#blockSize * 35 + 64, 550);
    this.#enemiesFactory.createTurret(this.#blockSize * 45 + 64, 670);
    this.#enemiesFactory.createTurret(this.#blockSize * 48 + 64, 670);
  }
}
