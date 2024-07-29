
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

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
    return <div>Loading...</div>;
  }

  return (
    <section id="hero" className="hero-section bg-primary text-secondary py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <h2 className="text-4xl font-bold mb-4">{heroContent.title}</h2>
        <p className="text-lg">{heroContent.description}</p>
        <img src={heroContent.image} alt={heroContent.title} className="w-full h-48 object-cover rounded-lg mt-4" />
      </motion.div>
    </section>
  );
};

export default Hero;
