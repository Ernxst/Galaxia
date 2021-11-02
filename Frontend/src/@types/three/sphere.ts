import { BaseObject } from "./base-object";

export interface Sphere extends BaseObject {
  radius: number;
  slices?: number;
  texture: string;
  bumpMap?: string;
  specularMap?: string;
  colour?: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  materialProps?: Object;
}
