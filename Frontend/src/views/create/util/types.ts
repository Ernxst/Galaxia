import { AsteroidBelt } from "@/@types/celestial/containers/asteroid-belt";
import { Moon } from "@/@types/celestial/moon";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";


interface Base {
  id?: number;
}

interface Textured {
  textureId: number | null;
  atmosphereTextureId: number | null;
  specularMapId: number | null;
  bumpMapId: number | null;
}

export interface SimulationData {
  name: string;
  description: string;
}

export interface StarData extends Base, Omit<Star, "id" | "createdAt" | "updatedAt" | "texture" | "atmosphereTexture" | "specularMap" | "bumpMap"> {
  textureId: number | null;
  atmosphereTextureId: number | null;
}

export interface PlanetData extends Base, Omit<Planet, "id" | "createdAt" | "updatedAt" | "texture" | "atmosphereTexture" | "specularMap" | "bumpMap">, Textured {
}

export interface RingedPlanetData extends Base, Omit<RingedPlanet, "id" | "createdAt" | "updatedAt" | "texture" | "atmosphereTexture" | "specularMap" | "bumpMap">, Textured {
}

export interface MoonData extends Base, Omit<Moon, "id" | "createdAt" | "updatedAt" | "texture" | "atmosphereTexture" | "specularMap" | "bumpMap">, Textured {
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
