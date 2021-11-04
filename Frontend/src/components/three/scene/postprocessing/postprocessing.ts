import { BLOOM_LAYER } from "@/assets/three/three.constants";
import { ShaderMaterial } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Camera } from "three/src/cameras/Camera";
import { Layers } from "three/src/core/Layers";
import { Material } from "three/src/materials/Material";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Vector2 } from "three/src/math/Vector2";
import { Mesh } from "three/src/objects/Mesh";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { Scene } from "three/src/scenes/Scene";
import bloomFragment from "./shaders/bloomFragment.glsl";
import bloomVertex from "./shaders/bloomVertex.glsl";

const darkMaterial = new MeshBasicMaterial({ color: "black" });
const bloomLayer = new Layers();
bloomLayer.set(BLOOM_LAYER);
const materials: { [key: string]: Material } = {};

let bloomComposer: EffectComposer, finalComposer: EffectComposer;
let smaaPass: SMAAPass;

export function setupPostprocessing(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera
) {
  const renderScene = new RenderPass(scene, camera);
  const width = renderer.domElement.clientWidth;
  const height = renderer.domElement.clientHeight;
  const bloomPass = new UnrealBloomPass(
    new Vector2(width, height),
    1.5,
    0.5,
    0
  );

  bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const finalPass = new ShaderPass(
    new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: bloomVertex,
      fragmentShader: bloomFragment,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;

  const pixelRatio = renderer.getPixelRatio();
  smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);

  finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);
  finalComposer.addPass(smaaPass);

  return () => {
    scene.traverse(darkenNonBloomed);
    bloomComposer.render();
    scene.traverse(restoreMaterial);
    finalComposer.render();
  };
}

export function setComposerSize(width: number, height: number) {
  bloomComposer.setSize(width, height);
  finalComposer.setSize(width, height);
  smaaPass.setSize(width, height);
}

function darkenNonBloomed(obj: Mesh) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj: Mesh) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}
