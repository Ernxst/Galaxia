import { SphericalBody } from "@/@types/celestial/base/spherical-body";
import { OrbittingBody } from "./base/orbitting-body";
import { Moon } from "./moon";


export interface Planet extends OrbittingBody, SphericalBody {
  moons?: Moon[];
}
