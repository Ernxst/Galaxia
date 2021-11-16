import { EASE_TYPE } from "@/assets/gsap/gsap.constants";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";


interface AnimParams {
  camera: PerspectiveCamera;
  controls: OrbitControls;
  object: { position: Vector3 };
  offset?: Vector3;
  duration?: number;
  onStart?: Function;
  onInterrupt?: Function;
  onUpdate?: Function;
  onComplete?: Function;
}

type Tween = ReturnType<typeof gsap.to> | null;
let animation: Tween | null = null;
let animParams: AnimParams | null = null;
const animQueue: Tween[] = [];

export function isAnimating(): boolean {
  return animQueue.length !== 0;
}

function shouldAnimate(newPos: Vector3, oldPos: Vector3): boolean {
  const pos: Vector3 =
    isAnimating() && animParams !== null ? animParams.object.position : oldPos;
  return !newPos.equals(pos);
}

function killAnimation() {
  if (animation !== null) {
    animation.kill();
    animation = null;
  }
}

export function animateCamera({
                                camera,
                                controls,
                                object,
                                offset = new Vector3(),
                                duration = 0,
                                onStart = () => {
                                },
                                onInterrupt = () => {
                                },
                                onUpdate = () => {
                                },
                                onComplete = () => {
                                },
                              }: AnimParams) {
  if (!shouldAnimate(object.position, camera.position)) return;
  killAnimation();
  animParams = {
    camera,
    controls,
    object,
    offset,
    duration,
    onStart,
    onInterrupt,
    onUpdate,
    onComplete,
  };
  animation = performAnimation(animParams);
  animQueue.push(animation);
}

function performAnimation({
                            camera,
                            controls,
                            object,
                            offset = new Vector3(),
                            duration = 0,
                            onStart = () => {
                            },
                            onInterrupt = () => {
                            },
                            onUpdate = () => {
                            },
                            onComplete = () => {
                            },
                          }: AnimParams): Tween {
  const startOrientation = camera.quaternion.clone();
  const quaternion: Quaternion = object.quaternion
    ? object.quaternion
    : new Quaternion();
  const targetOrientation = quaternion.clone().normalize();

  const camPos = camera.position;
  const data = {
    camX: camPos.x,
    camY: camPos.y,
    camZ: camPos.z,
    ...controls.target,
    zoom: camera.zoom,
  };
  return gsap.to(data, {
    duration: duration,
    ease: EASE_TYPE,
    camX: object.position.x + offset.x,
    camY: object.position.y + offset.y,
    camZ: object.position.z + offset.z,
    x: object.position.x,
    y: object.position.y,
    z: object.position.z,
    zoom: 1,

    onStart: function () {
      controls.enabled = false;
      controls.enableDamping = false;
      onStart();
    },
    onInterrupt: function () {
      animQueue.push(null);
      onInterrupt();
    },
    onUpdate: function () {
      controls.target = new Vector3(data.x, data.y, data.z);
      camera.zoom = data.zoom;
      camera.position.set(data.camX, data.camY, data.camZ);
      camera.quaternion
        .copy(startOrientation)
        .slerp(targetOrientation, this.progress());
      camera.updateProjectionMatrix();
      controls.update();
      onUpdate();
    },
    onComplete: function () {
      controls.enabled = true;
      controls.enableDamping = true;
      animQueue.length = 0;
      onComplete();
    },
  });
}
