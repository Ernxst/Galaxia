import {
  AsteroidBeltData,
  CelestialBodyData,
  CelestialType,
  MoonData,
  PlanetData,
  SimulationData,
  StarData
} from "@/views/create/util/types";


function findDuplicates(array: string[]): string[] {
  const counter: { [key: string]: number } = {};
  return array.filter(n => (counter[n] = counter[n] + 1 || 1) === 2);
}

function allUniqueNames(starName: string, planets: PlanetData[], moons: MoonData[],
                        asteroidBelts: AsteroidBeltData[]): string | true {
  const planetNames: string[] = planets.map(({ name }) => name.toLowerCase());
  const moonNames: string[] = moons.map(({ name }) => name.toLowerCase());
  const asteroidBeltNames: string[] = asteroidBelts.map(({ name }) => name.toLowerCase());

  const types = [{ type: "planet", preposition: "a", array: planetNames, otherArrays: [moonNames] },
    { type: "moon", preposition: "a", array: moonNames, otherArrays: [asteroidBeltNames] },
    { type: "asteroid belt", preposition: "an", array: asteroidBeltNames, otherArrays: [planetNames] },
  ];
  for (const { type, preposition, array, otherArrays } of types) {
    // Check if the same name was used for a star and a planet, for instance
    if (array.includes(starName)) {
      return `The name "${starName}" has been used for both the star and ${preposition} ${type} which is not allowed. Please ensure all celestial bodies have a unique name.`;
    }

    // Check if the same name was used for multiple planets, for instance
    if ((new Set(array)).size !== array.length) {
      const duplicates = findDuplicates(array);
      return `The name(s) "${duplicates.join(", ")}" were used for multiple ${type}s which is not allowed. Please ensure all ${type}s have a unique name.`;
    }

    // Check if the same name was used for a planet and a moon, for instance
    for (const otherArray of otherArrays) {
      if (array.some(r => otherArray.includes(r))) {
        return `You have used the same name for two (or more) celestial bodies of differing types (e.g., giving the same name to a planet and a moon). Please ensure all celestial bodies have a unique name.`;
      }
    }
  }
  return true;
}

function validateSimulation(textData: SimulationData, star: StarData,
                            planets: PlanetData[], moons: MoonData[],
                            asteroidBelts: AsteroidBeltData[]): string | true {
  if (textData.name === "") return "Please enter a name for your simulation.";

  const namesResponse = allUniqueNames(star.name.toLowerCase(), planets, moons, asteroidBelts);
  if (namesResponse !== true) return namesResponse;

  // TODO: Ensure celestial bodies do not overlap (requires params to be scaled up)
  return true;
}

function validateCelestialBody(data: CelestialBodyData, type: CelestialType): string | true {
  if (data.name === "") return `Please give the ${type} a name.`;
  // @ts-ignore
  if (type === "moon" && data.parentId === null) return `Please select a parent planet for the moon "${data.name}"`;
  // @ts-ignore
  if (data.textureId === null) {
    if (type === "star") return "Please select a texture for the star";
    return `Please select a texture for the ${type} "${data.name}"`;
  }
  return true;
}


export { validateSimulation, validateCelestialBody };
