import { sRGBEncoding } from "three/src/constants";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Texture } from "three/src/textures/Texture";

/**
 * * Custom loader emits event after each asset is loaded.
 * * Alternatively, provide onProgress() callback.
 * * Same goes for loading complete.
 */

let assetTotal = 0;
let assetCount: number = 0;
const loader = new TextureLoader();
const textures: { [key: string]: Texture } = {};

interface LoadArgs {
  imageURLs: string[];
  onProgress?: Function;
  onComplete?: Function;
}

export async function loadAssets({
  imageURLs,
  onProgress = () => {},
  onComplete = () => {},
}: LoadArgs) {
  assetTotal = imageURLs.length;
  for (let i = 0; i < assetTotal; i++) {
    await getTexture(imageURLs[i]);
    assetCount++;
    dispatch(onProgress);
  }
  loadingComplete(onComplete);
}

export async function getTexture(src: string): Promise<Texture> {
  if (textures[src]) return textures[src];
  const texture = await loader.loadAsync(src);
  texture.encoding = sRGBEncoding;
  textures[src] = texture;
  return texture;
}

export function getProgress(): number {
  if (assetTotal === 0) return 0;
  return (assetCount / assetTotal) * 100;
}

function loadingComplete(onComplete: Function) {
  const event = new CustomEvent("loaded");
  window.dispatchEvent(event);
  onComplete();
}

function dispatch(onProgress: Function) {
  const percentage = getProgress();
  const event = new CustomEvent("loading", {
    detail: { percentage },
  });
  window.dispatchEvent(event);
  onProgress(percentage);
}
