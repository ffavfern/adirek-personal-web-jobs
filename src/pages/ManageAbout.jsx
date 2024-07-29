
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageAbout = () => {
  const [about, setAbout] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchAbout = async () => {
      const aboutCollection = await getDocs(collection(db, 'about'));
      setAbout(aboutCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'about'), form);
    setForm({ title: '', content: '' });
  };

  const handleUpdate = async (id) => {
    const aboutDoc = doc(db, 'about', id);
    await updateDoc(aboutDoc, form);
    setForm({ title: '', content: '' });
  };

  const handleDelete = async (id) => {
    const aboutDoc = doc(db, 'about', id);
    await deleteDoc(aboutDoc);
  };

  return (
    <div className="dashboard-container">
      <h1>Manage About</h1>
      <div>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content"></textarea>
        <button onClick={handleAdd}>Add About</button>
      </div>
      <ul>
        {about.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <button onClick={() => handleUpdate(item.id)}>Update</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAbout;
