import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    message: '',
  });
  const [contactDetails, setContactDetails] = useState({
    email: '',
    location: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        console.log("Fetching contact details from Firebase...");
        const docRef = doc(db, 'siteInfo', 'contactDetails');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Contact details found:", docSnap.data());
          setContactDetails(docSnap.data());
        } else {
          console.error('No such document!');
          setError('Failed to load contact details. Document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching contact details:', error.message);
        setError('Failed to load contact details.');
      }
    };

    fetchContactDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.subject || !formData.email || !formData.message) {
      return 'All fields are required.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setFormStatus(errorMessage);
      return;
    }

    setLoading(true);
    setFormStatus('');

    try {
      await addDoc(collection(db, 'contactMessages'), formData);
      setFormStatus('Message sent successfully!');
      setFormData({ name: '', subject: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error.message);
      setFormStatus('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="container mx-auto px-10 lg:px-40 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-light mb-8">Let’s collaborate</h1>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <div className="text-lg mb-6">
                <p>{contactDetails.email}</p>
              </div>
              <div className="text-sm leading-loose">
                <p>Find us</p>
                <p className="mb-6">{contactDetails.location}</p>
                <p>{contactDetails.phone}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-light mb-4">Say hello</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm uppercase tracking-wide">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-black py-2"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="subject" className="text-sm uppercase tracking-wide">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-black py-2"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm uppercase tracking-wide">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-black py-2"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-sm uppercase tracking-wide">Message</label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="border-b border-gray-400 bg-transparent focus:outline-none focus:border-black py-2 h-32"
                required
              />
            </div>

            <button
              type="submit"
              className={`text-sm uppercase tracking-wide mt-4 text-left flex items-center space-x-2 hover:text-black transition-all duration-300 ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              <span>{loading ? 'Submitting...' : 'Submit'}</span>
              {!loading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
                  />
                </svg>
              )}
            </button>
          </form>
          {formStatus && <p className={`mt-4 ${formStatus.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{formStatus}</p>}
        </div>
      </div>
    </section>
  );
};

export default Contact;
