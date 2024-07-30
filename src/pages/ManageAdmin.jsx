import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsCollection = await getDocs(collection(db, 'admins'));
      setAdmins(adminsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (editingId) {
      const adminDoc = doc(db, 'admins', editingId);
      await updateDoc(adminDoc, newAdmin);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'admins'), newAdmin);
    }
    setNewAdmin({ email: '' });
    const adminsCollection = await getDocs(collection(db, 'admins'));
    setAdmins(adminsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditAdmin = (admin) => {
    setNewAdmin({ email: admin.email });
    setEditingId(admin.id);
  };

  const handleDeleteAdmin = async (id) => {
    await deleteDoc(doc(db, 'admins', id));
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8">Manage Admin</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-4">Back to Dashboard</button>
      </Link>
      <form onSubmit={handleAddAdmin} className="mb-4">
        <input
          type="email"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          placeholder="Email"
          className="input input-bordered w-full mb-2"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          {editingId ? 'Update Admin' : 'Add Admin'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map((admin) => (
          <ContentCard
            key={admin.id}
            {...admin}
            onDelete={handleDeleteAdmin}
            onUpdate={() => handleEditAdmin(admin)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageAdmin;
