import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6 md:p-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;