import React from 'react';
import { motion } from 'framer-motion';
import Experience from './Experience';
import Education from './Education';

const About = () => {
  return (
    <section className="about flex flex-col md:flex-row justify-between py-20 md:py-60 items-start gap-10 px-6 sm:px-10 lg:px-20 xl:px-32">
      <motion.div
        className="experience flex flex-col w-full md:w-1/3"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-14 text-gold uppercase tracking-widest">Experience</h1>
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
          className="w-2/3 sm:w-1/2 md:w-full h-auto bg-white rounded-xl shadow-xl"
        />
        <a href="https://drive.google.com/file/d/1nOr2V0OqJbMxUmQRy1PU33tPAUHmWTBR/preview">
          <button className="btn uppercase mt-6 md:mt-10 w-32 sm:w-40 tracking-widest">Download CV</button>
        </a>
      </motion.div>
      <motion.div
        className="education flex flex-col w-full md:w-1/3"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-14 text-gold uppercase tracking-widest">Education</h1>
        <Education />
      </motion.div>
    </section>
  );
};

export default About;
