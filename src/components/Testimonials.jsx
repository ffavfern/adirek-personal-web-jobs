import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
      setTestimonials(testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="bg-secondary text-primary py-20">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="container mx-auto text-center"
      >
        <h2 className="text-4xl font-bold">Testimonials</h2>
        <Swiper spaceBetween={50} slidesPerView={1}>
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="p-4 bg-primary rounded-lg">
                <h3 className="text-2xl font-bold">{testimonial.name}</h3>
                <p className="mt-2">{testimonial.feedback}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default Testimonials;
