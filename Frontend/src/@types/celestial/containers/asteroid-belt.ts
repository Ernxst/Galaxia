import { Asteroid } from "../asteroid";
import { CelestialBody } from "../base/celestial-body";

export interface AsteroidBelt extends CelestialBody {
  numOfAsteroids: number;
  asteroids?: Asteroid[];
  depth?: number; // in KM
  innerRadius: number;
  outerRadius: number;
  fill?: boolean;
  minSize?: number; // in KM
  maxSize?: number; // in KM
}
