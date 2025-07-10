#include ../includes/simplex4dnoise.glsl
uniform float uTime;

attribute vec4 tangent;

float getWobble(vec3 position){
    return snoise(vec4(position.xyz, uTime)) * 0.2;
}

void main () {
    vec3 bitangent = cross(normal, tangent.xyz);

    float shift = 0.01;

    vec3 positionA = csm_Position +tangent.xyz* shift;
    vec3 positionB = csm_Position + bitangent * shift;


    float wobble = getWobble(csm_Position);
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;
    csm_Position += wobble * normal;

    // csm_Position.y += sin(csm_Position.x * 2.0 + uTime * 2.0) * 0.5;

    // Compute Normals

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    csm_Normal = cross(toA, toB);
}