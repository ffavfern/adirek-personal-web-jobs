import React, { useEffect, useState } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import './Hero.css';

const Hero = ({ content }) => {
  const { scrollY } = useViewportScroll();

  // Parallax effect for text
  const yTransform = useTransform(scrollY, [0, 300], [0, -100]);

  if (!content || Object.keys(content).length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <section id="hero" className="hero-section relative flex bg-primary text-secondary py-20 min-h-screen justify-center w-full text-center items-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/path-to-your-video.mp4" // Update with your actual video path
        autoPlay
        loop
        muted
      ></video>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container relative z-10 mx-auto px-6 lg:px-12 xl:px-24"
        style={{ y: yTransform }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-14 text-gold uppercase tracking-widest"
          whileHover={{ scale: 1.05 }} // Micro-interaction for hover effect
        >
          {content.title}
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-secondary uppercase mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {content.subtitle}
        </motion.p>
        <motion.p
          className="text-sm sm:text-md md:text-lg text-paragraph uppercase mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {content.description}
        </motion.p>
        <div className="scroll-mouse mt-10 md:mt-20"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
