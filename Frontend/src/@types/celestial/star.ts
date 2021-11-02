import { Sphere } from "../three/sphere";
import { CelestialBody } from "./base/celestial-body";

export interface Star extends CelestialBody, Sphere {}
