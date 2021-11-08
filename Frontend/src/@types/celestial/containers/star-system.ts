import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Planet } from "../planet";
import { Star } from "../star";
import { AsteroidBelt } from "./asteroid-belt";


export interface StarSystem {
  name: string;
  star: Star;
  planets: Array<Planet | RingedPlanet>;
  asteroidBelts: AsteroidBelt[];
}
