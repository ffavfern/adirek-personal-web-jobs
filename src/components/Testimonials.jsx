import  { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { gsap } from 'gsap';



function Testimonials() {

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
      setTestimonials(testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    gsap.from('.testimonial-slide', { opacity: 0, y: 50, duration: 1, stagger: 0.3 });
  }, [testimonials]);

  return (
    <>
    <section id="testimonials" className="bg-secondary text-primary py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Testimonials</h2>
        <Swiper spaceBetween={50} slidesPerView={1}>
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="testimonial-slide">
              <div className="p-4 bg-primary rounded-lg">
                <h3 className="text-2xl font-bold">{testimonial.name}</h3>
                <p className="mt-2">{testimonial.feedback}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
    </>
  );
}

export default Testimonials;
