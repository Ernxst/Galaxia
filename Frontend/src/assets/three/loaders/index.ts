import { StarSystem } from "@/@types/celestial/containers/star-system";
import { sRGBEncoding } from "three/src/constants";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Texture } from "three/src/textures/Texture";


const loader = new TextureLoader();
loader.setRequestHeader({ "x-goog-project-id": "galaxia-js" });
const textures: { [key: string]: Texture } = {};

export async function getTexture(src: string): Promise<Texture> {
  if (textures[src]) return textures[src];
  const texture = await loader.loadAsync(src);
  texture.encoding = sRGBEncoding;
  textures[src] = texture;
  return texture;
}

export function dispatchLoadedEvent(name: string) {
  const event = new CustomEvent("assetLoaded", {
    detail: {
      name
    }
  });
  window.dispatchEvent(event);
}

export function getAssetsInSystem(starSystem: StarSystem): number {
  let count = 1;
  for (const planet of starSystem.planets) {
    count += 1;
    if (planet.moons) count += planet.moons.length;
  }
  return count + starSystem.asteroidBelts.length;
}
