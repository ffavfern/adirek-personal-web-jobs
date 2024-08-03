import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', image: '' });
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const blogsCollection = await getDocs(collection(db, 'blogs'));
    setBlogs(blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddBlog = async () => {
    await addDoc(collection(db, 'blogs'), newBlog);
    resetForm();
    fetchBlogs();
  };

  const handleUpdateBlog = async (id) => {
    await updateDoc(doc(db, 'blogs', id), newBlog);
    resetForm();
    fetchBlogs();
  };

  const handleDeleteBlog = async (id) => {
    await deleteDoc(doc(db, 'blogs', id));
    fetchBlogs();
  };

  const resetForm = () => {
    setNewBlog({ title: '', content: '', image: '' });
    setEditingBlog(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setNewBlog({ ...newBlog, image: downloadURL });
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Header />
      <AddBlogForm 
        newBlog={newBlog} 
        setNewBlog={setNewBlog} 
        handleAddBlog={handleAddBlog} 
        handleImageUpload={handleImageUpload} 
      />
      <BlogGrid 
        blogs={blogs} 
        editingBlog={editingBlog} 
        setEditingBlog={setEditingBlog} 
        setNewBlog={setNewBlog} 
        handleUpdateBlog={handleUpdateBlog} 
        handleDeleteBlog={handleDeleteBlog} 
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
};

const Header = () => (
  <>
    <h1 className="text-4xl font-bold mb-4">Manage Blogs</h1>
    <Link to="/dashboard">
      <button className="btn btn-primary mb-4">Back to Dashboard</button>
    </Link>
  </>
);

const AddBlogForm = ({ newBlog, setNewBlog, handleAddBlog, handleImageUpload }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
    <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
    <BlogFormFields 
      blog={newBlog} 
      setBlog={setNewBlog} 
      handleImageUpload={handleImageUpload} 
    />
    <button onClick={handleAddBlog} className="btn btn-primary">Add Blog</button>
  </div>
);

const BlogGrid = ({ blogs, editingBlog, setEditingBlog, setNewBlog, handleUpdateBlog, handleDeleteBlog, handleImageUpload }) => (
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
          <EditBlogForm 
            blog={blog} 
            setNewBlog={setNewBlog} 
            handleUpdateBlog={handleUpdateBlog} 
            cancelEdit={() => setEditingBlog(null)} 
            handleImageUpload={handleImageUpload}
          />
        ) : (
          <BlogCard 
            blog={blog} 
            setEditingBlog={setEditingBlog} 
            handleDeleteBlog={handleDeleteBlog} 
          />
        )}
      </motion.div>
    ))}
  </div>
);

const BlogFormFields = ({ blog, setBlog, handleImageUpload }) => (
  <>
    <input
      type="text"
      value={blog.title}
      onChange={(e) => setBlog({ ...blog, title: e.target.value })}
      placeholder="Title"
      className="input input-bordered w-full mb-4"
    />
    <textarea
      value={blog.content}
      onChange={(e) => setBlog({ ...blog, content: e.target.value })}
      placeholder="Content"
      className="textarea textarea-bordered w-full mb-4"
    />
    <input
      type="text"
      value={blog.image}
      onChange={(e) => setBlog({ ...blog, image: e.target.value })}
      placeholder="Image URL"
      className="input input-bordered w-full mb-4"
    />
    <div className="mb-4">
      <label className="block mb-2">Or upload an image</label>
      <input type="file" onChange={handleImageUpload} className="file-input file-input-bordered w-full" />
    </div>
  </>
);

const EditBlogForm = ({ blog, setNewBlog, handleUpdateBlog, cancelEdit, handleImageUpload }) => {
  useEffect(() => {
    setNewBlog({ title: blog.title, content: blog.content, image: blog.image });
  }, [blog, setNewBlog]);

  return (
    <>
      <BlogFormFields blog={blog} setBlog={setNewBlog} handleImageUpload={handleImageUpload} />
      <button onClick={() => handleUpdateBlog(blog.id)} className="btn btn-secondary">Update</button>
      <button onClick={cancelEdit} className="btn btn-secondary ml-2">Cancel</button>
    </>
  );
};

const BlogCard = ({ blog, setEditingBlog, handleDeleteBlog }) => (
  <>
    <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
    <p className="text-gray-700 mb-2">{blog.content}</p>
    <img src={blog.image} alt={blog.title} className="w-full h-32 object-cover rounded-lg mb-2" />
    <button onClick={() => setEditingBlog(blog.id)} className="btn btn-secondary mr-2">Edit</button>
    <button onClick={() => handleDeleteBlog(blog.id)} className="btn btn-danger">Delete</button>
  </>
);

export default ManageBlogs;
