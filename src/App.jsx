
import { Canvas } from '@react-three/fiber'
import './App.css'
import HeroSection from './sections/HeroSection'
import { ReactLenis } from 'lenis/react'
import { View } from '@react-three/drei'
import ProjectImage from './components/ProjectImage'
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Projects from './sections/Projects'
function App() {

  return (
    <div className='app'>
      <ReactLenis  root />
      <HeroSection />
      <Projects />
    </div>
  );
}

export default App
