import { Planet } from "../planet";
import { Star } from "../star";
import { AsteroidBelt } from "./asteroid-belt";

export interface StarSystem {
  name: string;
  star: Star;
  planets: Planet[];
  asteroidBelts: AsteroidBelt[];
}
