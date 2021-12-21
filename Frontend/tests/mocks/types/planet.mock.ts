import { Planet } from "@/@types/celestial/planet";
import { randomNumber } from "@/assets/util";
import { fillArray } from "../../util/util";
import { moonMock } from "./moon.mock";


export const planetMock: Planet = {
  id: 1,
  updatedAt: "",
  createdAt: "",
  name: "Mercury",
  radius: 2439.7,
  caption: "sadjkdfks",
  shortDescription: "adasjkdjnfs",
  description: "aaaa",
  mass: 3.3e23,
  semiMajor: 0.387,
  semiMinor: 0.3787,
  eccentricity: 0.205,
  inclination: 3.38,
  orbitalPeriod: 87.9691,
  meanVelocity: 47,
  axialTilt: 0.034,
  dayLength: 5067000,
  texture: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury.webp?alt=media&token=dbc3c54f-8adf-4d0b-b23f-19b783e3405f",
  bumpMap: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury-bump-map.webp?alt=media&token=071732ca-6f75-4cc3-bf27-dc641c58f725",
  atmosphereTexture: "",
  moons: fillArray(moonMock, randomNumber(0, 4)),
}