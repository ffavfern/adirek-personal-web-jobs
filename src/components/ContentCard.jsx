import React from 'react';

const ContentCard = ({ id, title, subtitle, description, imageUrl, profileImageUrl, onDelete, onUpdate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-12 h-12 object-cover rounded-full mr-4"
          />
        )}
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-md font-semibold text-gray-600">{subtitle}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{description}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex justify-end">
        <button className="btn btn-secondary mr-2" onClick={onUpdate}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContentCard;
