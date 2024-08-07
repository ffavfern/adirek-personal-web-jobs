import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogDetail = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null); // State to hold the blog data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        if (blogDoc.exists()) {
          setBlog({ id: blogDoc.id, ...blogDoc.data() });
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Error fetching blog details');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      {blog && (
        <>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 uppercase text-center sm:text-left">
            {blog.title}
          </h1>
          <div className="w-full max-w-4xl mx-auto mb-6">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto max-h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed">
            {blog.content}
          </p>
        </>
      )}
      <div className="mt-10 text-center">
        <button
          onClick={() => window.history.back()}
          className="bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-error transition"
        >
          Back to Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
