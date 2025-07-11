import React from 'react'
import '../styles/about.css'
const About = () => {
    const skills = [
        'Javascript', 'Typescript', 'React', 'Next.js', 'Node.js', 'Express.js','Shader Writing', 'Three.js', 'WebGL', 'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Figma', 'Blender', 'Photoshop', 'Illustrator'
    ]
  return (
    <div className="about">
      <h1>About Me.</h1>
      <div className="about-me">
        <div className="profile-pic"></div>
        <div className="about-me-info">
          {/* <h2>Hello.</h2> */}
          <p>
            I'm a web developer based in Hyderabad, India, currently pursuing my
            Master's in Computer Applications (MCA).
            <br />
            <br />
            Beyond coding, I'm deeply passionate about visual and auditory
            storytelling—I explore cinematography, compose music, and create 3D
            and digital art. My work blends technology with creativity, aiming
            to craft experiences that are both functional and inspiring.
          </p>
        </div>
        <div>
          <h2>Skills.</h2>
          <ul className="skills">
            {skills.map((skill, index) => (
              <sapn key={index}>{skill}</sapn>
            ))}
          </ul>
        </div>
      </div>
      <div className="contact">
        <h4>GET IN TOUCH.</h4>
        <ul>
          <li>
            <a target='_blank' href="mailto:zu0827992@gmail.com">Resume</a>
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
      </div>
    </div>
  );
}

export default About