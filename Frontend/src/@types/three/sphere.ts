import { TextureMap } from "@/@types/app/texture-maps";
import { BaseObject } from "./base-object";


export interface Sphere extends BaseObject {
  radius: number;
  slices?: number;
  texture: TextureMap;
  bumpMap?: TextureMap;
  specularMap?: TextureMap;
  colour?: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  materialProps?: Object;
}
