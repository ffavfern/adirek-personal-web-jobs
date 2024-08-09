import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const EducationItem = ({ title, year, description, imageUrl }) => {
  return (
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
  );
};

const Education = () => {
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    const fetchEducations = async () => {
      const educationsCollection = await getDocs(collection(db, "education"));
      setEducations(
        educationsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchEducations();
  }, []);

  return (
    <div className="space-y-8">
      {" "}
      {/* Ensures spacing between items */}
      {educations.map((education) => (
        <EducationItem
          key={education.id}
          title={education.title}
          year={education.year}
          description={education.description}
          imageUrl={education.imageUrl}
        />
      ))}
    </div>
  );
};

export default Education;
