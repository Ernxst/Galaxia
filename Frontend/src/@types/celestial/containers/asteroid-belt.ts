import { Asteroid } from "../asteroid";
import { OrbittingBody } from "../base/orbitting-body";

export interface AsteroidBelt extends OrbittingBody {
  numOfAsteroids: number;
  asteroids?: Asteroid[];
  models?: string[];
  height: number;
  innerRadius: number;
  outerRadius: number;
  fill: boolean;
}
