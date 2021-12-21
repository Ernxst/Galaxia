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
  texture: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/sun%2Fsun.webp?alt=media&token=addfe03f-ecd7-4d25-b30f-2b0dceefd61c",
  atmosphereTexture: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/sun%2Fsun-shell.webp?alt=media&token=0bfb38bb-cab3-444b-9c4d-34fa0c7faf4b",
};
