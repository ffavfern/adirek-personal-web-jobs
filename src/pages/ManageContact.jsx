
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageContact = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ email: '', message: '' });

  useEffect(() => {
    const fetchContacts = async () => {
      const contactsCollection = await getDocs(collection(db, 'contacts'));
      setContacts(contactsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'contacts'), form);
    setForm({ email: '', message: '' });
  };

  const handleUpdate = async (id) => {
    const contactDoc = doc(db, 'contacts', id);
    await updateDoc(contactDoc, form);
    setForm({ email: '', message: '' });
  };

  const handleDelete = async (id) => {
    const contactDoc = doc(db, 'contacts', id);
    await deleteDoc(contactDoc);
  };

  return (
    <div className="dashboard-container">
      <h1>Manage Contacts</h1>
      <div>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message"></textarea>
        <button onClick={handleAdd}>Add Contact</button>
      </div>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <h3>{contact.email}</h3>
            <p>{contact.message}</p>
            <button onClick={() => handleUpdate(contact.id)}>Update</button>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageContact;
