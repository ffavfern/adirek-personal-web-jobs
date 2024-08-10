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
      const q = query(
        collection(db, 'projects'),
        orderBy('date', 'desc'),
        limit(10)
      );
      const projectsCollection = await getDocs(q);
      setProjects(
        projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchProjects();
  }, []);

  return (
    <section
      id={id}
      className="project-slide-section py-20 "
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="flex flex-col  md:flex-row justify-between py-8 items-center">
          <h2 className="text-2xl sm:text-4xl md:text-4xl font-bold text-black uppercase tracking-widest">
            Our Projects
          </h2>
          <Link to="/projects/other">
            <div className="btn text-primary mt-4 md:mt-0 hover:bg-error hover:text-secondary hover:scale-110 hover:shadow-xl text-md uppercase">
              Project Other
            </div>
          </Link>
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            480: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 1.5,
              spaceBetween: 25,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
        >
          {projects.map((project) => (
            <SwiperSlide
              key={project.id}
              className="flex items-center justify-center "
            >
              <Link to={`/${project.id}`} className="block w-full h-full">
                <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden group">
                  {project.images && project.images.length > 0 && (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-96 sm:h-48 md:h-72 lg:h-80 object-cover transition-transform transform group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end transition-opacity">
                    <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 text-white uppercase">
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
