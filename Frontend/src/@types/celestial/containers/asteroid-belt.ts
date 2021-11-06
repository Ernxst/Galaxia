import { Asteroid } from "../asteroid";
import { CelestialBody } from "../base/celestial-body";

export interface AsteroidBelt extends Omit<CelestialBody, "axialTilt"> {
  numOfAsteroids: number;
  asteroids?: Asteroid[];
  depth?: number; // in AU
  innerRadius: number;
  outerRadius: number;
  fill?: boolean;
  minSize?: number; // in KM
  maxSize?: number; // in KM
  inclination?: number; // Degrees
}
