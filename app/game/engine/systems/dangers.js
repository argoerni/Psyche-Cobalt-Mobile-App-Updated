import Matter from 'matter-js';
import { Asteroid, Create_Asteroid_Matter } from '../renderers/Asteroid';
import { GAME_DEFAULTS } from '../init';
import {
  SCREEN_WIDTH,
  randomBetween,
  calcDensity,
  outsideOfVerticalBounds,
  touchWithinBounds
} from '../../../game/utilities';

// NOTE :: SYSTEMS
let asteroidDensity = GAME_DEFAULTS.asteroidDensity;
let asteroidIterator = 0;

export const DeployDangers = (entities, {}) => {
  if (asteroidIterator === asteroidDensity) {
    const randomHorizontalPos = randomBetween(0, SCREEN_WIDTH - 1);
    let body = Create_Asteroid_Matter(randomHorizontalPos, 0);
    const minSpeed = entities.levelsystem.speed.asteroid.min;
    const maxSpeed = entities.levelsystem.speed.asteroid.max;
    const speed = randomBetween(minSpeed, maxSpeed);
    const asteroidGeneratedKey = `Asteroid${Math.random()}`;
    entities.created.createdAsteroids.push(asteroidGeneratedKey);
    entities[asteroidGeneratedKey] = { body, speed, renderer: Asteroid };

    const minDensity = entities.levelsystem.density.asteroid.min;
    const density = calcDensity(minDensity);
    asteroidDensity = density;
    asteroidIterator = 0;
  }
  asteroidIterator++;
  return entities;
};

export const RemoveDangers = (entities, {}) => {
  for (asteroid of entities.created.createdAsteroids) {
    if (outsideOfVerticalBounds(entities[asteroid].body.bounds)) {
      delete entities[asteroid];
      const index = entities.created.createdAsteroids.indexOf(asteroid);
      entities.created.createdAsteroids.splice(index, 1);
    }
  }
  return entities;
};

export const DestroyDangers = (entities, { touches, dispatch }) => {
  let touchPositions = [];
  touches
    .filter(t => t.type === 'press')
    .forEach(t => {
      const touchPosition = { x: t.event.pageX, y: t.event.pageY };
      touchPositions.push(touchPosition);
    });
  if (touchPositions.length !== 0) {
    for (let i = 0; i < touchPositions.length; i++) {
      const touchPosition = touchPositions[i];
      for (asteroid of entities.created.createdAsteroids) {
        const bounds = entities[asteroid].body.bounds;
        if (touchWithinBounds(bounds, touchPosition)) {
          delete entities[asteroid];
          const index = entities.created.createdAsteroids.indexOf(asteroid);
          entities.created.createdAsteroids.splice(index, 1);
          dispatch({ type: 'setScore', value: 10 });
        }
      }
    }
  }
  return entities;
};

let asteroidSpeedModifier = 1;
let clockEffectActive = false;
let clockEffectIterator = 0;

export const MoveDangers = (entities, { events }) => {
  // TODO :: MOVE CLOCK EFFECT TO POWERUP/BASE SYSTEMS
  if (events.length) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].type === 'effectClock') {
        // TODO: Handle multiple clock events (iterator + 180?)
        asteroidSpeedModifier = 0.5;
        clockEffectActive = true;
      }
    }
  }

  if (clockEffectActive) {
    if (clockEffectIterator === 180) {
      clockEffectActive = false;
      clockEffectIterator = 0;
      asteroidSpeedModifier = 1;
    } else {
      clockEffectIterator++;
    }
  }

  for (asteroid of entities.created.createdAsteroids) {
    const body = entities[asteroid].body;
    const initialSpeed = entities[asteroid].speed;
    const speed = initialSpeed * asteroidSpeedModifier;
    Matter.Body.translate(body, { x: 0, y: speed });
  }
  return entities;
};

export const RemoveCollidedDangers = (entities, { dispatch, events }) => {
  // TODO :: REFACTOR
  let destroyAsteroids = [];
  if (events.length) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].type === 'asteroidCollision') {
        destroyAsteroids.push(events[i].id);
        entities.destroy.destroyAsteroids.push(events[i].id);
        dispatch({ type: 'setHealth', value: -10 });
      }
    }
  }

  for (asteroid of entities.created.createdAsteroids) {
    for (id of destroyAsteroids) {
      if (entities[asteroid] && entities[asteroid].body.id === id) {
        delete entities[asteroid];
        const index = entities.created.createdAsteroids.indexOf(asteroid);
        entities.created.createdAsteroids.splice(index, 1);
        dispatch({ type: 'removeAfterCollision', id: id });
      }
    }
  }
  return entities;
};
