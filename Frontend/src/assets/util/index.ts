import { Asteroid } from "@/@types/celestial/asteroid";
import { Vector3 } from "three";

export function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateAsteroids(
  numOfAsteroids: number,
  innerSemiMajor: number,
  innerEccentricity: number,
  outerSemiMajor: number,
  outerEccentricity: number,
  depth: number,
  minSize: number,
  maxSize: number
): Asteroid[] {
  const asteroids: Asteroid[] = [];
  const innerEccentricitySquared = innerEccentricity ** 2.0;
  const outerEccentricitySquared = outerEccentricity ** 2.0;
  const innerSemiMinor = innerSemiMajor ** 2.0 * (1 - innerEccentricitySquared);
  const outerSemiMinor = outerSemiMajor ** 2.0 * (1 - outerEccentricitySquared);

  for (let i = 0; i < numOfAsteroids; i++) {
    const position = randomAsteroidPosition(
      innerSemiMinor,
      innerEccentricitySquared,
      outerSemiMinor,
      outerEccentricitySquared,
      depth
    );
    const asteroid = randomAsteroid(i, position, minSize, maxSize);
    asteroids.push(asteroid);
  }
  return asteroids;
}

function randomAsteroidPosition(
  innerSemiMinor: number,
  innerEccentricitySquared: number,
  outerSemiMinor: number,
  outerEccentricitySquared: number,
  depth: number
): Vector3 {
  const theta = 2 * Math.PI * Math.random();
  const cosTheta = Math.cos(theta);
  const cosThetaSquared = cosTheta ** 2.0;

  const innerDistSquared =
    innerSemiMinor / (1 - innerEccentricitySquared * cosThetaSquared);
  const outerDistSquared =
    outerSemiMinor / (1 - outerEccentricitySquared * cosThetaSquared);

  const dist = randomNumber(
    Math.sqrt(innerDistSquared),
    Math.sqrt(outerDistSquared)
  );

  const x = dist * cosTheta;
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
    mass: 0,
    meanVelocity: 0,
  };
}
