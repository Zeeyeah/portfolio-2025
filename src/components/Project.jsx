import { View } from '@react-three/drei'
import React from 'react'
import ProjectImage from './ProjectImage'

const Project = ({name, imgSrc, index, liveLink}) => {
  return (
    <div className='project'>
        <div className='project-title'>
            <h5>{index}</h5>
            <h5>{name}</h5>
        </div>
         <View className='view'>
              <ProjectImage imgSrc={imgSrc} />
          </View>
          <div className="project-info">
            <div className='project-link'>
          <h5><a target='_blank' href={`https://${liveLink}`}>VIEW LIVE</a></h5>
          <h5>Design & Development</h5>
            </div>
          
          </div>
    </div>
  )
}

export default Project