
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', image: '' });
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = await getDocs(collection(db, 'blogs'));
      setBlogs(blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBlogs();
  }, []);

  const handleAddBlog = async () => {
    await addDoc(collection(db, 'blogs'), newBlog);
    setNewBlog({ title: '', content: '', image: '' });
    fetchBlogs();
  };

  const handleUpdateBlog = async (id, updatedBlog) => {
    const blogDoc = doc(db, 'blogs', id);
    await updateDoc(blogDoc, updatedBlog);
    setEditingBlog(null);
    fetchBlogs();
  };

  const handleDeleteBlog = async (id) => {
    const blogDoc = doc(db, 'blogs', id);
    await deleteDoc(blogDoc);
    fetchBlogs();
  };

  const fetchBlogs = async () => {
    const blogsCollection = await getDocs(collection(db, 'blogs'));
    setBlogs(blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">Manage Blogs</h1>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-4">Back to Dashboard</button>
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
        <input
          type="text"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          placeholder="Title"
          className="input input-bordered w-full mb-4"
        />
        <textarea
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
          placeholder="Content"
          className="textarea textarea-bordered w-full mb-4"
        />
        <input
          type="text"
          value={newBlog.image}
          onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
          placeholder="Image URL"
          className="input input-bordered w-full mb-4"
        />
        <button onClick={handleAddBlog} className="btn btn-primary">Add Blog</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <motion.div 
            key={blog.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }} 
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            {editingBlog === blog.id ? (
              <>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="Title"
                  className="input input-bordered w-full mb-4"
                />
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  placeholder="Content"
                  className="textarea textarea-bordered w-full mb-4"
                />
                <input
                  type="text"
                  value={newBlog.image}
                  onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                  placeholder="Image URL"
                  className="input input-bordered w-full mb-4"
                />
                <button onClick={() => handleUpdateBlog(blog.id, newBlog)} className="btn btn-secondary">Update</button>
                <button onClick={() => setEditingBlog(null)} className="btn btn-secondary ml-2">Cancel</button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                <p className="text-gray-700 mb-2">{blog.content}</p>
                <img src={blog.image} alt={blog.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                <button onClick={() => setEditingBlog(blog.id)} className="btn btn-secondary mr-2">Edit</button>
                <button onClick={() => handleDeleteBlog(blog.id)} className="btn btn-danger">Delete</button>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageBlogs;
