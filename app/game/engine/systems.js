import Matter from 'matter-js';
import { Asteroid, Create_Asteroid_Matter } from './renderers/Asteroid';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../game/utilities';
import { ENGINE, WORLD } from './init';

// let createdAsteroids = [];

const Physics = (entities, { time }) => {
  let engine = entities['physics'].engine;
  // engine.world.gravity.y = 0;
  // Matter.Engine.update(engine, time.delta * 0.125);
  Matter.Engine.update(engine, time.delta);
  return entities;
};

// START: DEPLOY ASTEROIDS

const randomBetween = (min, max) => {
  // return Math.floor(Math.random() * (max - min + 1) + min);
  return (Math.random() * (max - min + 1)) << 0;
};

const calcAsteroidSpeed = asteroidsPerSecond => {
  const framesPerSecond = 60;
  return Math.floor(framesPerSecond / asteroidsPerSecond);
};

let speedCounter = 0;
let asteroidSpeed = calcAsteroidSpeed(2);

const DeployAsteroids = (entities, { touches, screen }) => {
  speedCounter++;
  if (speedCounter === asteroidSpeed) {
    let randomHorizontalPos = randomBetween(0, SCREEN_WIDTH - 1);
    let randomVerticalPos = 0;
    // let randomVerticalPos = randomBetween(0, SCREEN_HEIGHT - 1);

    let body = Create_Asteroid_Matter(
      randomHorizontalPos,
      randomVerticalPos,
      Math.trunc(Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.125) / 2
    );

    const asteroidGeneratedKey = `Asteroid${Math.random()}`;
    entities.created.createdAsteroids.push(asteroidGeneratedKey);

    entities[asteroidGeneratedKey] = {
      body: body,
      renderer: Asteroid,
      initial: false
    };

    speedCounter = 0;
  }
  return entities;
};

const matterBounds = {
  max: {
    x: 383.5,
    y: 201.5
  },
  min: {
    x: 283.5,
    y: 173.5
  }
};

const touchHandicap = 0;

const touchWithinBounds = (asteroidBodyBounds, touchPosition) => {
  if (
    touchPosition.x <= asteroidBodyBounds.max.x + touchHandicap &&
    touchPosition.x >= asteroidBodyBounds.min.x - touchHandicap &&
    touchPosition.y <= asteroidBodyBounds.max.y + touchHandicap &&
    touchPosition.y >= asteroidBodyBounds.min.y - touchHandicap
  ) {
    return true;
  }
  return false;
};

const DestroyAsteroids = (entities, { touches, screen }) => {
  let touchPositions = [];

  touches
    .filter(t => t.type === 'press')
    .forEach(t => {
      const touchPosition = {
        x: t.event.pageX,
        y: t.event.pageY
      };
      touchPositions.push(touchPosition);
    });
  if (touchPositions.length !== 0) {
    for (let i = 0; i < touchPositions.length; i++) {
      const touchPosition = touchPositions[i];
      for (asteroid of entities.created.createdAsteroids) {
        if (touchWithinBounds(entities[asteroid].body.bounds, touchPosition)) {
          delete entities[asteroid];
          entities.created.createdAsteroids.splice(
            entities.created.createdAsteroids.indexOf(asteroid),
            1
          );
        }
      }
    }
  }
  return entities;
};

// GOAL: Remove asteroids from memory once top of asteroid is greater than sceen height

const asteroidOutsideOfBounds = (asteroidBodyBounds, screenHeight) => {
  if (asteroidBodyBounds.min.y >= screenHeight) {
    return true;
  }
  return false;
};

const RemoveAsteroids = (entities, { touches, screen }) => {
  for (asteroid of entities.created.createdAsteroids) {
    if (
      asteroidOutsideOfBounds(entities[asteroid].body.bounds, SCREEN_HEIGHT)
    ) {
      delete entities[asteroid];
      entities.created.createdAsteroids.splice(
        entities.created.createdAsteroids.indexOf(asteroid),
        1
      );
    }
  }
  return entities;
};

export { Physics, DeployAsteroids, DestroyAsteroids, RemoveAsteroids };
