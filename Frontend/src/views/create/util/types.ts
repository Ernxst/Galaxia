import { AsteroidBelt } from "@/@types/celestial/containers/asteroid-belt";
import { Moon } from "@/@types/celestial/moon";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";


export interface SimulationData {
  name: string;
  description: string;
}

export interface StarData extends Omit<Star, "id" | "createdAt" | "updatedAt" | "texture" | "atmosphereTexture"> {
  textureId: number | null;
  atmosphereTextureId: number | null;
}

export interface PlanetData extends Omit<Planet, "id" | "createdAt" | "updatedAt" | "texture" | "atmosphereTexture" | "specularMap" | "bumpMap"> {
  textureId: number | null;
  atmosphereTextureId: number | null;
  specularMapId: number | null;
  bumpMapId: number | null;
}

export interface RingedPlanetData extends RingedPlanet, PlanetData {

}

export interface MoonData extends Omit<Moon, "id" | "createdAt" | "updatedAt" | "texture" | "atmosphereTexture" | "specularMap" | "bumpMap"> {
  textureId: number | null;
  atmosphereTextureId: number | null;
  specularMapId: number | null;
  bumpMapId: number | null;
  parentId: number | null;
}

export interface AsteroidBeltData extends Omit<AsteroidBelt, "id" | "createdAt" | "updatedAt"> {
  axialTilt: number;
}
