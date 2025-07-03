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
        <div className="hero-title">

        </div>
        <div className="hero-canvas">
            <Canvas className='canvas3d' camera={{ position: [0, 0, 13], fov: 25 }}>
                <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} />
                <Physics debug interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                    <HeroScene />
                </Physics>
            </Canvas>
        </div>
    </div>
  )
}

export default HeroSection