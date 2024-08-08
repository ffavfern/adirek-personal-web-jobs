import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProjectSlide = ({ id }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('date', 'desc'), limit(10));
      const projectsCollection = await getDocs(q);
      setProjects(projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  return (
    <section id={id} className="project-slide-section  py-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="flex flex-row justify-between py-10 items-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gold uppercase tracking-widest">Our Projects</h2>
          <Link to="/projects/other">
            <div className="btn text-primary hover:bg-error hover:text-secondary hover:scale-110 hover:shadow-xl text-md uppercase">
              Project Other
            </div>
          </Link>
        </div>

        <Swiper
      spaceBetween={20}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
          {projects.map(project => (
            <SwiperSlide key={project.id} className="size-card">
              <Link to={`/${project.id}`} className="block"> 
                <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden group">
                  {project.images && project.images.length > 0 && (
                    <img 
                      src={project.images[0]} 
                      alt={project.title} 
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform transform group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end transition-opacity">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-white uppercase">
                      {project.title}
                    </h3>
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
