import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, 'projects'));
      setProjects(projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Error deleting project: ', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Manage Projects</h1>
          <Link to="/addProject" className="btn btn-primary">Add New Project</Link>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4">
        <h2 className="text-2xl mb-4">Project List</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>
                    <Link to={`/editProject/${project.id}`} className="btn btn-secondary mr-2">
                      Edit
                    </Link>
                    <button className="btn btn-error" onClick={() => handleDelete(project.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageProjects;
