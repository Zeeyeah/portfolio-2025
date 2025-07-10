uniform sampler2D uTexture;
uniform sampler2D uCanvasTexture;
uniform float uScrollY;

varying vec2 vUv;
void main() {
    // float speed = clamp(abs(uScrollY), 0.0, 0.3); 

   float r = texture2D(uTexture, vUv + uScrollY * 0.0005).r;
   vec2 gb = texture2D(uTexture, vUv).gb;
   vec4 finalColor = vec4(r, gb.x, gb.y, 1.0);
   float elevation = texture2D(uCanvasTexture, vUv).r;


   finalColor.rbg *= elevation + 1.0;
    gl_FragColor = finalColor;
}