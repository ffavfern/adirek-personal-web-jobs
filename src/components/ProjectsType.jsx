import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaGraduationCap, FaRocket, FaLightbulb, FaTrophy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProjectsType = () => {
  const [projectTypes, setProjectTypes] = useState([]);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      const types = projectsCollection.docs.map(doc => doc.data().type);
      const uniqueTypes = [...new Set(types)].map(type => {
        let icon, color, description;
        switch(type) {
          case 'การประกวดแข่งขัน':
            icon = <FaGraduationCap size={40} className="text-error" />;
            color = 'bg-white';
            description = 'Competition';
            break;
          case 'งานวิจัยและการตีพิมพ์':
            icon = <FaRocket size={40} className="text-error" />;
            color = 'bg-white';
            description = 'Research and publications';
            break;
          case 'วิทยาการและผู้ทรงคุณวุฒิ':
            icon = <FaLightbulb size={40} className="text-error" />;
            color = 'bg-white';
            description = 'Science and experts';
            break;
          case 'รางวัลเชิดชูเกียรติ':
            icon = <FaTrophy size={40} className="text-error" />;
            color = 'bg-white';
            description = 'Honorary Awards';
            break;
          default:
            icon = <FaLightbulb size={40} className="text-error" />;
            color = 'bg-white';
            description = 'Here has to be short description of this course.';
            break;
        }
        return { 
          title: type, 
          icon, 
          color,
          description 
        };
      });
      setProjectTypes(uniqueTypes);
    };
    fetchProjectTypes();
  }, []);

  return (
    <section id="projecttype" className="bg-secondary text-primary py-60">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center"
      >
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {projectTypes.map((type) => (
            <motion.div 
              key={type.title} 
              className={`relative p-8 ${type.color} text-secondary rounded-lg shadow-lg flex flex-col justify-between items-start`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center h-12 w-12 bg-opacity-10 rounded-full mb-4">
                {type.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                <p className="text-gray-700">{type.description}</p>
              </div>
              <div className="mt-4">
                <Link to={`/projects/${type.title}`} className="text-primary hover:text-primary-dark flex items-center">
                  <span>Learn more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-6.707a1 1 0 010-1.414l2-2a1 1 0 111.414 1.414L10.414 11H14a1 1 0 110 2h-4a1 1 0 01-.707-.293z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default ProjectsType;
