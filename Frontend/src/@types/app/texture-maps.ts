import { TexturedBody } from "@/services/media.service";


export interface TextureMap {
  id: number;
  updatedAt: string;
  createdAt: string;
  name: string;
  filename: string;
  apiUrl: string;
  url: string;
  for: TexturedBody;
  originalUrl: string | null;
  publicUrl: string;
  width: number;
  height: number;
  size: number;
}
