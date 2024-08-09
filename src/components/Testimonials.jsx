import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar } from 'react-icons/fa';

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
    <section id="testimonials" className="bg-secondary py-60  sm:py-20 lg:py-28 xl:py-36 ">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 sm:mb-8 lg:mb-12 text-gold uppercase tracking-widest text-center">
          What Our Clients Say!
        </h2>
        <div className="flex justify-center mb-6 sm:mb-10 lg:mb-12">
          <hr className="w-10 sm:w-12 lg:w-16 xl:w-20 border-b-4 border-red-500 my-10" />
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
         
         
          breakpoints={{
            480: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 1.5,
              spaceBetween: 25,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 35,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="flex justify-center">
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-lg shadow-xl flex flex-col items-center  text-center p-6 sm:p-8 md:p-10 w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto">
    {testimonial.profileImageUrl ? (
      <ProfileImage src={testimonial.profileImageUrl} alt={testimonial.name} />
    ) : (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-4 border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image</span>
      </div>
    )}
    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">{testimonial.name}</h3>
    {testimonial.position && (
      <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-4">{testimonial.position}</p>
    )}
    <div className="flex mb-4 justify-center">
      {Array.from({ length: 5 }).map((_, index) => (
        index < testimonial.rating ? 
          <FaStar key={index} className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> : 
          <FaRegStar key={index} className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
      ))}
    </div>
    <p className="text-sm sm:text-base md:text-lg text-gray-700">"{testimonial.feedback}"</p>
  </div>
);

const ProfileImage = ({ src, alt }) => (
  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 border-2 border-gray-300">
    <img 
      src={src} 
      alt={alt} 
      className="object-cover w-full h-full"
    />
  </div>
);

export default Testimonials;
