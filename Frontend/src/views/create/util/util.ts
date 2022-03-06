import {
  EARTH_DAY_LENGTH,
  EARTH_MASS,
  EARTH_MEAN_VELOCITY,
  EARTH_RADIUS,
  MOON_DAY_LENGTH,
  MOON_MASS,
  MOON_MEAN_VELOCITY,
  MOON_RADIUS,
  SOLAR_LUMINOSITY,
  SOLAR_MASS,
  SOLAR_RADIUS,
  SUN_DAY_LENGTH,
  SUN_MEAN_VELOCITY
} from "@/assets/util/celestial.constants";
import {
  AsteroidBeltData,
  CelestialBodyData,
  CelestialType,
  MoonData,
  PlanetData,
  SimulationData,
  StarData
} from "@/views/create/util/types";


export const defaultSimulation: SimulationData = {
  name: "",
  description: "",
};

export const defaultStar: StarData = {
  name: "My Star",
  caption: "",
  shortDescription: "",
  description: "",
  radius: 1,
  axialTilt: 0,
  mass: 1,
  meanVelocity: 1,
  luminosity: 1,
  dayLength: 1,
  texture: null,
  atmosphereTexture: null,
};

export const defaultPlanet: PlanetData = {
  name: "My Planet",
  caption: "",
  shortDescription: "",
  description: "",
  radius: 1,
  axialTilt: 7.25,
  mass: 1,
  meanVelocity: 1,
  dayLength: 1,
  eccentricity: 0,
  inclination: 0,
  orbitalPeriod: 0,
  semiMajor: 1.2,
  semiMinor: 1,
  texture: null,
  atmosphereTexture: null,
  specularMap: null,
  bumpMap: null,
};

export const defaultMoon: MoonData = {
  name: "My Moon",
  caption: "",
  shortDescription: "",
  description: "",
  radius: 1,
  axialTilt: 7.25,
  mass: 1,
  meanVelocity: 1,
  dayLength: 1,
  eccentricity: 0,
  inclination: 0,
  orbitalPeriod: 0,
  semiMajor: 1.2,
  semiMinor: 1,
  texture: 11,
  atmosphereTexture: null,
  specularMap: null,
  bumpMap: null,
  parentId: null,
};

export const defaultAsteroidBelt: AsteroidBeltData = {
  name: "My Asteroid Belt",
  caption: "",
  shortDescription: "",
  description: "",
  mass: 1,
  meanVelocity: 0,
  depth: 1,
  axialTilt: 0,
  inclination: 0,
  dayLength: 1_000_000,
  numOfAsteroids: 1000,
  innerEccentricity: 0.33,
  innerSemiMajor: 1,
  outerEccentricity: 0.33,
  outerSemiMajor: 5,
};

export function scaleParams<T extends CelestialBodyData>(data: T, type: CelestialType) {
  switch (type) {
    case "star":
      // @ts-ignore
      data["radius"] *= SOLAR_RADIUS;
      data["meanVelocity"] *= SUN_MEAN_VELOCITY;
      data["mass"] *= SOLAR_MASS;
      // @ts-ignore
      data["luminosity"] *= SOLAR_LUMINOSITY;
      data["dayLength"] *= SUN_DAY_LENGTH;
      break;
    case "planet":
      // @ts-ignore
      data["radius"] *= EARTH_RADIUS;
      data["meanVelocity"] *= EARTH_MEAN_VELOCITY;
      data["mass"] *= EARTH_MASS;
      data["dayLength"] *= EARTH_DAY_LENGTH;
      break;
    case "moon":
      // @ts-ignore
      data["radius"] *= MOON_RADIUS;
      data["meanVelocity"] *= MOON_MEAN_VELOCITY;
      data["mass"] *= MOON_MASS;
      data["dayLength"] *= MOON_DAY_LENGTH;
      break;
    default:
      break;
  }
  return data;
}

export function scaleDown<T extends CelestialBodyData>(data: T, type: CelestialType) {
  switch (type) {
    case "star":
      // @ts-ignore
      data["radius"] /= SOLAR_RADIUS;
      data["meanVelocity"] /= SUN_MEAN_VELOCITY;
      data["mass"] /= SOLAR_MASS;
      // @ts-ignore
      data["luminosity"] /= SOLAR_LUMINOSITY;
      data["dayLength"] /= SUN_DAY_LENGTH;
      break;
    case "planet":
      // @ts-ignore
      data["radius"] /= EARTH_RADIUS;
      data["meanVelocity"] /= EARTH_MEAN_VELOCITY;
      data["mass"] /= EARTH_MASS;
      data["dayLength"] /= EARTH_DAY_LENGTH;
      break;
    case "moon":
      // @ts-ignore
      data["radius"] /= MOON_RADIUS;
      data["meanVelocity"] /= MOON_MEAN_VELOCITY;
      data["mass"] /= MOON_MASS;
      data["dayLength"] /= MOON_DAY_LENGTH;
      break;
    default:
      break;
  }
  return data;
}
