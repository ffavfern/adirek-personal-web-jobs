
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/manage-projects">Manage Projects</Link></li>
          <li><Link to="/manage-blog">Manage Blog</Link></li>
          <li><Link to="/manage-testimonials">Manage Testimonials</Link></li>
          <li><Link to="/manage-hero">Manage Hero</Link></li>
          <li><Link to="/manage-about">Manage About</Link></li>
          <li><Link to="/manage-contact">Manage Contact</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        {/* The routes for each management page will be rendered here */}
      </div>
    </div>
  );
};

export default Dashboard;
