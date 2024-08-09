import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ExperienceItem from "./ExperienceItem"; // Assuming it's in the same directory

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
    <div className="space-y-4"> {/* Spacing between accordion items */}
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
