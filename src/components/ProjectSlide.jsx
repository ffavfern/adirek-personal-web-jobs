import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link from React Router

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
    <section id={id} className="project-slide-section py-24">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <h2 className="text-5xl font-serif font-bold mb-14 text-gold uppercase tracking-widest">Our Projects</h2>
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
              <Link to={`/projects/${project.id}`} className="block"> {/* Wrap the content in a Link component */}
                <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden group">
                  {project.images && project.images.length > 0 && (
                    <img 
                      src={project.images[0]} 
                      alt={project.title} 
                      className="w-full h-96 object-cover transition-transform transform group-hover:scale-105" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity">
                    <h3 className="text-3xl font-serif font-semibold mb-4 text-white uppercase">{project.title}</h3>
                    <p className="text-lg text-gray-400 uppercase">{project.description}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default ProjectSlide;
