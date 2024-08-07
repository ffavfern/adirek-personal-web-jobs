import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import LoadingSpinner from './LoadingSpinner';
import './Hero.css';

const Hero = () => {
  const [heroContent, setHeroContent] = useState(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      const heroCollection = await getDocs(collection(db, 'hero'));
      setHeroContent(heroCollection.docs[0].data());
    };
    fetchHeroContent();
  }, []);

  if (!heroContent) {
    return <LoadingSpinner />;
  }

  return (
    <section id="hero" className="hero-section flex bg-primary text-secondary py-20 min-h-screen justify-center w-full text-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 lg:px-12 xl:px-24"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-14 text-gold uppercase tracking-widest">
          {heroContent.title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-secondary uppercase mb-4 md:mb-6">
          {heroContent.subtitle}
        </p>
        <p className="text-sm sm:text-md md:text-lg text-paragraph uppercase mb-10">
          {heroContent.description}
        </p>
        <div className="scroll-mouse mt-10 md:mt-20"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
