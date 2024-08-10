import React from "react";
import { motion } from "framer-motion";
import Experience from "./Experience";
import Education from "./Education";
import { FaDownload } from "react-icons/fa";

const About = () => {
  return (
    <section className="about grid gap-y-20 py-20  ">
      {/* Profile Section */}
      <motion.div
        className="profile items-center flex flex-col w-full "
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://adirek.netlify.app/assets/profile-BgioiZ0C.png"
          alt="profile"
          className="w-full sm:w-1/2 md:w-3/4 lg:w-1/3 h-auto bg-white rounded-xl shadow-xl mx-auto"
        />

        <a href="https://drive.google.com/file/d/1nOr2V0OqJbMxUmQRy1PU33tPAUHmWTBR/preview">
          <motion.button
            className="btn uppercase mt-4 sm:mt-6 md:mt-10 w-60 tracking-widest flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaDownload className="mr-2" />
            Download CV
          </motion.button>
        </a>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between gap-8 w-full">
        {/* Experience Section */}
        <motion.div
          className="experience flex flex-col w-full md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-12 text-gold uppercase tracking-widest">
            Experience
          </h1>

          <Experience />
        </motion.div>

        {/* Education Section */}
        <motion.div
          className="education flex flex-col w-full md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-12 text-gold uppercase tracking-widest">
          Education
          </h1>
          <Education />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
