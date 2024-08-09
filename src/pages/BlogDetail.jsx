import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiArrowLeft } from "react-icons/fi";

const BlogDetail = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null); // State to hold the blog data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages

  // Fetch the blog details when the component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = await getDoc(doc(db, "blogs", id));
        if (blogDoc.exists()) {
          setBlog({ id: blogDoc.id, ...blogDoc.data() });
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        setError("Error fetching blog details");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <LoadingSpinner />; // Show loading spinner while data is being fetched

  if (error) {
    return <div className="text-red-500 text-center mt-20">{error}</div>; // Show error message if any
  }

  return (
    <div className="container  px-4 sm:px-6 lg:px-8 py-10 sm:py-20 mx-auto lg:mx-20 ">
      {blog && (
        <>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 sm:mb-10 lg:mb-12 uppercase text-center sm:text-left animate-fade-in">
            {blog.title}
          </h1>
          <div className="w-full max-w-4xl mx-auto mb-8 lg:mb-10">
            <img
              src={blog.images}
              alt={`Cover image for ${blog.title}`}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-2xl transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </div>
          <div className="prose prose-lg sm:prose-xl max-w-none text-gray-700 mb-10 lg:mb-12 leading-relaxed animate-fade-in">
            {/* Ensure iframe styling and responsiveness */}
            <div
              dangerouslySetInnerHTML={{
                __html: blog.content.replace(
                  /<iframe/g,
                  '<iframe class="w-full aspect-video mb-6 rounded-lg shadow-md" allowfullscreen sandbox="allow-scripts allow-same-origin allow-presentation"'
                ),
              }}
            />
          </div>
        </>
      )}
      <div className="mt-12 text-center">
        <button
          onClick={() => window.history.back()}
          className="bg-primary text-white font-semibold py-2 px-6 rounded-full shadow-lg flex items-center justify-center space-x-2 hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Blogs</span>
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
