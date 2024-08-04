import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

// Fetch blogs from Firebase
const fetchBlogs = async () => {
  const blogsCollection = await getDocs(collection(db, 'blogs'));
  return blogsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const Blog = () => {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  useEffect(() => {
    if (blogs) {
      gsapAnimation();
    }
  }, [blogs]);

  const gsapAnimation = () => {
    gsap.from('.blog-post', { opacity: 0, x: -50, duration: 1, stagger: 0.3 });
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <section id="blog" className="text-secondary py-20">
      <div className="container mx-auto text-start">
         <BlogGrid blogs={blogs} />
      </div>
    </section>
  );
};

const Loading = () => <LoadingSpinner />

const Error = ({ message }) => <div>Error: {message}</div>;

const BlogGrid = ({ blogs }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
    {blogs.map((blog) => (
      <BlogCard key={blog.id} blog={blog} />
    ))}
  </div>
);

const BlogCard = ({ blog }) => (
  <Link to={`/blog/${blog.id}`} className="block">
    <div
      className="relative p-4 rounded-lg shadow-lg blog-post overflow-hidden"
      style={{
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: `url(${blog.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.3s ease',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }}
      ></div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white">{blog.title}</h3>
        <p className="mt-2 text-white">{blog.content}</p>
      </div>
      <div className="mt-4 flex justify-end relative z-10">
        <span
          className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-primary"
          style={{ color: '#000' }}
        >
          →
        </span>
      </div>
    </div>
  </Link>
);

export default Blog;
