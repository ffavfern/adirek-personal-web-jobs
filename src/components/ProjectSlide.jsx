import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 

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
    <section id={id} className="project-slide-section pb-16 sm:pb-20 lg:pb-24">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row justify-between py-10 sm:py-14 lg:py-20 items-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold uppercase tracking-widest text-center lg:text-left mb-8 lg:mb-0">
            Our Projects
          </h2>
          <Link to="/projects/other">
            <div className="btn text-base sm:text-lg lg:text-xl text-primary hover:bg-error hover:text-secondary hover:scale-110 hover:shadow-xl uppercase transition-all duration-300">
              Project Other
            </div>
          </Link>
        </div>
       
        <Swiper
          spaceBetween={20}
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
            <SwiperSlide key={project.id} className='size-card'>
              <Link to={`/${project.id}`} className="block"> 
                <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden group">
                  {project.images && project.images.length > 0 && (
                    <img 
                      src={project.images[0]} 
                      alt={project.title} 
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform transform group-hover:scale-105" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end transition-opacity">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold mb-2 lg:mb-4 text-white uppercase">{project.title}</h3>
                    <p className="text-sm sm:text-lg text-gray-400 uppercase">{project.description}</p>
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
