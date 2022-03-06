import { Star } from "@/@types/celestial/star";
import { SOLAR_MASS } from "@/assets/util/celestial.constants";


export const starMock: Star = {
  id: 1,
  createdAt: "",
  updatedAt: "",
  name: "Sun",
  radius: 696_340,
  caption: "The Sun",
  shortDescription: "Every planet in the Solar System orbits this celestial object.",
  description: "Lorem ipsum dolor",
  mass: SOLAR_MASS,
  meanVelocity: 220,
  axialTilt: 7.25,
  dayLength: 0,
  luminosity: 3e27,
  texture: {
    id: 1,
    name: "aaa",
    url: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury.webp?alt=media&token=dbc3c54f-8adf-4d0b-b23f-19b783e3405f"
  },
  bumpMap: {
    id: 1,
    name: "aa",
    url:
      "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury-bump-map.webp?alt=media&token=071732ca-6f75-4cc3-bf27-dc641c58f725"
  },
  atmosphereTexture: {
    url: ""
  },
};
