import { Vector3 } from "three/src/math/Vector3";
import { CelestialBody } from "./base/celestial-body";


export interface Asteroid extends CelestialBody {
  size: number;
  detail: number;
  scale: Vector3;
}
