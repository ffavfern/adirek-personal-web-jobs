import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import ProjectSlide from '../components/ProjectSlide';
import ProjectsType from '../components/ProjectsType';
import Blog from '../components/Blog';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import CustomCursor from '../components/CustomCursor';
import './Home.css';

const fetchCollectionData = async (collectionName) => {
  const collectionSnapshot = await getDocs(collection(db, collectionName));
  return collectionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const Home = () => {
  const [heroContent, setHeroContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Parallax effect with useScroll
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [0, 1]);
  const yTransform = useTransform(scrollY, [0, 200], [50, 0]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [hero, about, blog, testimonials] = await Promise.all([
          fetchCollectionData('hero'),
          fetchCollectionData('about'),
          fetchCollectionData('blog'),
          fetchCollectionData('testimonials'),
        ]);

        setHeroContent(hero[0] || {});
        setAboutContent(about[0] || {});
        setBlogPosts(blog);
        setTestimonials(testimonials);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <>
      <Navbar />
      <CustomCursor />
      <Hero content={heroContent} />
      <motion.div
        className="container mx-auto py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="glass-card hoverable" style={{ opacity, y: yTransform }}>
          <About content={aboutContent} />
        </motion.div>
        
        <motion.div className="glass-card hoverable" style={{ opacity, y: yTransform }} transition={{ delay: 0.2 }}>
          <ProjectSlide id="projectslide" />
        </motion.div>
        
        <motion.div className="glass-card hoverable" style={{ opacity, y: yTransform }} transition={{ delay: 0.4 }}>
          <ProjectsType />
        </motion.div>
        
        <motion.div className="glass-card hoverable " style={{ opacity, y: yTransform }} transition={{ delay: 0.6 }}>
          <Blog posts={blogPosts} />
        </motion.div>
        
        <div className="line_section flex py-20 justify-center">
          <hr className="w-1/2" />
        </div>
        
        <motion.div className="glass-card hoverable" style={{ opacity, y: yTransform }} transition={{ delay: 0.8 }}>
          <Testimonials testimonials={testimonials} />
        </motion.div>
      </motion.div>
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
