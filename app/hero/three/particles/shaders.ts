export const particleVertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uPointSize;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uDriftStrength;

  attribute vec3 aTargetPosition;
  attribute float aRandom;
  attribute float aBrightness;
  attribute float aTargetBrightness;

  varying float vAlpha;
  varying float vBrightness;
  varying float vColorVariation;
  varying float vDepthShade;

  float easeInOutCubic(float value) {
    return value < 0.5
      ? 4.0 * value * value * value
      : 1.0 - pow(-2.0 * value + 2.0, 3.0) * 0.5;
  }

  void main() {
    float progress = easeInOutCubic(uProgress);
    vec3 transformed = mix(position, aTargetPosition, progress);

    // This travel arc is also evaluated per vertex on the GPU. The CPU only changes uProgress.
    float arc = sin(progress * 3.14159265);
    vec3 drift = vec3(
      sin(aRandom * 41.0 + uTime * 0.45),
      cos(aRandom * 29.0 + uTime * 0.35),
      sin(aRandom * 17.0 + uTime * 0.25)
    );
    transformed += drift * arc * (0.18 + aRandom * 0.42) * uDriftStrength;

    vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uPointSize * uPixelRatio * (7.0 / max(1.0, -viewPosition.z));
    vAlpha = 0.88 + aRandom * 0.12;
    vBrightness = mix(aBrightness, aTargetBrightness, progress);
    vColorVariation = aRandom;
    vec4 viewCenter = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float relativeViewDepth = viewPosition.z - viewCenter.z;
    float radialDistance = max(length(transformed), 0.0001);
    float normalizedViewDepth = relativeViewDepth / radialDistance;
    vDepthShade = mix(0.70, 1.22, smoothstep(-1.0, 1.0, normalizedViewDepth));
  }
`

export const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vBrightness;
  varying float vColorVariation;
  varying float vDepthShade;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceToCenter = length(point);
    float strength = 1.0 - smoothstep(0.18, 0.5, distanceToCenter);
    if (strength <= 0.06) discard;

    vec3 shadowColor = uColor * 0.65;
    vec3 highlightColor = mix(uColor, vec3(1.0), 0.4);
    vec3 particleColor = mix(shadowColor, highlightColor, vColorVariation);
    float coverage = strength * vAlpha;
    gl_FragColor = vec4(particleColor * vBrightness * vDepthShade * coverage, coverage);
  }
`
