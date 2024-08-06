import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', images: [], type: '', date: '' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const projectTypes = ['การประกวดแข่งขัน', 'งานวิจัยและการตีพิมพ์', 'วิทยาการและผู้ทรงคุณวุฒิ', 'รางวัลเชิดชูเกียรติ'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      setProjects(projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleImageUpload = async (files) => {
    const uploadedImageUrls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `project-images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );
    return uploadedImageUrls;
  };

  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await handleImageUpload(imageFiles);
      }

      if (editingProjectId) {
        const projectDoc = doc(db, 'projects', editingProjectId);
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
          await updateDoc(projectDoc, { ...newProject, images: uploadedImageUrls.length > 0 ? uploadedImageUrls : projectSnapshot.data().images });
          console.log('Updated project:', editingProjectId);
        } else {
          console.error('No document to update:', editingProjectId);
        }
      } else {
        await addDoc(collection(db, 'projects'), { ...newProject, images: uploadedImageUrls });
        console.log('Added new project');
      }

      setNewProject({ title: '', description: '', images: [], type: '', date: '' });
      setImageFiles([]);
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error('Error adding/updating project:', error);
    }
  };

  const handleEditProject = (project) => {
    console.log('Editing project with ID:', project.id); // Debugging: Log the ID
    setNewProject({ title: project.title, description: project.description, images: project.images, type: project.type, date: project.date });
    setEditingProjectId(project.id);
  };

  const handleDeleteProject = async (id) => {
    try {
      console.log('Attempting to delete project with ID:', id); // Debugging: Log the ID
      const projectDoc = doc(db, 'projects', id);

      // Check if the document exists before attempting to delete
      const projectSnapshot = await getDoc(projectDoc);
      if (projectSnapshot.exists()) {
        await deleteDoc(projectDoc);
        console.log('Successfully deleted project:', id);
        fetchProjects(); // Refresh the list of projects after deletion
      } else {
        console.error('Project not found with ID:', id);
      }
    } catch (error) {
      console.error('Error deleting project:', error); // Error handling
    }
  };

  const handleDeleteProjectByField = async (fieldValue) => {
    try {
      console.log('Attempting to delete project with custom field value:', fieldValue); // Debugging: Log the field value

      // Query the document based on the field 'id'
      const q = query(collection(db, 'projects'), where('id', '==', fieldValue));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
          console.log('Successfully deleted project with custom field value:', fieldValue);
        });
        fetchProjects(); // Refresh the list of projects after deletion
      } else {
        console.error('No project found with custom field value:', fieldValue);
      }
    } catch (error) {
      console.error('Error deleting project:', error); // Error handling
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">Manage Projects</h1>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-4">Back to Dashboard</button>
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">{editingProjectId ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleAddOrUpdateProject}>
          <input
            type="text"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            placeholder="Title"
            className="input input-bordered w-full mb-4"
            required
          />
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            placeholder="Description"
            className="textarea textarea-bordered w-full mb-4"
            required
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            className="input input-bordered w-full mb-4"
          />
          <select
            value={newProject.type}
            onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
            className="input input-bordered w-full mb-4"
            required
          >
            <option value="" disabled>Select Type</option>
            {projectTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="date"
            value={newProject.date}
            onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
            className="input input-bordered w-full mb-4"
            required
          />
          <button type="submit" className="btn btn-primary">{editingProjectId ? 'Update Project' : 'Add Project'}</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div 
            key={project.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }} 
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-700 mb-2">{project.description}</p>
            {project.images && project.images.map((image, index) => (
              <img key={`${project.id}-${index}`} src={image} alt={project.title} className="w-full h-32 object-cover rounded-lg mb-2" />
            ))}
            <p className="text-gray-600 mb-4">{project.type}</p>
            <p className="text-gray-600 mb-4">{project.date}</p>
            <button onClick={() => handleEditProject(project)} className="btn btn-secondary mr-2">Edit</button>
            {/*<button onClick={() => handleDeleteProject(project.id)} className="btn btn-danger">Delete</button> */}
            <button onClick={() => handleDeleteProjectByField(project.id)} className="btn btn-danger">Delete</button> 
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
