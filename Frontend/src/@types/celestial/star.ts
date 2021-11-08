import { SphericalBody } from "@/@types/celestial/base/spherical-body";


export interface Star extends SphericalBody {
  luminosity: number;
}
