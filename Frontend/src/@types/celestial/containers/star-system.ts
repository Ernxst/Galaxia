import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Planet } from "../planet";
import { Star } from "../star";
import { AsteroidBelt } from "./asteroid-belt";


export interface StarSystem {
  id: number;
  by?: string;
  name: string;
  caption: string;
  description: string;
  preset: boolean;
  star: Star;
  planets: Array<Planet | RingedPlanet>;
  asteroidBelts: AsteroidBelt[];
}
