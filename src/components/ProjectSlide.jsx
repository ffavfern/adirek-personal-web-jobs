import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

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
    <section id={id} className="project-slide-section py-20">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <h2 className="text-4xl font-bold mb-10">Projects</h2>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Navigation, Pagination]}
        >
          {projects.map(project => (
            <SwiperSlide key={project.id}>
              <div className="relative bg-white p-6 rounded-lg shadow-xl group">
                {project.images && project.images.length > 0 && (
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="w-full h-80 object-cover rounded-lg mb-4 transition-transform transform group-hover:scale-105" 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity rounded-lg"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-300">{project.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default ProjectSlide;
