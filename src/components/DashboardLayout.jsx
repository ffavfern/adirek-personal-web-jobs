import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar should collapse on smaller screens */}
      <div className="w-full md:w-1/4 lg:w-1/5">
        <DashboardSidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 p-4 sm:p-6 md:p-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
