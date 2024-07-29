import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, 'users'));
      setUsers(usersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Manage Users</h1>
          <Link to="/addUser" className="btn btn-primary">Add New User</Link>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4">
        <h2 className="text-2xl mb-4">User List</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to={`/editUser/${user.id}`} className="btn btn-secondary mr-2">
                      Edit
                    </Link>
                    <button className="btn btn-error" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;
