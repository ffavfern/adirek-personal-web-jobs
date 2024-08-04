import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ExperienceItem = ({ title, year, description, imageUrl }) => {
  return (
    <div className="experience_detail flex flex-row mt-10 gap-4 hover:bg-gray-100 transition-all duration-300 rounded-lg p-4">
      <div className="logo experience w-1/3">
        <img
          src={imageUrl}
          alt="logo experience"
          className="border rounded-full w-20 h-20"
        />
      </div>
      <div className="box_data flex-col">
        <h4 className="text-lg font-bold uppercase">{title}</h4>
        <p className="text-sm text-gray-500">{year}</p>
        <p className="text-md text-gray-700">{description}</p>
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
    <div>
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
