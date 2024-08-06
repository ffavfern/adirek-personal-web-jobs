import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const ProjectOther = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, "projects"));
      const projectData = projectsCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectData);
      setFilteredProjects(projectData);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let updatedProjects = [...projects];

    if (filterType) {
      updatedProjects = updatedProjects.filter(
        (project) => project.type === filterType
      );
    }

    if (searchTerm) {
      updatedProjects = updatedProjects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption) {
      if (sortOption === "title") {
        updatedProjects.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOption === "date") {
        updatedProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }

    setFilteredProjects(updatedProjects);
  }, [filterType, sortOption, searchTerm, projects]);

  const clearFilters = () => {
    setFilterType("");
    setSortOption("");
    setSearchTerm("");
    setFilteredProjects(projects);
  };

  return (
    <motion.div
      className="container mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-row justify-between items-center">
      <motion.h1
        className="text-4xl font-bold my-20 uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        All Projects
      </motion.h1>
      {/* Back Button */}
      <button className="btn btn-primary mb-4 hover:scale-110 " onClick={() => navigate("/")}>
        Back to Home
      </button>
      </div>
      {/* Search, Filter, and Sort Options */}
      <motion.div
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-xl font-bold mb-2">
            Search by Title:
          </label>
          <input
            type="text"
            id="search"
            className="input input-bordered w-full"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by Type */}
        <div>
          <label htmlFor="filter" className="block text-xl font-bold mb-2">
            Filter by Type:
          </label>
          <select
            id="filter"
            className="input input-bordered w-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="การประกวดแข่งขัน">การประกวดแข่งขัน</option>
            <option value="งานวิจัยและการตีพิมพ์">งานวิจัยและการตีพิมพ์</option>
            <option value="วิทยาการและผู้ทรงคุณวุฒิ">
              วิทยาการและผู้ทรงคุณวุฒิ
            </option>
            <option value="รางวัลเชิดชูเกียรติ">รางวัลเชิดชูเกียรติ</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label htmlFor="sort" className="block text-xl font-bold mb-2">
            Sort by:
          </label>
          <select
            id="sort"
            className="input input-bordered w-full"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">No Sorting</option>
            <option value="title">Title</option>
            <option value="date">Date</option>
          </select>
        </div>
      </motion.div>

      {/* Clear Filters Button */}
      <motion.div
        className="mb-6 flex justify-end"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear Filters
        </button>
      </motion.div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/${project.id}`}>
                <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden group">
                  {project.images && project.images.length > 0 && (
                    <motion.img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-64 object-cover transition-transform transform group-hover:scale-105"
                      layoutId={`project-image-${project.id}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity">
                    <h3 className="text-3xl font-semibold mb-4 text-white uppercase">
                      {project.title}
                    </h3>
                    <p className="text-lg text-gray-400 uppercase">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProjectOther;
