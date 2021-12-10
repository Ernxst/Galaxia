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

let animation: gsap.core.Timeline | null = null;
let animParams: AnimParams | null = null;
const animQueue: Array<gsap.core.Timeline | null> = [];

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
                              }: AnimParams, timeline: boolean = false): gsap.core.Timeline | undefined {
  if (!shouldAnimate(object.position, camera.position)) return;
  killAnimation();
  animParams = {
    camera, controls, object, offset, duration,
    delay, onStart, onInterrupt, onUpdate, onComplete,
  };
  animation = getAnim(animParams, timeline);
  animQueue.push(animation);
  return animation.play();
}

function getAnim({
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
                           }: AnimParams, toOrigin: boolean): gsap.core.Timeline {
  const startOrientation = camera.quaternion.clone();
  const quaternion: Quaternion = object.quaternion ? object.quaternion : new Quaternion();
  const targetOrientation = quaternion.clone().normalize();

  let timeline = gsap.timeline({
    paused: true,
    delay: delay,
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

  const controlsTimeline = getControlsTimeline(controls, object.position, duration);
  const target = object.position.clone().add(offset);
  const cameraTimeline = getCamTimeline(camera, target, duration, toOrigin);
  timeline = timeline.add(controlsTimeline, 0)
    .add(cameraTimeline, 0);
  return timeline;
}

function getControlsTimeline(controls: OrbitControls, target: Vector3,
                             duration: number): gsap.core.Timeline {
  const timeline = gsap.timeline();
  timeline.to(controls.target, {
    ease: EASE_TYPE,
    duration: duration,
    x: target.x,
    y: target.y,
    z: target.z,
  });
  return timeline;
}

function getCamTimeline(camera: PerspectiveCamera, target: Vector3,
                        duration: number, toOrigin: boolean): gsap.core.Timeline {
  const timeline = gsap.timeline({
    defaults: { ease: EASE_TYPE, duration: toOrigin ? duration * 0.5 : duration },
  });

  if (toOrigin)
    timeline.to(camera.position, {
      x: 0,
      y: 0,
      z: 0,
    });

  timeline.to(camera.position, {
    x: target.x,
    y: target.y,
    z: target.z,
  });

  return timeline;
}
