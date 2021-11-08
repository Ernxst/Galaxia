import { AU, EARTH_RADIUS } from "./celestial.constants";


export const SCENE_SCALE = 0.1;
export const BUMP_SCALE = 0.05;

export const MIN_SPEED = 1;
export const MAX_SPEED = 100;
export const BASE_SPEED = 1;
export const SPEED_SCALE = 1e3; // Speed is measured in km/s so multiply by 1000

// 0.01 Earth Days between each frame
export const TIME_STEP = 0.01;

export const RADIUS_SCALE = 1 / EARTH_RADIUS;
export const DISTANCE_SCALE = 23.49; // 1 AU = 23.49 metres
export const LIGHTING_SCALE = DISTANCE_SCALE / (AU * 3e16);
export const SHADOW_BIAS = -0.0001;
export const NORMAL_BIAS = 0.3;

export const NUM_OF_DIM_STARS = 400;
export const NUM_OF_MEDIUM_STARS = 300;
export const NUM_OF_BRIGHT_STARS = 250;

export const STARFIELD_DIAMETER = 2_000;
export const STARFIELD_RADIUS = STARFIELD_DIAMETER / 2;

export const MAX_TRAIL_POINTS = 7500;

export const ATMOSPHERE_OPACITY = 0.8;
export const ATMOSPHERE_SCALE = 1.03;
export const ATMOSPHERE_ROTATION_SPEED_SCALE = 1.25;
