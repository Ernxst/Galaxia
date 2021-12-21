import { StarSystem } from "@/@types/celestial/containers/star-system";
import { randomNumber } from "@/assets/util";
import { sample } from "lodash-es";
import { fillArray } from "../../util/util";
import { asteroidBeltMock } from "./asteroid-belt.mock";
import { planetMock } from "./planet.mock";
import { starMock } from "./star.mock";


const usernames: string[] = ["testuser", "user2", "user3", "user4"];

export const presetSimulation: StarSystem = {
  id: 1,
  name: "My Simulation",
  caption: "A mock simulation",
  description: "Lorem ipsum dolor io ...",
  star: starMock,
  planets: fillArray(planetMock, 6),
  asteroidBelts: fillArray(asteroidBeltMock, randomNumber(0, 1)),
  preset: true,
};

export const simulationByUser = (username: string): StarSystem => {
  return {
    ...presetSimulation,
    by: username,
    preset: false,
  };
};

export const presetSimulationArray = (length: number): StarSystem[] => {
  const simulations: StarSystem[] = [];
  for (let i = 0; i < length; i++)
    simulations[i] = { ...presetSimulation, id: i };
  return simulations;
};

export const userSavedSimulationArrays = (username: string, length: number): StarSystem[] => {
  const simulations: StarSystem[] = [];
  for (let i = 0; i < length; i++)
    simulations[i] = { ...simulationByUser(username), id: i };
  return simulations;
};

export const userCreatedSimulations = (length: number): StarSystem[] => {
  const simulations: StarSystem[] = [];
  for (let i = 0; i < length; i++)
    // @ts-ignore
    simulations[i] = { ...simulationByUser(sample(usernames)), id: i };
  return simulations;
};
