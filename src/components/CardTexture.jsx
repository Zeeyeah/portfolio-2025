import { Environment } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import CustomShaderMaterial from 'three-custom-shader-material'
import vertexShader from '../shaders/card-texture/vertex.glsl'
import fragmentShader from '../shaders/card-texture/fragment.glsl'
import * as THREE from 'three'
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js"

function CardTexture(props) {
  const meshRef = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  let geomtry = new THREE.PlaneGeometry(4,2, 64, 64)
  geomtry = mergeVertices(geomtry)
  geomtry.computeTangents()

  useFrame(() => (meshRef.current.material.uniforms.uTime.value += 0.01))
  return (
    <group {...props}>
        {/* <Environment preset="sunset" /> */}
      <mesh
        ref={meshRef}
        // scale={[2, 0.5, .5]}
        // rotation={[Math.PI / 2 , 0, 0]}
        geometry={geomtry}>
      
        <CustomShaderMaterial
            vertexShader= {vertexShader}
            fragmentShader= {fragmentShader}
            baseMaterial= {THREE.MeshPhysicalMaterial}
            side={THREE.DoubleSide}
            uniforms={{
                uTime: {value: 0}
            }}
        />
      </mesh>
    </group>
  )
}

export default CardTexture