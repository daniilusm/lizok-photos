export const mediaVertexShader = `
#define PI 3.1415926535897932384626433832795
precision highp float;

varying vec2 vUv;

void main() {
 vUv = uv;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const mediaFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uParallax;
uniform float uUvScale;
uniform float uShaderMultiplier;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uHover;
uniform float uMaskRadius;
uniform float uCursorDistort;
uniform float uBorderRadius;

vec2 coverUv(vec2 uv, vec2 resolution, vec2 imageResolution) {
 vec2 ratio = vec2(
 min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
 min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
 );

 return vec2(
 uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
 uv.y * ratio.y + (1.0 - ratio.y) * 0.5
 );
}

vec2 applyCursorDistortion(vec2 uv, vec2 mouse, vec2 velocity, float hover) {
 float motion = clamp(length(velocity) * 18.0, 0.0, 1.0) * hover;
 vec2 fromMouse = uv - mouse;

 uv.x += velocity.x * uCursorDistort * motion * 10.0 * fromMouse.y;
 uv.y += velocity.y * uCursorDistort * motion * 10.0 * fromMouse.x;

 uv.x += sin(uv.y * 20.0) * velocity.x * uCursorDistort * motion * 3.0;
 uv.y += cos(uv.x * 20.0) * velocity.y * uCursorDistort * motion * 3.0;

 return uv;
}

float roundedBoxMask(vec2 uv, vec2 resolution, float radius) {
 vec2 p = (uv - 0.5) * resolution;
 vec2 halfSize = resolution * 0.5;
 vec2 q = abs(p) - halfSize + radius;
 float dist = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
 return 1.0 - smoothstep(0.0, 1.5, dist);
}

void main() {
 vec2 uv = coverUv(vUv, uResolution, uImageResolution);

 uv.x += uParallax * uShaderMultiplier;

 uv -= 0.5;
 uv *= uUvScale;
 uv += 0.5;

 uv = applyCursorDistortion(uv, uMouse, uMouseVelocity, uHover);

 vec3 col = texture2D(uTexture, uv).rgb;
 float luma = dot(col, vec3(0.299, 0.587, 0.114));
 vec3 grayscale = vec3(luma);

 float maskDist = distance(vUv, uMouse);
 float colorMask = 1.0 - smoothstep(uMaskRadius * 0.2, uMaskRadius, maskDist);
 colorMask *= uHover;

 vec3 finalColor = mix(grayscale, col, colorMask);
 float cornerMask = roundedBoxMask(vUv, uResolution, uBorderRadius);

 gl_FragColor = vec4(finalColor, cornerMask);
}
`;
