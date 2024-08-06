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
    <div className="container mx-auto py-20">
      {blog && (
        <>
          <h1 className="text-4xl font-bold mb-6 uppercase">{blog.title}</h1>
          <div
            className="w-full h-64 mb-6 rounded-lg shadow-lg"
            style={{
              backgroundImage: `url(${blog.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <p className="text-lg text-gray-700 mb-8">{blog.content}</p>
        </>
      )}
      <div className="mt-10">
        <button
          onClick={() => window.history.back()}
          className="btn btn-primary"
        >
          Back to Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
