import { TextureMap } from "@/@types/app/texture-maps";


export default interface RingProps {
  tilt: number;
  texture: TextureMap;
  innerRadius: number; // in KM
  outerRadius: number; // in KM
  circular: boolean;
}
