import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { gsap } from 'gsap';

const fetchPosts = async () => {
  const postsCollection = await getDocs(collection(db, 'posts'));
  return postsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  useEffect(() => {
    if (posts) {
      gsap.from('.blog-post', { opacity: 0, x: -50, duration: 1, stagger: 0.3 });
    }
  }, [posts]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section id="blog" className="bg-primary text-secondary py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-secondary rounded-lg shadow-lg blog-post">
              <h3 className="text-2xl font-bold">{post.title}</h3>
              <p className="mt-2">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
