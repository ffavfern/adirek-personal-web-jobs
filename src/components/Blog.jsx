import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const fetchBlogs = async () => {
  const blogsCollection = await getDocs(collection(db, "blogs"));
  return blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const Blog = () => {
  const {
    data: blogs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} onRetry={refetch} />;

  return (
    <section id="blog" className="text-secondary py-20 mx-20 text-center">
      <div className="container mx-auto text-start">
        {blogs.length > 0 ? (
          <BlogGrid blogs={blogs} />
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-700">No blogs available</p>
            <Link to="/create-blog" className="mt-4 btn btn-primary">
              Create New Blog
            </Link>
          </div>
        )}
      </div>
      <Link to="/blogs">
        <div className="btn mt-10  text-primary hover:bg-error hover:text-white hover:scale-110 text-lg sm:text-xl uppercase">
          More Blogs
        </div>
      </Link>
    </section>
  );
};

const Loading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingSpinner />
    <p className="ml-2 text-lg text-gray-600">Loading blogs...</p>
  </div>
);

const Error = ({ message, onRetry }) => (
  <div className="flex flex-col items-center text-red-500">
    <div className="text-lg font-semibold">Error: {message}</div>
    <button
      className="mt-4 btn btn-error text-white"
      onClick={onRetry}
    >
      Retry
    </button>
  </div>
);

const BlogGrid = ({ blogs }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
    {blogs.map((blog) => (
      <BlogCard key={blog.id} blog={blog} />
    ))}
  </div>
);

const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blogs/${blog.id}`} className="block">
      <div
        className=" relative p-4  rounded-lg shadow-lg blog-post overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          minHeight: "250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: `url(${blog.images})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
      
        }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-300 ease-in-out bg-black bg-opacity-50 hover:bg-opacity-75"
          style={{ zIndex: -1 }}
        ></div>

        <div className="relative z-10 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase">
            {blog.title}
          </h3>
        </div>
        <div className="mt-4 flex justify-center relative z-10">
          <span
            className="flex items-center justify-center px-4 py-2 bg-white rounded-full text-primary font-semibold"
          >
            See More
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Blog;
