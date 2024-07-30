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
    { path: "/dashboard/contact", label: " Contact" },
  ];

  return (
    <div className="container mx-auto py-20 min-h-screen ">
      <nav className="flex flex-row justify-between">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="right flex ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg "
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <button className="btn btn-secondary w-full py-4">
                View Homepage
              </button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg "
          >
            <button
              className="btn btn-error w-full py-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </motion.div>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.map((button, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg"
          >
            <Link to={button.path}>
              <button className="btn btn-secondary border-primary hover:scale-125 hover:text-error w-full py-4 ">
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
