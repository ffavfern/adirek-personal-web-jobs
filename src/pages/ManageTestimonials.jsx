// src/pages/ManageTestimonials.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: '', feedback: '' });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = await getDocs(collection(db, 'testimonials'));
      setTestimonials(testimonialsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'testimonials'), form);
    setForm({ name: '', feedback: '' });
  };

  const handleUpdate = async (id) => {
    const testimonialDoc = doc(db, 'testimonials', id);
    await updateDoc(testimonialDoc, form);
    setForm({ name: '', feedback: '' });
  };

  const handleDelete = async (id) => {
    const testimonialDoc = doc(db, 'testimonials', id);
    await deleteDoc(testimonialDoc);
  };

  return (
    <div className="dashboard-container">
      <h1>Manage Testimonials</h1>
      <div>
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <textarea name="feedback" value={form.feedback} onChange={handleChange} placeholder="Feedback"></textarea>
        <button onClick={handleAdd}>Add Testimonial</button>
      </div>
      <ul>
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <h3>{testimonial.name}</h3>
            <p>{testimonial.feedback}</p>
            <button onClick={() => handleUpdate(testimonial.id)}>Update</button>
            <button onClick={() => handleDelete(testimonial.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTestimonials;
