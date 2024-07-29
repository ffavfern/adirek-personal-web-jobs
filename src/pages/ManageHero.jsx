import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageHero = () => {
  const [heroContent, setHeroContent] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '' });

  useEffect(() => {
    const fetchHeroContent = async () => {
      const heroCollection = await getDocs(collection(db, 'hero'));
      setHeroContent(heroCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchHeroContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'hero'), form);
    setForm({ title: '', description: '', image: '' });
  };

  const handleUpdate = async (id) => {
    const heroDoc = doc(db, 'hero', id);
    await updateDoc(heroDoc, form);
    setForm({ title: '', description: '', image: '' });
  };

  const handleDelete = async (id) => {
    const heroDoc = doc(db, 'hero', id);
    await deleteDoc(heroDoc);
  };

  return (
    <div className="dashboard-container">
      <h1>Manage Hero Content</h1>
      <div>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description"></textarea>
        <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
        <button onClick={handleAdd}>Add Hero Content</button>
      </div>
      <ul>
        {heroContent.map((content) => (
          <li key={content.id}>
            <h3>{content.title}</h3>
            <p>{content.description}</p>
            <img src={content.image} alt={content.title} />
            <button onClick={() => handleUpdate(content.id)}>Update</button>
            <button onClick={() => handleDelete(content.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageHero;
