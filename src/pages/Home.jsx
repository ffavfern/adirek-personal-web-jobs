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
import Contact from '../components/Contact';

function Home() {
  const [heroContent, setHeroContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      const heroDoc = await getDocs(collection(db, 'hero'));
      setHeroContent(heroDoc.docs[0].data());
      const aboutDoc = await getDocs(collection(db, 'about'));
      setAboutContent(aboutDoc.docs[0].data());
      const blogCollection = await getDocs(collection(db, 'blog'));
      setBlogPosts(blogCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
      setTestimonials(testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
        <Contact />
      </div>
    </>
  );
}

export default Home;
