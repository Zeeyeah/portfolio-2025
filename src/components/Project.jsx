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
          <h5><a target='_blank' href={`https://${liveLink}`}>VIEW LIVE <svg xmlns="http://www.w3.org/2000/svg" width="65" viewBox="0 0 65 65"><path d="M49.462 1V35.055H45.679V7.451L6.651 46.4 3.976 43.726 43 4.78H15.321V1z" fill="#000" stroke="#000"></path></svg></a></h5>
          <h5>Design & Development</h5>
            </div>
          
          </div>
    </div>
  )
}

export default Project