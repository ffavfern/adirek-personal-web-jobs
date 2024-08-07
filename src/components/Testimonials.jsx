import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Import star icons
import './Testimonials.css';

const fetchTestimonials = async () => {
  const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
  return testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTestimonials();
      setTestimonials(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading testimonials...</div>;
  }

  return (
    <section id="testimonials" className="bg-secondary py-40">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <h2 className="text-5xl font-bold mb-14 text-gold uppercase tracking-widest text-center mb-8">
          What our Clients say!
        </h2>
        <div className="flex justify-center mb-20">
          <hr className="w-24 border-b-4 border-red-500 mb-10" />
        </div>
        <TestimonialsSwiper testimonials={testimonials} />
      </motion.div>
    </section>
  );
};

const TestimonialsSwiper = ({ testimonials }) => (
  <Swiper
    spaceBetween={50}
    slidesPerView={3}
    pagination={{ clickable: true }}
    modules={[Pagination]}
    className="pb-10 justify-center"
    breakpoints={{
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    }}
  >
    {testimonials.map((testimonial) => (
      <SwiperSlide key={testimonial.id}>
        <TestimonialCard testimonial={testimonial} />
      </SwiperSlide>
    ))}
  </Swiper>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center mx-4">
    {testimonial.profileImageUrl ? (
      <ProfileImage src={testimonial.profileImageUrl} alt={testimonial.name} />
    ) : (
      <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image</span>
      </div>
    )}
    <h3 className="text-xl font-semibold mb-2">{testimonial.name}</h3>
    {testimonial.position && <p className="text-sm text-gray-500 mb-4">{testimonial.position}</p>}
    <div className="flex mb-4">
      {Array.from({ length: 5 }).map((_, index) => (
        index < testimonial.rating ? 
          <FaStar key={index} className="text-yellow-500 w-5 h-5" /> : 
          <FaRegStar key={index} className="text-yellow-500 w-5 h-5" />
      ))}
    </div>
    <p className="mb-6 text-base text-gray-700">"{testimonial.feedback}"</p>
  </div>
);

const ProfileImage = ({ src, alt }) => (
  <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-gray-300">
    <img 
      src={src} 
      alt={alt} 
      className="object-cover w-full h-full"
    />
  </div>
);

export default Testimonials;
