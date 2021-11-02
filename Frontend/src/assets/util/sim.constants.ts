import { EARTH_RADIUS } from "./celestial.constants";

export const MIN_SPEED = 1;
export const MAX_SPEED = 50;
export const BASE_SPEED = (MIN_SPEED + MAX_SPEED) / 2;
export const SPEED_SCALE = 1e3; // Speed is measured in km/s so multiply by 1000

// 0.01 Earth Days between each frame
export const TIME_STEP = 0.01;

export const RADIUS_SCALE = 1 / EARTH_RADIUS;
export const DISTANCE_SCALE = 23.49; // 1 AU = 23.49 World Units

export const NUM_OF_DIM_STARS = 20_000;
export const NUM_OF_MEDIUM_STARS = 20_000;
export const NUM_OF_BRIGHT_STARS = 20_000;

export const STARFIELD_DIAMETER = 2_000;
export const STARFIELD_RADIUS = STARFIELD_DIAMETER / 2;

export const MAX_TRAIL_POINTS = 7500;
