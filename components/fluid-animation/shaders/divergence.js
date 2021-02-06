export default `
precision highp float;
precision mediump sampler2D;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;

vec2 sampleVelocity (in vec2 uv) {
  vec2 multiplier = vec2(1.0, 1.0);
  if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; };
  if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; };
  if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; };
  if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; };
  return multiplier * texture2D(uVelocity, uv).xy;
}

void main () {
  float L = sampleVelocity(vL).x;
  float R = sampleVelocity(vR).x;
  float T = sampleVelocity(vT).y;
  float B = sampleVelocity(vB).y;
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`
