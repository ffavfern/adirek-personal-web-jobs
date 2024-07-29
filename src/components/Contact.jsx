import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });

  useEffect(() => {
    gsap.from('.contact-section', { opacity: 0, y: 50, duration: 1 });
    gsap.from('.contact-socials button', { opacity: 0, scale: 0.5, duration: 0.5, stagger: 0.2 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="contact-section text-center pt-20">
      <h1 className="uppercase font-bold text-4xl">get in touch</h1>
      <div className="flex flex-row justify-between py-20 items-center">
        <div className="flex w-1/2 flex-col text-start leading-10">
          <h3 className="uppercase">email</h3>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <h3 className="uppercase">message</h3>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            className="textarea textarea-bordered w-full h-36"
            required
          />
          <button
            onClick={handleSubmit}
            className="btn btn-primary mt-4"
          >
            Send
          </button>
        </div>
        {/* Socials */}
        <div className="flex w-1/2 text-center justify-between px-32 contact-socials">
          <button
            onClick={() => (window.location.href = 'https://www.facebook.com/yourprofile')}
            className="btn btn-outline"
          >
            <FaFacebook className="text-4xl hover:text-error" />
          </button>
          <button
            onClick={() => (window.location.href = 'https://www.linkedin.com/in/yourprofile')}
            className="btn btn-outline"
          >
            <FaLinkedin className="text-4xl hover:text-error" />
          </button>
          <button
            onClick={() => (window.location.href = 'mailto:your.email@example.com')}
            className="btn btn-outline"
          >
            <SiGmail className="text-4xl hover:text-error" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
