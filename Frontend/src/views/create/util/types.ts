import { AsteroidBelt } from "@/@types/celestial/containers/asteroid-belt";
import { Moon } from "@/@types/celestial/moon";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";


interface Base {
  id?: number;
}

export interface SimulationData {
  name: string;
  description: string;
}

export interface StarData extends Base, Omit<Star, "id"| "createdAt" | "updatedAt" | "bumpMap" | "specularMap"> {
}

export interface PlanetData extends Base, Omit<Planet, "id" | "createdAt" | "updatedAt"> {
}

export interface RingedPlanetData extends Base, Omit<RingedPlanet, "id" | "createdAt" | "updatedAt"> {
}

export interface MoonData extends Base, Omit<Moon, "id" | "createdAt" | "updatedAt"> {
  parentId: number | null;
}

export interface AsteroidBeltData extends Base, Omit<AsteroidBelt, "id" | "createdAt" | "updatedAt"> {
  axialTilt: number;
}

export type CelestialType = "star" | "planet" | "moon" | "asteroid belt";
export type CelestialBodyData = StarData | PlanetData | RingedPlanetData | MoonData | AsteroidBeltData;

export interface Simulation extends SimulationData {
  id?: number;
  star: StarData,
  planets: PlanetData[],
  asteroidBelts: AsteroidBeltData[],
}
