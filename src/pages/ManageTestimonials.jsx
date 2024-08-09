import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', feedback: '', rating: 0, profileImageUrl: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
      const testimonialsData = testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTestimonials(testimonialsData);
      setFilteredTestimonials(testimonialsData);
    };
    fetchTestimonials();
  }, []);

  const handleAddOrUpdateTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = newTestimonial.profileImageUrl;
    if (profileImage) {
      const imageRef = ref(storage, `profileImages/${profileImage.name}`);
      await uploadBytes(imageRef, profileImage);
      imageUrl = await getDownloadURL(imageRef);
    }

    const testimonialData = { ...newTestimonial, profileImageUrl: imageUrl };

    if (editingId) {
      await updateDoc(doc(db, 'testimonials', editingId), testimonialData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'testimonials'), testimonialData);
    }

    setLoading(false);
    handleResetForm();
    const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
    const testimonialsData = testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTestimonials(testimonialsData);
    setFilteredTestimonials(testimonialsData);
  };

  const handleEditTestimonial = (testimonial) => {
    setNewTestimonial({
      name: testimonial.name,
      feedback: testimonial.feedback,
      rating: testimonial.rating,
      profileImageUrl: testimonial.profileImageUrl || ''
    });
    setEditingId(testimonial.id);
    setImagePreview(testimonial.profileImageUrl || null);
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
      setFilteredTestimonials(filteredTestimonials.filter((testimonial) => testimonial.id !== id));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = testimonials.filter((testimonial) =>
      testimonial.name.toLowerCase().includes(value) || testimonial.feedback.toLowerCase().includes(value)
    );
    setFilteredTestimonials(filtered);
  };

  const handleResetForm = () => {
    setNewTestimonial({ name: '', feedback: '', rating: 0, profileImageUrl: '' });
    setProfileImage(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleRatingChange = (rating) => {
    setNewTestimonial({ ...newTestimonial, rating });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Manage Testimonials</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-6">Back to Dashboard</button>
      </Link>
      
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search testimonials..."
        className="input input-bordered w-full mb-4"
      />

      <form onSubmit={handleAddOrUpdateTestimonial} className="mb-4 space-y-4">
        <input
          type="text"
          value={newTestimonial.name}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
          placeholder="Name"
          className="input input-bordered w-full"
          required
        />
        <textarea
          value={newTestimonial.feedback}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, feedback: e.target.value })}
          placeholder="Feedback"
          className="textarea textarea-bordered w-full"
          required
        />
        <div className="flex items-center space-x-2">
          <span className="mr-2">Rating:</span>
          <StarRating rating={newTestimonial.rating} onRatingChange={handleRatingChange} />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="input input-bordered w-full"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-20 w-20 object-cover rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <button type="submit" className="btn btn-primary w-full sm:w-1/2" disabled={loading}>
            {loading ? 'Submitting...' : editingId ? 'Update Testimonial' : 'Add Testimonial'}
          </button>
          <button type="button" onClick={handleResetForm} className="btn btn-secondary w-full sm:w-1/2">
            Reset Form
          </button>
        </div>
      </form>
      
      {filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTestimonials.map((testimonial) => (
            <ContentCard
              key={testimonial.id}
              {...testimonial}
              onDelete={() => handleDeleteTestimonial(testimonial.id)}
              onUpdate={() => handleEditTestimonial(testimonial)}
              profileImageUrl={testimonial.profileImageUrl || ''} // Ensure empty string if no profile image
            />
          ))}
        </div>
      ) : (
        <p>No testimonials found.</p>
      )}
    </div>
  );
};

// StarRating component for selecting ratings
const StarRating = ({ rating, onRatingChange }) => {
  const handleClick = (newRating) => {
    onRatingChange(newRating);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleClick(star)}
          xmlns="http://www.w3.org/2000/svg"
          fill={star <= rating ? "gold" : "none"}
          stroke="gold"
          strokeWidth="2"
          className="w-6 h-6 cursor-pointer"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.716 5.29a1 1 0 00.95.69h5.564c.969 0 1.371 1.24.588 1.81l-4.498 3.256a1 1 0 00-.364 1.118l1.716 5.29c.3.922-.755 1.688-1.54 1.118L12 17.77l-4.497 3.256c-.784.57-1.84-.196-1.54-1.118l1.716-5.29a1 1 0 00-.364-1.118L2.818 10.72c-.784-.57-.38-1.81.588-1.81h5.564a1 1 0 00.95-.69l1.716-5.29z"
          />
        </svg>
      ))}
    </div>
  );
};

export default ManageTestimonials;
