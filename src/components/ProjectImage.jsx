import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import vertexShader from "../shaders/project-image/vertex.glsl";
import fragmentShader from "../shaders/project-image/fragment.glsl";
import { useFrame, useLoader } from "@react-three/fiber";
import Lenis from "lenis";

const ProjectImage = ({imgSrc}) => {
  const planeRef = useRef();
  const canvasRef = useRef(document.createElement("canvas"));
  const radialGlowRef = useRef();
  const pointerPosRef = useRef(null);
  const hovering = useRef(false);

  const texture = useLoader(THREE.TextureLoader, `/projects/${imgSrc}.jpeg`);
  const canvasTexture = useRef(new THREE.CanvasTexture(canvasRef.current)).current;

  // Load radial glow image
  useEffect(() => {
    const glow = new Image();
    glow.src = "/radial_gradient.png";
    glow.onload = () => {
      radialGlowRef.current = glow;
    };
  }, []);

  // Add canvas to DOM
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.id = "2dCanvas";
    canvas.width = 256;
    canvas.height = 256;
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.right = 0;
    canvas.style.opacity = 0
    document.body.appendChild(canvas);

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

const currentVelocity = useRef(0);

const lenis = new Lenis();

const scrollData = {
  y: 0,
  velocity: 0,
};

lenis.on('scroll', ({ scroll, velocity }) => {
    currentVelocity.current +=
    (velocity - currentVelocity.current) * 0.001;
    planeRef.current.material.uniforms.uScrollY.value = velocity
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);



  // Handle hover start
  const handlePointerMove = (event) => {
    hovering.current = true;
    pointerPosRef.current = {
      x: event.uv.x * canvasRef.current.width,
      y: (1 - event.uv.y) * canvasRef.current.height,
    };
  };

  // Handle hover end
  const handlePointerOut = () => {
    hovering.current = false;
    pointerPosRef.current = null;
  };

  // Animate
  useFrame((state) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Fade canvas
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw glow only if hovering and pointer position available
    if (hovering && pointerPosRef.current && radialGlowRef.current && planeRef.current) {
      const { x, y } = pointerPosRef.current;
      const glowSize = planeRef.current.scale.x * 512;
      ctx.globalAlpha = 0.05;
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(
        radialGlowRef.current,
        x - glowSize / 2,
        y - glowSize / 2,
        glowSize,
        glowSize
      );
    }

    planeRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
    canvasTexture.needsUpdate = true;
  });

  return (
    <>
      <mesh
        ref={planeRef}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[3, 4, 32, 32]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTexture: { value: texture },
            uCanvasTexture: { value: canvasTexture },
            uScrollY: {value: 0.0},
            uTime: {value: 0.0}
          }}
        />
      </mesh>
      {/* <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} /> */}
    </>
  );
};

export default ProjectImage;
