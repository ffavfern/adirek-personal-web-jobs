import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContentCard = ({ id, title, description, image, onDelete }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
  >
    <div className="flex flex-col md:flex-row items-center">
      {image && (
        <img src={image} alt="Content" className="w-32 h-32 object-cover rounded-lg mr-4" />
      )}
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
    <div className="flex mt-4 md:mt-0">
      <Link to={`/cms/edit/${id}`} className="btn btn-secondary mr-2">Edit</Link>
      <button onClick={() => onDelete(id)} className="btn btn-danger">Delete</button>
    </div>
  </motion.div>
);

export default ContentCard;
