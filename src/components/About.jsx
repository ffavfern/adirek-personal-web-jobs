
import React from 'react';
import { motion } from 'framer-motion';
import Experience from './Experience';
import Education from './Education';

const About = () => {
  return (
    <section className="about flex flex-col md:flex-row justify-between py-20 md:py-60 items-start gap-4">
      <motion.div
        className="experience flex flex-col w-full md:w-1/3"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="uppercase font-bold text-4xl">Experience</h1>
        <Experience />
      </motion.div>
      <motion.div
        className="profile items-center flex flex-col w-full md:w-1/3"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://adirek.netlify.app/assets/profile-BgioiZ0C.png"
          alt="profile"
          className="w-full h-full bg-white rounded-xl shadow-xl"
        />
        <a href="https://drive.google.com/file/d/1nOr2V0OqJbMxUmQRy1PU33tPAUHmWTBR/preview">
          <button className="btn uppercase mt-10 w-40 tracking-widest">Download CV</button>
        </a>
      </motion.div>
      <motion.div
        className="education flex flex-col w-full md:w-1/3 p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="uppercase text-4xl font-bold">Education</h1>
        <Education />
      </motion.div>
    </section>
  );
};

export default About;
