import React from 'react';

const ContentCard = ({ id, title, subtitle, description, imageUrl, onDelete, onUpdate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-md font-semibold mb-2">{subtitle}</p>
      <p className="text-gray-700 mb-2">{description}</p>
      <img src={imageUrl} alt={title} className="w-full h-32 object-cover rounded-lg mb-2" />
      <div className="flex justify-end">
        <button className="btn btn-secondary mr-2" onClick={onUpdate}>Edit</button>
        <button className="btn btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ContentCard;
