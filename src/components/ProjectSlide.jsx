import  { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { gsap } from 'gsap';

const ProjectSlide = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      setProjects(projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    gsap.from('.project-slide', { opacity: 0, y: 50, duration: 1, stagger: 0.3 });
  }, [projects]);

  return (
    <section id="projectslide" className="bg-primary text-secondary py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">My Projects</h2>
        <Swiper spaceBetween={50} slidesPerView={1}>
          {projects.map((project) => (
            <SwiperSlide key={project.id} className="project-slide">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="mt-2">{project.description}</p>
                {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="mt-4" />}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProjectSlide;