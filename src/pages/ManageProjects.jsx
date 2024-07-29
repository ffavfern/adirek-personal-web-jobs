
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '', type: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      setProjects(projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'projects'), form);
    setForm({ title: '', description: '', image: '', type: '' });
  };

  const handleUpdate = async (id) => {
    const projectDoc = doc(db, 'projects', id);
    await updateDoc(projectDoc, form);
    setForm({ title: '', description: '', image: '', type: '' });
  };

  const handleDelete = async (id) => {
    const projectDoc = doc(db, 'projects', id);
    await deleteDoc(projectDoc);
  };

  return (
    <div className="dashboard-container">
      <h1>Manage Projects</h1>
      <div>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
        <input type="text" name="type" value={form.type} onChange={handleChange} placeholder="Type" />
        <button onClick={handleAdd}>Add Project</button>
      </div>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <img src={project.image} alt={project.title} />
            <p>{project.type}</p>
            <button onClick={() => handleUpdate(project.id)}>Update</button>
            <button onClick={() => handleDelete(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProjects;
