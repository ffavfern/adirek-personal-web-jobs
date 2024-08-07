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
    <section id="testimonials" className="bg-secondary py-16 sm:py-32 lg:py-40">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-12 lg:mb-16 text-gold uppercase tracking-widest text-center">
          What our Clients say!
        </h2>
        <div className="flex justify-center mb-8 sm:mb-16">
          <hr className="w-12 sm:w-20 lg:w-24 border-b-4 border-red-500" />
        </div>
        <TestimonialsSwiper testimonials={testimonials} />
      </motion.div>
    </section>
  );
};

const TestimonialsSwiper = ({ testimonials }) => (
  <Swiper
    spaceBetween={10} // Set smaller space between slides for mobile devices
    slidesPerView={1} // Start with 1 slide per view
    pagination={{ clickable: true }}
    modules={[Pagination]}
    className="pb-10"
    breakpoints={{
      480: {
        slidesPerView: 1, // 1 slide per view on screens >= 480px
        spaceBetween: 15, // Slightly increased space between slides
      },
      640: {
        slidesPerView: 2, // 2 slides per view on screens >= 640px
        spaceBetween: 20, // Increased space between slides
      },
      768: {
        slidesPerView: 2, // 2 slides per view on screens >= 768px
        spaceBetween: 25, // Increased space between slides
      },
      1024: {
        slidesPerView: 3, // 3 slides per view on screens >= 1024px
        spaceBetween: 30, // Increased space between slides
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
  <div className="bg-white rounded-lg shadow-lg flex flex-col items-center text-center p-4 sm:p-6 md:p-8 mx-auto max-w-xs w-full">
    {testimonial.profileImageUrl ? (
      <ProfileImage src={testimonial.profileImageUrl} alt={testimonial.name} />
    ) : (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-4 border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image</span>
      </div>
    )}
    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">{testimonial.name}</h3>
    {testimonial.position && (
      <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-4">{testimonial.position}</p>
    )}
    <div className="flex mb-4 justify-center">
      {Array.from({ length: 5 }).map((_, index) => (
        index < testimonial.rating ? 
          <FaStar key={index} className="text-yellow-500 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" /> : 
          <FaRegStar key={index} className="text-yellow-500 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
      ))}
    </div>
    <p className="mb-6 text-sm sm:text-base md:text-lg text-gray-700">"{testimonial.feedback}"</p>
  </div>
);

const ProfileImage = ({ src, alt }) => (
  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-300">
    <img 
      src={src} 
      alt={alt} 
      className="object-cover w-full h-full"
    />
  </div>
);

export default Testimonials;
