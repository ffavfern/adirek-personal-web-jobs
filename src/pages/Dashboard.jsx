import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const buttons = [
    { path: "/dashboard/projects", label: " Projects" },
    { path: "/dashboard/blogs", label: " Blogs" },
    { path: "/dashboard/admin", label: " Admin" },
    { path: "/dashboard/hero", label: " Hero" },
    { path: "/dashboard/experience", label: " Experience" },
    { path: "/dashboard/education", label: " Education" },
    { path: "/dashboard/testimonials", label: " Testimonials" },
    { path: "/dashboard/manageContact", label: " Contact" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 min-h-screen">
      <nav className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-0">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg w-full sm:w-auto"
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <button className="btn btn-secondary w-full sm:w-auto py-3">
                View Homepage
              </button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg w-full sm:w-auto"
          >
            <button
              className="btn btn-error w-full sm:w-auto py-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </motion.div>
        </div>
      </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.map((button, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-lg"
          >
            <Link to={button.path}>
              <button className="btn btn-secondary border-primary hover:scale-105 hover:text-error w-full py-3 sm:py-4">
                {button.label}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
