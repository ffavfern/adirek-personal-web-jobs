import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { gsap } from 'gsap';

const fetchPosts = async () => {
  const postsCollection = await getDocs(collection(db, 'posts'));
  return postsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

function Blog() {
  const { data: posts = [], isLoading } = useQuery(['posts'], fetchPosts);

  React.useEffect(() => {
    if (!isLoading) {
      gsap.from('.swiper-slide', { opacity: 0, y: 50, duration: 1, stagger: 0.3 });
    }
  }, [posts, isLoading]);

  return (
    <section id="blog" className="bg-primary text-secondary py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Blog</h2>
        <Swiper spaceBetween={50} slidesPerView={1}>
          {posts.map((post) => (
            <SwiperSlide key={post.id} className="p-4 bg-secondary rounded-lg shadow-lg blog-post">
              <h3 className="text-2xl font-bold">{post.title}</h3>
              <p className="mt-2">{post.content}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Blog;
