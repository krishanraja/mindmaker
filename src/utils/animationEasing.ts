/**
 * Animation easing utilities for smooth, continuous transitions
 * Replaces hard thresholds with gradual interpolation
 */

/**
 * Maps progress (0→1) to a custom range with easing
 * @param progress - Overall animation progress (0→1)
 * @param start - When this element starts animating (0→1)
 * @param end - When this element finishes animating (0→1)
 * @returns Clamped progress for this element (0→1)
 */
export const mapRange = (progress: number, start: number, end: number): number => {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
};

/**
 * Ease in-out cubic for smooth acceleration/deceleration
 */
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Ease out cubic for smooth deceleration
 */
export const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

/**
 * Ease in cubic for smooth acceleration
 */
export const easeInCubic = (t: number): number => {
  return t * t * t;
};

/**
 * Interpolate between two values with optional easing
 */
export const lerp = (
  start: number, 
  end: number, 
  progress: number, 
  easingFn?: (t: number) => number
): number => {
  const t = easingFn ? easingFn(progress) : progress;
  return start + (end - start) * t;
};

/**
 * Smooth step function - replaces hard thresholds
 * Creates smooth transitions instead of if/else jumps
 */
export const smoothStep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};
