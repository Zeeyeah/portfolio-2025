import { Center, Environment, Resize, Text3D } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import * as THREE from "three";
import vertexShader from "../shaders/card-texture/vertex.glsl";
import fragmentShader from "../shaders/card-texture/fragment.glsl";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import typefaceFont from 'three/examples/fonts/helvetiker_bold.typeface.json'

function CardTexture({}) {
  const meshRef = useRef();

  // Load texture once
  const texture = useLoader(THREE.TextureLoader, "/id_card.png");
  texture.flipY = false;

  // Compute aspect ratio + plane size once
  const planeWidth = 2.3;
  const textureAspect = texture.source.data.width / texture.source.data.height;
  const planeHeight = planeWidth / textureAspect;

  // Create sphere geometry with tangents
  const geometry = useMemo(() => {
    let geo = new THREE.SphereGeometry(0.5, 32, 32);
    geo = mergeVertices(geo);
    geo.computeTangents();
    return geo;
  }, []);

  // Update time uniform


  // useFrame(() => (meshRef.current.material.uniforms.uTime.value += 0.01))


  return (
    <group>
      <Environment preset="sunset" />
      <ambientLight />

      {/* Sphere mesh with custom shader */}
      {/* <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <CustomShaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          baseMaterial={THREE.MeshPhysicalMaterial}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: uTimeProp },
          }}
        />
      </mesh> */}

      {/* Plane mesh with texture */}
      <mesh position={[0, 0, 0]} >
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          alphaMap={texture}
          transparent
        />
      </mesh>
      {/* <mesh onPointerEnter={() => console.log('yep')} position={[0.37, 1.37, 0]} scale={1} >
        <planeGeometry args={[1.1, 0.3]} />
        <meshPhysicalMaterial roughness={0} metalness={1} color={'#A4DA00'} emissive={'#A4DA00'} emissiveIntensity={1}  />
      </mesh> */}
        <pointLight  />
        <Resize maxHeight={0.45} maxWidth={0.925}>
          <Text3D  position={[-1, 11.2, -0.2]} rotation={[0, Math.PI, Math.PI ]} font={typefaceFont}>
            <meshPhysicalMaterial roughness={1} color={'black'} />
            Get in touch
          </Text3D>
        </Resize>
    </group>
  );
}

export default CardTexture;
