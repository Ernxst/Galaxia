import { validateSimulation } from "@/views/create/util/simulation-validator";
import { AsteroidBeltData, MoonData, PlanetData, SimulationData, StarData } from "@/views/create/util/types";


const baseSim: SimulationData = {
  name: "My Sim",
  description: "Lorem ipsum",
};

const star: StarData = {
  atmosphereTextureId: null,
  axialTilt: 0,
  caption: "",
  dayLength: 0,
  description: "",
  luminosity: 0,
  mass: 0,
  meanVelocity: 0,
  shortDescription: "",
  textureId: 1,
  name: "Sun",
  radius: 1
};

const planet = (name: string): PlanetData => {
  return {
    atmosphereTextureId: null,
    axialTilt: 0,
    bumpMapId: null,
    caption: "",
    dayLength: 0,
    description: "",
    eccentricity: 0,
    inclination: 0,
    mass: 0,
    meanVelocity: 0,
    orbitalPeriod: 0,
    radius: 0,
    semiMajor: 0,
    semiMinor: 0,
    shortDescription: "",
    specularMapId: null,
    textureId: null,
    name: name
  };
};

const planets: PlanetData[] = [planet("my planet"), planet("planet 2")];

const moon = (name: string): MoonData => {
  return {
    atmosphereTextureId: null,
    axialTilt: 0,
    bumpMapId: null,
    caption: "",
    dayLength: 0,
    description: "",
    eccentricity: 0,
    inclination: 0,
    mass: 0,
    meanVelocity: 0,
    name: name,
    orbitalPeriod: 0,
    radius: 0,
    semiMajor: 0,
    semiMinor: 0,
    shortDescription: "",
    specularMapId: null,
    textureId: null,
    parentId: null,
  };
};

const moons: MoonData[] = [moon("my moon"), moon("moon 2")];

const asteroidBelt = (name: string): AsteroidBeltData => {
  return {
    caption: "",
    dayLength: 0,
    description: "",
    innerEccentricity: 0,
    innerSemiMajor: 0,
    mass: 0,
    meanVelocity: 0,
    name: name,
    numOfAsteroids: 0,
    outerEccentricity: 0,
    outerSemiMajor: 0,
    shortDescription: "",
    axialTilt: 0,
  };
};

const asteroidBelts: AsteroidBeltData[] = [asteroidBelt("aaa"), asteroidBelt("bbb")];

describe("simulation-validator.ts", () => {
  it("returns true for valid simulation", () => {
    const response = validateSimulation(baseSim, star, planets, moons, asteroidBelts);
    expect(response).toBe(true);
  });

  it("returns error if the simulation does not have a name", () => {
    const base = { name: "", description: "" };
    const response = validateSimulation(base, star, planets, moons, asteroidBelts);
    expect(response).toEqual("Please enter a name for your simulation.");
  });

  it("returns error if the same name is used for a star and a planet", () => {
    const newPlanets = [planet(star.name)];
    const response = validateSimulation(baseSim, star, newPlanets, moons, asteroidBelts);
    expect(response).toEqual(`The name "${star.name.toLowerCase()}" has been used for both the star and a planet which is not allowed. Please ensure all celestial bodies have a unique name.`);
  });

  it("returns an error if the same name was used for multiple planets", () => {
    const newPlanets = [planet("earth"), planet("earth")];
    const response = validateSimulation(baseSim, star, newPlanets, moons, asteroidBelts);
    expect(response).toEqual(`The name(s) "earth" were used for multiple planets which is not allowed. Please ensure all planets have a unique name.`);
  });

  it("returns an error if the same name was used for a planet and a moon", () => {
    const newPlanets = [planet("earth")];
    const newMoons = [moon("earth")];
    const response = validateSimulation(baseSim, star, newPlanets, newMoons, asteroidBelts);
    expect(response).toEqual(`You have used the same name for two (or more) celestial bodies of differing types (e.g., giving the same name to a planet and a moon). Please ensure all celestial bodies have a unique name.`);
  });

  // TODO: Add tests for checking overlapping
});
