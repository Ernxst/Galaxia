import { TextureMap } from "@/@types/app/texture-maps";
import { cameliseArrayOfObjects } from "@/assets/util/app.util";
import { AbstractApiService, GenericApiErrorResponse } from "@/services/abstract-api.service";


type TextureType = "textures" | "atmosphere_textures" | "bump_maps" | "specular_maps"
type TexturedBody = "stars" | "planets" | "moons"
type VuexTextureType = "texture" | "atmosphereTexture" | "bumpMap" | "specularMap"
type TexturesResponse = {
  [key in TextureType]: TextureMap[];
};

class MediaService extends AbstractApiService {
  private static _instance: MediaService;

  public constructor() {
    super("media");
  }

  static instance(): MediaService {
    if (!MediaService._instance)
      MediaService._instance = new MediaService();
    return MediaService._instance;
  }

  private fetchAllByType(textureType: TextureType, celestialBody: TexturedBody): Promise<TextureMap[]> {
    return this.fetchAll(`${textureType}/all/${celestialBody}`, textureType);
  }

  public async fetchAll(endpoint: string, keyName: TextureType): Promise<TextureMap[]> {
    const response = await this.makeRequest<TexturesResponse, GenericApiErrorResponse>({
      endpoint: endpoint,
      method: "GET",
    });
    // @ts-ignore
    if (keyName in response) return cameliseArrayOfObjects<TextureMap>(response[keyName]);
    // @ts-ignore
    return Promise.reject(response.error);
  }
}

export {
  MediaService,
  TextureType,
  TexturedBody,
  VuexTextureType
};
