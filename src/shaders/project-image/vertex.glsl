
varying vec2 vUv;
uniform sampler2D uCanvasTexture;
uniform float uScrollY;
uniform float uTime;

float MATH_PI = 3.141529;

void main () {
vec3 newPosition = position;
float speed = clamp(uScrollY, -MATH_PI, MATH_PI); 
newPosition.y += sin(uv.x  * (MATH_PI ) ) * (uScrollY  * 0.01);
// newPosition.z += sin(uv.y ) * (uScrollY  * 0.1);
// newPosition.z += sin(uv.y * MATH_PI * (uScrollY * 0.001));
float elevationIntensity = texture2D(uCanvasTexture, uv).r ;

// Read elevation from canvas texture


newPosition.z += elevationIntensity;

   vec4 modelposition = modelMatrix * vec4(newPosition, 1.0);
   vec4 viewPosition = viewMatrix * modelposition;
   vec4 projectionPosition = projectionMatrix * viewPosition;

   gl_Position = projectionPosition;
    vUv = uv;
}