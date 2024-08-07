import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ManageContact = () => {
  const [contactDetails, setContactDetails] = useState({
    email: '',
    location: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const docRef = doc(db, 'siteInfo', 'contactDetails');

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      console.log("Fetching contact details from Firebase...");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Contact details found:", docSnap.data());
        setContactDetails(docSnap.data());
      } else {
        console.log('No such document! Creating one...');
        await setDoc(docRef, { email: '', location: '', phone: '' }); // Creates the document with default values
        setContactDetails({ email: '', location: '', phone: '' });
      }
    } catch (err) {
      setError('Failed to fetch contact details.');
      console.error('Error fetching contact details:', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateDoc(docRef, contactDetails);
      console.log('Contact details updated:', contactDetails);
      alert('Contact details updated successfully!');
    } catch (err) {
      setError('Failed to update contact details.');
      console.error('Error updating contact details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Manage Contact Details</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-6">Back to Dashboard</button>
      </Link>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSaveDetails} className="space-y-6">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm sm:text-base">Email:</label>
          <input
            type="email"
            name="email"
            value={contactDetails.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block mb-2 text-sm sm:text-base">Location:</label>
          <input
            type="text"
            name="location"
            value={contactDetails.location}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2 text-sm sm:text-base">Phone:</label>
          <input
            type="text"
            name="phone"
            value={contactDetails.phone}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className={`btn btn-primary w-full py-2 sm:py-3 ${loading ? 'opacity-50' : ''}`} disabled={loading}>
          {loading ? 'Saving...' : 'Save Details'}
        </button>
      </form>
    </div>
  );
};

export default ManageContact;
