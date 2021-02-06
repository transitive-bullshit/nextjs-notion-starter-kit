export default `
precision highp float;
precision mediump sampler2D;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float value;

void main () {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`
