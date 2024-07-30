import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';

const ManageContact = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    email: '',
    message: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const contactsCollection = await getDocs(collection(db, 'contact'));
      setContacts(contactsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchContacts();
  }, []);

  const handleAddOrUpdateContact = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, 'contact', editingId), newContact);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'contact'), newContact);
    }
    setNewContact({ email: '', message: '' });
    const contactsCollection = await getDocs(collection(db, 'contact'));
    setContacts(contactsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditContact = (contact) => {
    setNewContact({ email: contact.email, message: contact.message });
    setEditingId(contact.id);
  };

  const handleDeleteContact = async (id) => {
    await deleteDoc(doc(db, 'contact', id));
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8">Manage Contact</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-4">Back to Dashboard</button>
      </Link>
      <form onSubmit={handleAddOrUpdateContact} className="mb-4">
        <input
          type="email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          placeholder="Email"
          className="input input-bordered w-full mb-2"
          required
        />
        <textarea
          value={newContact.message}
          onChange={(e) => setNewContact({ ...newContact, message: e.target.value })}
          placeholder="Message"
          className="textarea textarea-bordered w-full mb-2"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          {editingId ? 'Update Contact' : 'Add Contact'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <ContentCard
            key={contact.id}
            {...contact}
            onDelete={() => handleDeleteContact(contact.id)}
            onUpdate={() => handleEditContact(contact)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageContact;
