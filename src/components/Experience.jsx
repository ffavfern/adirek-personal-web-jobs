import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ExperienceItem = ({ title, year, description, imageUrl }) => {
  return (
    <div className="experience_detail flex flex-col md:flex-row mt-8 gap-4 hover:bg-gray-100 transition-all duration-300 rounded-lg p-4">
      <div className="logo experience w-full md:w-1/4 flex-shrink-0">
        <img
          src={imageUrl}
          alt="logo experience"
          className="rounded-full border object-cover w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        />
      </div>
      <div className="box_data flex-grow">
        <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold uppercase">
          {title}
        </h4>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500">
          {year}
        </p>
        <p className="text-sm sm:text-md md:text-lg lg:text-xl text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const experiencesCollection = await getDocs(collection(db, "experience"));
      setExperiences(
        experiencesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchExperiences();
  }, []);

  return (
    <div className="space-y-8">
      {experiences.map((experience) => (
        <ExperienceItem
          key={experience.id}
          title={experience.title}
          year={experience.year}
          description={experience.description}
          imageUrl={experience.imageUrl}
        />
      ))}
    </div>
  );
};

export default Experience;
