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
            <ul>
          <li>
            <a target='_blank' href="https://drive.google.com/file/d/1bqW0mAFiYF_5YBeXIKTrvs8U72e97u_6/view?usp=sharing">Resume</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              viewBox="0 0 65 65"
            >
              <path
                d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z"
                fill="#000"
                stroke="#000"
              ></path>
            </svg>
          </li>
          <li>
            <a target='_blank' href="mailto:zu0827992@gmail.com">Email</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              viewBox="0 0 65 65"
            >
              <path
                d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z"
                fill="#000"
                stroke="#000"
              ></path>
            </svg>
          </li>
          <li>
            <a target='_blank' href="tel:+917993095402">Phone/WhatsApp</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              viewBox="0 0 65 65"
            >
              <path
                d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z"
                fill="#000"
                stroke="#000"
              ></path>
            </svg>
          </li>
          <li>
            <a target='_blank' href="https://www.linkedin.com/in/ziya-uddin-70622a24b/">LinkedIn</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              viewBox="0 0 65 65"
            >
              <path
                d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z"
                fill="#000"
                stroke="#000"
              ></path>
            </svg>
          </li>
          <li>
            <a target='_blank' href="https://github.com/Zeeyeah">GitHub</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              viewBox="0 0 65 65"
            >
              <path
                d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z"
                fill="#000"
                stroke="#000"
              ></path>
            </svg>
          </li>
          <li>
            <a target='_blank' href="https://x.com/zeeyeahaha">Twitter</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              viewBox="0 0 65 65"
            >
              <path
                d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z"
                fill="#000"
                stroke="#000"
              ></path>
            </svg>
          </li>
          <li>
            <a target='_blank' href="https://www.instagram.com/zeeyeahaha">Instagram</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              viewBox="0 0 65 65"
            >
              <path
                d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z"
                fill="#000"
                stroke="#000"
              ></path>
            </svg>
          </li>
        </ul>
            <h1>Creative Frontend Dev.</h1>
            <div className='hero-info'>
            <p>Front-end Developer from India crafting interactive, 3D, and creative web experiences.</p>
            <p>Specializing in React, Three.js, and WebGL.</p>
            <p>Winner of Google Maps Hackathon 2025.</p>
            </div>
            <button>Get In Touch</button>
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