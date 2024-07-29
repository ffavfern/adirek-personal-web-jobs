import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex items-center justify-center min-h-screen"
  >
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </motion.div>
);

export default LoadingSpinner;