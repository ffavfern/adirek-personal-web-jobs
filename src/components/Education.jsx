import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const EducationItem = ({ title, year, description, imageUrl }) => {
  return (
    <div className="education_detail flex flex-row mt-10 gap-4 hover:bg-gray-100 transition-all duration-300 rounded-lg p-4">
      <div className="logo education w-1/2">
        <img
          src={imageUrl}
          alt="logo education"
          className="rounded-full w-20 h-20 border"
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
    <div>
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
