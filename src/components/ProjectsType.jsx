import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaGraduationCap, FaRocket, FaLightbulb, FaTrophy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Configuration for project types
const projectTypeConfig = {
  'การประกวดแข่งขัน': { icon: FaGraduationCap, color: 'bg-white', displayName: 'Competition' },
  'งานวิจัยและการตีพิมพ์': { icon: FaRocket, color: 'bg-white', displayName: 'Research and publications' },
  'วิทยาการและผู้ทรงคุณวุฒิ': { icon: FaLightbulb, color: 'bg-white', displayName: 'Science and experts' },
  'รางวัลเชิดชูเกียรติ': { icon: FaTrophy, color: 'bg-white', displayName: 'Honorary Awards' },
  'default': { icon: FaLightbulb, color: 'bg-white', displayName: 'Other' }
};

// Function to get icon and color for a project type
const getProjectTypeConfig = (type) => {
  return projectTypeConfig[type] || projectTypeConfig['default'];
};

const ProjectsType = () => {
  const [projectTypes, setProjectTypes] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      const projects = projectsCollection.docs.map(doc => doc.data());

      const typesWithProjects = getTypesWithProjects(projects);
      setProjectTypes(typesWithProjects);
    };
    fetchProjects();
  }, []);

  const getTypesWithProjects = (projects) => {
    const typesWithProjects = projects.reduce((acc, project) => {
      if (!acc[project.type]) {
        acc[project.type] = [];
      }
      acc[project.type].push(project);
      return acc;
    }, {});

    return Object.keys(typesWithProjects).map(type => ({
      typeKey: type,
      ...getProjectTypeConfig(type),
      count: typesWithProjects[type].length
    }));
  };

  return (
    <section id="projecttype" className="bg-secondary text-primary pt-10 pb-20 sm:pb-60">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center px-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projectTypes
            .filter(type => type.count > 0)
            .map((type) => (
              <ProjectCard key={type.typeKey} type={type} />
            ))
          }
        </div>
      </motion.div>
    </section>
  );
};

// Extracted ProjectCard component for reusability and clarity
const ProjectCard = ({ type }) => {
  const IconComponent = type.icon;

  return (
    <motion.div 
      className={`relative p-6 sm:p-8 ${type.color} text-secondary rounded-lg shadow-lg flex flex-col justify-between items-start w-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center justify-center h-12 w-12 bg-opacity-10 rounded-full mb-4">
        <IconComponent size={40} className="text-error" />
      </div>
      <div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-primary">{type.displayName}</h3>
      </div>
      <div className="mt-4">
        <Link to={`/projects/${type.typeKey}`} className="text-primary hover:text-primary-dark flex items-center">
          <span>See more</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-6.707a1 1 0 010-1.414l2-2a1 1 0 111.414 1.414L10.414 11H14a1 1 0 110 2h-4a1 1 0 01-.707-.293z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectsType;
