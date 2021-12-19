import { CelestialBody } from "@/@types/celestial/base/celestial-body";
import { Sphere } from "@/@types/three/sphere";


export interface SphericalBody extends CelestialBody, Sphere {
  atmosphereTexture: string;
}
