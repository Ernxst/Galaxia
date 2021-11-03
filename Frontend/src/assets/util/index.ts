import { Asteroid } from "@/@types/celestial/asteroid";
import { Vector3 } from "three";

export function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateAsteroids(
  numOfAsteroids: number,
  inner: number,
  outer: number,
  depth: number,
  minSize: number,
  maxSize: number
): Asteroid[] {
  const innerSquared = inner ** 2;
  const squaredDifference = outer ** 2 - innerSquared;
  const asteroids: Asteroid[] = [];
  for (let i = 0; i < numOfAsteroids; i++) {
    const position = randomAsteroidPosition(
      squaredDifference,
      innerSquared,
      depth
    );
    const asteroid = randomAsteroid(i, position, minSize, maxSize);
    asteroids.push(asteroid);
  }
  return asteroids;
}

function randomAsteroidPosition(
  squaredDifference: number,
  innerSquared: number,
  depth: number
): Vector3 {
  const theta = 2 * Math.PI * Math.random();
  const dist = Math.sqrt(Math.random() * squaredDifference + innerSquared);
  const x = dist * Math.cos(theta);
  const y = randomNumber(-depth, depth);
  const z = dist * Math.sin(theta);
  return new Vector3(x, y, z);
}

export function randomAsteroid(
  id: number,
  position: Vector3,
  minSize: number,
  maxSize: number
): Asteroid {
  // TODO: Extract constants
  return {
    name: `asteroid-${id}`,
    size: randomNumber(minSize, maxSize),
    detail: Math.ceil(randomNumber(0, 12)),
    scale: new Vector3(
      1 + Math.random() * 0.4,
      1 + Math.random() * 0.8,
      1 + Math.random() * 0.4
    ),
    rotation: new Vector3(
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI
    ),
    dayLength: randomNumber(0, 1_000_000),
    axialTilt: randomNumber(0, 90),
    initialPosition: position,
    // TODO: Random mass
    mass: 0,
    // TODO: Random velocity
    meanVelocity: 0,
  };
}
