import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import '../styles/hero.css'
import React from 'react'
import HeroScene from '../components/HeroScene'
import CardTexture from '../components/CardTexture'
import { OrbitControls } from '@react-three/drei'


const HeroSection = () => {
  return (
    <div className='hero-section'>
        {/* <div className='emp'></div> */}
        <div className="hero-title">
            <h1>Creative Frontend Dev.</h1>
            <p>Front end developer based in india, I love making amazing, interactive experiences, Front end developer based in india, I love making amazing, interactive experiences.Front end developer based in india, I love making amazing, interactive experiences.</p>
        </div>
        <div className="hero-canvas">
            <Canvas  gl={{ alpha: true }} style={{ background: 'transparent' }} onCreated={({ gl }) => {  gl.setClearColor(0x000000, 0);}} className='canvas3d' camera={{ position: [0, 0, 13], fov: 25, }}>
                <OrbitControls enablePan={true} enableRotate={false} enableZoom={false} />
                <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                    <HeroScene />
                </Physics>
            </Canvas>
        </div>
    </div>
  )
}

export default HeroSection