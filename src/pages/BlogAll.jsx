import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilter, FaRegFileAlt } from 'react-icons/fa';

const BlogAll = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  // Use useNavigate hook
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = await getDocs(collection(db, 'blogs'));
        const blogData = blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogData);
        setFilteredBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError('Failed to load blogs. Please try again later.');
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let updatedBlogs = [...blogs];

    // Filter by category
    if (filterCategory) {
      updatedBlogs = updatedBlogs.filter(blog => blog.category === filterCategory);
    }

    // Search by title or content
    if (searchTerm) {
      updatedBlogs = updatedBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(updatedBlogs);
  }, [filterCategory, searchTerm, blogs]);

  const clearFilters = () => {
    setFilterCategory('');
    setSearchTerm('');
    setFilteredBlogs(blogs);
  };

  if (error) {
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  }

  return (
    <motion.div 
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-row justify-between items-center">
        <motion.h1
          className="text-4xl font-bold my-20 uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          All Blogs
        </motion.h1>
        {/* Back Button */}
        <button className="btn btn-primary mb-4 hover:scale-110" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>

      {/* Search, Filter, and Clear Options */}
      <motion.div 
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-xl font-bold mb-2">Search Blogs:</label>
          <input 
            type="text"
            id="search"
            className="input input-bordered w-full"
            placeholder="Search by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by Category */}
        <div>
          <label htmlFor="filter" className="block text-xl font-bold mb-2 flex items-center"><FaFilter className="mr-2" /> Filter by Category:</label>
          <select 
            id="filter" 
            className="input input-bordered w-full"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Design">Design</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button 
            className="btn btn-secondary w-full"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <motion.div 
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/blog/${blog.id}`}>
                  <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden group">
                    {blog.image && (
                      <motion.img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-64 object-cover transition-transform transform group-hover:scale-105"
                        layoutId={`blog-image-${blog.id}`}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity">
                      <h3 className="text-3xl font-semibold mb-4 text-white uppercase">{blog.title}</h3>
                      <p className="text-lg text-gray-400">{blog.excerpt || blog.content.slice(0, 100) + '...'}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No blogs found.</p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BlogAll;
