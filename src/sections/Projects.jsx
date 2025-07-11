import { OrbitControls, View } from '@react-three/drei'
import React from 'react'
import ProjectImage from '../components/ProjectImage'
import { Canvas } from '@react-three/fiber'
import Project from '../components/Project'
import '../styles/projects.css'
const Projects = () => {
    const projectDataJson = [
      {
        name: "Daryaft",
        imgSrc: "daryaft",
        info: "",
        id: '01',
        liveLink: 'google-3d-maps-hackathon.vercel.app',
      },
      {
        name: "Kuro Gaming",
        imgSrc: "kurogaming",
        info: "",
        id: '02',
        liveLink: 'kurogaming.com',

      },
      {
        name: "Rebellion eSports Cafe",
        imgSrc: "rebellion",
        info: "",
        id: '03',
        liveLink: 'register.rebellionesports.gg/login',

      },
      {
        name: "Game Theory",
        imgSrc: "gametheory",
        info: "",
        id: '04',
        liveLink: 'gametheory.cafe',
      },
    ];
  return (
    <div className="projects">
      <h1>Work.</h1>
      <div className="project-columns">
        <div className="left-column">
          {projectDataJson
            .filter((_, i) => i % 2 === 0)
            .map((project) => (
              <Project key={project.id} index={project.id} {...project} />
            ))}
        </div>

        <div className="right-column">
          {projectDataJson
            .filter((_, i) => i % 2 !== 0)
            .map((project) => (
              <Project key={project.id} index={project.id} {...project} />
            ))}
        </div>
      </div>

      <Canvas
        camera={{ zoom: 1.58 }}
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
        }}
        eventSource={document.getElementById("root")}
      >
        <OrbitControls enabled={false} />
        <View.Port />
      </Canvas>
      {/* <PortfolioGrid /> */}
    </div>
  );
}

export default Projects