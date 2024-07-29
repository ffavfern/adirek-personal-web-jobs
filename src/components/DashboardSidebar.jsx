import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-64 bg-primary text-secondary p-6 fixed md:static h-full md:h-auto"
    >
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="block hover:text-error">Dashboard Home</Link>
          </li>
          <li>
            <Link to="/manage-projects" className="block hover:text-error">Manage Projects</Link>
          </li>
          <li>
            <Link to="/manage-blog" className="block hover:text-error">Manage Blog</Link>
          </li>
          <li>
            <Link to="/manage-testimonials" className="block hover:text-error">Manage Testimonials</Link>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default DashboardSidebar;