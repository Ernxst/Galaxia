import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";


function rendererNeedsResize(renderer: WebGLRenderer): { width: number, height: number, needsResize: boolean } {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  return {
    width,
    height,
    needsResize: canvas.width !== width || canvas.height !== height
  };
}

export {
  rendererNeedsResize
};
