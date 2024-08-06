import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner'; 
import { FaCalendarAlt, FaTag, FaInfoCircle } from 'react-icons/fa';
import './ProjectDetail.css' // Import the custom CSS

const ProjectDetail = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null); 

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, 'projects', id);
        const projectDoc = await getDoc(projectRef);
  
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
          setSelectedImage(projectDoc.data().images[0] || null); 
        } else {
          setError("Project not found");
        }
      } catch (error) {
        setError("Error fetching project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />; 
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">{error}</div>; 
  }

  if (!project) {
    return <div className="text-center mt-20">Project not found.</div>; 
  }

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white p-10 rounded-lg shadow-lg mb-8 relative">
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt={project.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-lg"
          />
        )}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 uppercase">{project.title}</h1>
          
          <Link to="/">
            <button className="mt-4 bg-error text-white py-2 px-6 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300">
              Back to Projects
            </button>
          </Link>
        </div>
      </div>

      {/* Image Gallery Section */}
      {project.images && project.images.length > 0 ? (
        <div className="mb-8">
          <div className="w-full h-auto mb-6 flex justify-center">
            <img 
              src={selectedImage} 
              alt={project.title} 
              className="fixed-image shadow-lg" // Apply fixed size class
            />
          </div>
          <div className="flex justify-center space-x-4">
            {project.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${project.title} - Image ${index + 1}`} 
                className={`thumbnail-image ${selectedImage === image ? 'selected-thumbnail' : ''}`} // Apply thumbnail class and selected state
                onClick={() => setSelectedImage(image)} 
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No images available for this project.</p>
      )}

      {/* Project Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Project Details</h2>
        <p className="text-xl mb-4">{project.description}</p>

        {/* Project Type */}
        <div className="flex items-center mb-4">
          <FaTag className="w-6 h-6 mr-2 text-yellow-500 animate-bounce" />
          <p className="text-lg">Type: <span className="text-gray-700">{project.type || 'N/A'}</span></p>
        </div>

        {/* Project Date */}
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="w-6 h-6 mr-2 text-yellow-500 animate-pulse" />
          <p className="text-lg">Date: <span className="text-gray-700">{project.date || 'N/A'}</span></p>
        </div>

        {/* Project Status */}
        <div className="flex items-center mb-4">
          <FaInfoCircle className="w-6 h-6 mr-2 text-yellow-500 animate-spin-slow" />
          <p className="text-lg">Status: <span className="text-gray-700">Ongoing</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
