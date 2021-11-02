import { Sphere } from "../three/sphere";
import { OrbittingBody } from "./base/orbitting-body";

export interface Moon extends OrbittingBody, Sphere {}
