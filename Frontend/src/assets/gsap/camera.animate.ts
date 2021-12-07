import { EASE_TYPE } from "@/assets/gsap/gsap.constants";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";


interface AnimParams {
  camera: PerspectiveCamera;
  controls: OrbitControls;
  object: { position: Vector3, quaternion: Quaternion };
  offset?: Vector3;
  duration?: number;
  delay?: number;
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
                                delay = 0,
                                onStart = () => {
                                },
                                onInterrupt = () => {
                                },
                                onUpdate = () => {
                                },
                                onComplete = () => {
                                },
                              }: AnimParams): Tween | undefined {
  if (!shouldAnimate(object.position, camera.position)) return;
  killAnimation();
  animParams = {
    camera,
    controls,
    object,
    offset,
    duration,
    delay,
    onStart,
    onInterrupt,
    onUpdate,
    onComplete,
  };
  animation = performAnimation(animParams);
  animQueue.push(animation);
  return animation;
}

function performAnimation({
                            camera,
                            controls,
                            object,
                            offset = new Vector3(),
                            duration = 0,
                            delay = 0,
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
    ...controls.target,
    camX: camPos.x,
    camY: camPos.y,
    camZ: camPos.z,
  };
  return gsap.to(data, {
    duration,
    delay,
    ease: EASE_TYPE,
    x: object.position.x,
    y: object.position.y,
    z: object.position.z,
    camX: object.position.x + offset.x,
    camY: object.position.y + offset.y,
    camZ: object.position.z + offset.z,

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
      controls.target.set(data.x, data.y, data.z);
      camera.position.set(data.camX, data.camY, data.camZ);
      camera.quaternion.copy(startOrientation).slerp(targetOrientation, this.progress());
      camera.updateProjectionMatrix();
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
