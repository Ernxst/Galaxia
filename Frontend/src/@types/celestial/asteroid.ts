import { BaseObject } from "@/@types/three/base-object";
import { Vector3 } from "three/src/math/Vector3";


export interface Asteroid extends BaseObject {
  name: string;
  mass: number; // in kg
  meanVelocity: number; // in km/s
  dayLength: number; // in seconds
  axialTilt: number; // in degrees
  caption: string;
  shortDescription: string;
  description: string;
  size: number;
  detail: number;
  scale: Vector3;
}
