import { Asteroid } from "../asteroid";
import { CelestialBody } from "../base/celestial-body";

export interface AsteroidBelt extends Omit<CelestialBody, "axialTilt"> {
  numOfAsteroids: number;
  asteroids?: Asteroid[];
  depth?: number; // in AU
  fill?: boolean;
  minSize?: number; // in KM
  maxSize?: number; // in KM
  inclination?: number; // Degrees
  innerSemiMajor: number; // in AU
  innerEccentricity: number;
  outerSemiMajor: number; // in AU
  outerEccentricity: number;
}
