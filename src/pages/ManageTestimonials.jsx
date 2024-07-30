import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    feedback: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
      setTestimonials(testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTestimonials();
  }, []);

  const handleAddOrUpdateTestimonial = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, 'testimonials', editingId), newTestimonial);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'testimonials'), newTestimonial);
    }
    setNewTestimonial({ name: '', feedback: '' });
    const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
    setTestimonials(testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditTestimonial = (testimonial) => {
    setNewTestimonial({ name: testimonial.name, feedback: testimonial.feedback });
    setEditingId(testimonial.id);
  };

  const handleDeleteTestimonial = async (id) => {
    await deleteDoc(doc(db, 'testimonials', id));
    setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8">Manage Testimonials</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-4">Back to Dashboard</button>
      </Link>
      <form onSubmit={handleAddOrUpdateTestimonial} className="mb-4">
        <input
          type="text"
          value={newTestimonial.name}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
          placeholder="Name"
          className="input input-bordered w-full mb-2"
          required
        />
        <textarea
          value={newTestimonial.feedback}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, feedback: e.target.value })}
          placeholder="Feedback"
          className="textarea textarea-bordered w-full mb-2"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          {editingId ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <ContentCard
            key={testimonial.id}
            {...testimonial}
            onDelete={() => handleDeleteTestimonial(testimonial.id)}
            onUpdate={() => handleEditTestimonial(testimonial)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageTestimonials;
