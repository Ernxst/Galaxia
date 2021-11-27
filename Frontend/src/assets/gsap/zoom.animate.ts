import { gsap } from "gsap";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { ZOOM_DURATION } from "./gsap.constants";

// TODO: Play short sound while zooming
export function animateZoom(finalZoom: number, camera: PerspectiveCamera,
                            duration: number = ZOOM_DURATION) {
  const anim = { zoom: camera.zoom };
  return gsap.to(anim, {
    zoom: finalZoom,
    duration,
    onUpdate() {
      camera.zoom = anim.zoom;
      camera.updateProjectionMatrix();
    },
    onComplete() {
      camera.updateProjectionMatrix();
    },
  });
}
