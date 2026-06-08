export const getCameraFov = (height: number) =>
  2 * Math.atan(height / 2 / 100) * (180 / Math.PI);
