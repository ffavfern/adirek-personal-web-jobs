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
        className="container mx-auto p-6 "
      >
        <h2 className="text-5xl font-bold mb-14 text-gold uppercase tracking-widest">{heroContent.title}</h2>
        <p className="text-lg text-secondary uppercase">{heroContent.subtitle}</p>
        <p className="text-md text-paragraph uppercase">{heroContent.description}</p>
        <div className="scroll-mouse mt-20"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
