import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner'; 
import { FaCalendarAlt, FaTag, FaInfoCircle } from 'react-icons/fa';
import './ProjectDetail.css'; // Import the custom CSS

const ProjectDetail = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
    <div className="container mx-auto  mb-20">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white p-6 sm:p-10  shadow-lg mb-8 ">
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt={project.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-lg"
          />
        )}
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase">{project.title}</h1>
          
          <Link to="/">
            <button className="mt-4 bg-error text-white py-2 px-4 sm:px-6 lg:px-8 rounded-lg font-semibold hover:bg-error-dark transition duration-300">
              Back to Projects
            </button>
          </Link>
        </div>
      </div>

      {/* Image Gallery Section */}
      {project.images && project.images.length > 0 ? (
        <div className="mb-8">
          <div className="w-full max-w-3xl px-10 mb-6 flex justify-center">
            <img 
              src={selectedImage} 
              alt={project.title} 
              className="w-full max-h-80 object-cover shadow-lg rounded-lg cursor-pointer"
              onClick={openModal} // Open modal on click
            />
          </div>
          <div className="flex justify-center flex-wrap gap-4">
            {project.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${project.title} - Image ${index + 1}`} 
                className={`thumbnail-image w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg shadow-lg cursor-pointer ${selectedImage === image ? 'selected-thumbnail border-2 border-error' : ''}`}
                onClick={() => setSelectedImage(image)} 
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No images available for this project.</p>
      )}

      {/* Project Details Section */}
      <div className="bg-white p-4 mx-10 rounded-lg shadow-lg mt-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Project Details</h2>
        <p className="text-base sm:text-lg lg:text-xl mb-4">{project.description}</p>

        {/* Project Type */}
        <div className="flex items-center mb-4">
          <FaTag className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 text-yellow-500 animate-bounce" />
          <p className="text-base sm:text-lg lg:text-xl">Type: <span className="text-gray-700">{project.type || 'N/A'}</span></p>
        </div>

        {/* Project Date */}
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 text-yellow-500 animate-pulse" />
          <p className="text-base sm:text-lg lg:text-xl">Date: <span className="text-gray-700">{project.date || 'N/A'}</span></p>
        </div>

        {/* Project Status */}
        <div className="flex items-center mb-4">
          <FaInfoCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 text-yellow-500 animate-spin-slow" />
          <p className="text-base sm:text-lg lg:text-xl">Status: <span className="text-gray-700">Ongoing</span></p>
        </div>
      </div>

      {/* Full Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative max-w-4xl mx-auto">
            <img 
              src={selectedImage} 
              alt={project.title} 
              className="w-full h-auto max-h-screen object-cover rounded-lg"
            />
            <button 
              onClick={closeModal} 
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
