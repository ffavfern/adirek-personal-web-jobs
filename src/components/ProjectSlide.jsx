import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ProjectSlide = ({ id }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      setProjects(projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  return (
    <section id={id} className="project-slide-section bg-gray-100 py-20">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <h2 className="text-4xl font-bold mb-4">Projects</h2>
        <Swiper spaceBetween={50} slidesPerView={3}>
          {projects.map(project => (
            <SwiperSlide key={project.id}>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="mt-2">{project.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default ProjectSlide;
