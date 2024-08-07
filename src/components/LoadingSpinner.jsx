import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex items-center justify-center min-h-screen"
  >
    <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-t-4 border-b-4 border-primary"></div>
  </motion.div>
);

export default LoadingSpinner;
