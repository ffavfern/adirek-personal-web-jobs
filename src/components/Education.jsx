import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const EducationItem = ({ title, year, description, imageUrl }) => {
  return (
    <div className="education_detail flex flex-col md:flex-row mt-8 gap-4 hover:bg-gray-100 transition-all duration-300 rounded-lg p-4">
    <div className="logo education w-full md:w-1/4 flex-shrink-0">
      <img
        src={imageUrl}
        alt="logo education"
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
      {/*<p className="text-sm sm:text-md md:text-lg lg:text-xl text-gray-700"> {description}</p>*/ }
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
