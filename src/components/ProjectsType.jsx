import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  FaGraduationCap,
  FaRocket,
  FaLightbulb,
  FaTrophy,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdNavigateNext } from "react-icons/md";

// Configuration for project types
const projectTypeConfig = {
  การประกวดแข่งขัน: {
    icon: FaGraduationCap,
    color: "bg-white",
    displayName: "Competition",
  },
  งานวิจัยและการตีพิมพ์: {
    icon: FaRocket,
    color: "bg-white",
    displayName: "Research and publications",
  },
  วิทยาการและผู้ทรงคุณวุฒิ: {
    icon: FaLightbulb,
    color: "bg-white",
    displayName: "Science and experts",
  },
  รางวัลเชิดชูเกียรติ: {
    icon: FaTrophy,
    color: "bg-white",
    displayName: "Honorary Awards",
  },
  default: { icon: FaLightbulb, color: "bg-white", displayName: "Other" },
};

// Function to get icon and color for a project type
const getProjectTypeConfig = (type) =>
  projectTypeConfig[type] || projectTypeConfig["default"];

// Function to get project types with associated projects
const getTypesWithProjects = (projects) => {
  const typesWithProjects = projects.reduce((acc, project) => {
    if (!acc[project.type]) acc[project.type] = [];
    acc[project.type].push(project);
    return acc;
  }, {});

  return Object.keys(typesWithProjects).map((type) => ({
    typeKey: type,
    ...getProjectTypeConfig(type),
    count: typesWithProjects[type].length,
  }));
};

const ProjectsType = () => {
  const [projectTypes, setProjectTypes] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, "projects"));
      const projects = projectsCollection.docs.map((doc) => doc.data());

      setProjectTypes(getTypesWithProjects(projects));
    };
    fetchProjects();
  }, []);

  return (
    <section id="projecttype" className="bg-secondary text-primary mx-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectTypes
            .filter((type) => type.count > 0)
            .map((type) => (
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
      className={`relative p-4 sm:p-6 md:p-8 ${type.color} text-secondary rounded-lg shadow-lg flex flex-col lg:h-64 md:h-56`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 bg-opacity-10 rounded-full mb-3 sm:mb-4">
        <IconComponent size={36} sm:size={40} className="text-error" />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg sm:text-xl md:text-lg font-bold mb-1 sm:mb-2 text-primary">
          {type.displayName}
        </h3>
      </div>
      <div className="mt-3 sm:mt-4">
        <Link
          to={`/projects/${type.typeKey}`}
          className="text-primary hover:text-primary-dark flex items-center"
        >
          <span className="text-sm sm:text-base">See more</span>
          <MdNavigateNext />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectsType;
