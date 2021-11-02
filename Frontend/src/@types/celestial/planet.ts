import { Sphere } from "../three/sphere";
import { OrbittingBody } from "./base/orbitting-body";
import { Moon } from "./moon";

export interface Planet extends OrbittingBody, Sphere {
  moons?: Moon[];
}
