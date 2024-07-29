import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ProjectsType = () => {
  const projectTypes = [
    'การประกวดแข่งขัน',
    'งานวิจัยและการตีพิมพ์',
    'วิทยาการและผู้ทรงคุณวุฒิ',
    'รางวัลเชิดชูเกียรติ',
  ];

  return (
    <section id="projecttype" className="bg-secondary text-primary py-20">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center"
      >
        <h2 className="text-4xl font-bold">Project Types</h2>
        <div className="flex flex-wrap justify-center mt-8">
          {projectTypes.map((type) => (
            <div key={type} className="m-4 p-4 bg-primary text-secondary rounded-lg shadow-lg project-type">
              <h3 className="text-2xl font-bold">{type}</h3>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default ProjectsType;
