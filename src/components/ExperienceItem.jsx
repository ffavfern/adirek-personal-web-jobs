import React from "react";

const ExperienceItem = ({ title, year, description, imageUrl }) => {
  return (
    <div className="collapse  bg-base-200 rounded-lg mt-4">
      <input type="radio" name="experience-accordion" />
      <div className="collapse-title text-lg md:text-xl font-bold flex items-center gap-4">
        <img
          src={imageUrl}
          alt="logo experience"
          className="rounded-full border object-cover w-12 h-12 sm:w-16 sm:h-16"
        />
        <div>
          <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold uppercase">
            {title}
          </h4>

          <p className="text-gray-500 text-sm md:text-base">{year}</p>
        </div>
      </div>
      <div className="collapse-content">
        <p className="text-sm sm:text-base md:text-lg text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ExperienceItem;
