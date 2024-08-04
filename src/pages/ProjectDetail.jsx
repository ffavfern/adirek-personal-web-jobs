import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProjectDetail = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id); // Reference to the project document
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject(docSnap.data()); // Set the project data
        } else {
          console.error('No such document!');
          setError('Project not found.');
        }
      } catch (err) {
        console.error('Error fetching project:', err.message);
        setError('Failed to load project.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="project-detail-section py-20 px-10 bg-gray-100">
      <div className="container mx-auto">
        {project && (
          <>
            <h1 className="text-4xl font-bold mb-8">{project.title}</h1>
            {project.images && project.images.length > 0 && (
              <img 
                src={project.images[0]} 
                alt={project.title} 
                className="w-full h-auto rounded-lg mb-8" 
              />
            )}
            <div className="text-lg text-gray-700 mb-4">
              <p>{project.description}</p>
            </div>
            <div className="text-md text-gray-600">
              <p><strong>Date:</strong> {project.date}</p>
              <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
              <p><strong>Client:</strong> {project.client}</p>
            </div>
         
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectDetail;
