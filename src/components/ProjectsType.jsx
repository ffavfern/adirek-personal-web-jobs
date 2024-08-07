import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaGraduationCap, FaRocket, FaLightbulb, FaTrophy } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdNavigateNext } from "react-icons/md";

// Configuration for project types
const projectTypeConfig = {
  'การประกวดแข่งขัน': { icon: FaGraduationCap, color: 'bg-white', displayName: 'Competition' },
  'งานวิจัยและการตีพิมพ์': { icon: FaRocket, color: 'bg-white', displayName: 'Research and publications' },
  'วิทยาการและผู้ทรงคุณวุฒิ': { icon: FaLightbulb, color: 'bg-white', displayName: 'Science and experts' },
  'รางวัลเชิดชูเกียรติ': { icon: FaTrophy, color: 'bg-white', displayName: 'Honorary Awards' },
  'default': { icon: FaLightbulb, color: 'bg-white', displayName: 'Other' }
};

// Function to get icon and color for a project type
const getProjectTypeConfig = (type) => projectTypeConfig[type] || projectTypeConfig['default'];

// Function to get project types with associated projects
const getTypesWithProjects = (projects) => {
  const typesWithProjects = projects.reduce((acc, project) => {
    if (!acc[project.type]) acc[project.type] = [];
    acc[project.type].push(project);
    return acc;
  }, {});

  return Object.keys(typesWithProjects).map(type => ({
    typeKey: type,
    ...getProjectTypeConfig(type),
    count: typesWithProjects[type].length
  }));
};

const ProjectsType = () => {
  const [projectTypes, setProjectTypes] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      const projects = projectsCollection.docs.map(doc => doc.data());

      setProjectTypes(getTypesWithProjects(projects));
    };
    fetchProjects();
  }, []);

  return (
    <section id="projecttype" className="bg-secondary text-primary pt-10 pb-60">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center"
      >
        <div 
          className="grid gap-8 place-items-center"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          {projectTypes.filter(type => type.count > 0).map((type) => (
            <ProjectCard key={type.typeKey} type={type} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const ProjectCard = ({ type }) => {
  const IconComponent = type.icon;

  return (
    <motion.div 
      className={`relative p-8 ${type.color} text-secondary rounded-lg shadow-lg flex flex-col justify-between items-start`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      style={{ minWidth: '300px', maxWidth: '300px', height: 'auto' }}
    >
      <div className="flex items-center justify-center h-12 w-12 bg-opacity-10 rounded-full mb-4">
        <IconComponent size={40} className="text-error" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-primary">{type.displayName}</h3>
      </div>
      <div className="mt-4">
        <Link to={`/projects/${type.typeKey}`} className="text-primary hover:text-primary-dark flex items-center">
          <span>See more</span>
          <MdNavigateNext />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectsType;
