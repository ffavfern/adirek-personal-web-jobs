import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import ProjectSlide from '../components/ProjectSlide';
import ProjectsType from '../components/ProjectsType';
import Blog from '../components/Blog';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Contact from '../components/Contact';

const fetchCollectionData = async (collectionName) => {
  const collectionSnapshot = await getDocs(collection(db, collectionName));
  return collectionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const Home = () => {
  const [heroContent, setHeroContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

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
      <Hero content={heroContent} />
      <div className="container mx-20 justify-center">
        <About content={aboutContent} />
        <ProjectSlide id="projectslide" />
        <ProjectsType />
        
        <Blog posts={blogPosts} />
        <div className="line_section flex py-36 justify-center w-full h-full">
          <hr className="w-1/2" />
        </div>
        <Testimonials testimonials={testimonials} />
        
      </div>
      <Contact />
      <Footer/>
    </>
  );
};

export default Home;
