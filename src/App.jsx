
import { Canvas } from '@react-three/fiber'
import './App.css'
import HeroSection from './sections/HeroSection'
import { ReactLenis } from 'lenis/react'
import { View } from '@react-three/drei'
import ProjectImage from './components/ProjectImage'
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Projects from './sections/Projects'
import About from './sections/About'
import ElectricPole, { ElectricPoleScene } from './components/ElectricPole'
import { Physics } from '@react-three/rapier'
function App() {

  return (
    <div className='app'>
      {/* <ReactLenis  root />
      <HeroSection />
      <Projects />
      <About /> */}
      <ElectricPoleScene />
    </div>
  );
}

export default App
