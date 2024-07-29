import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = await getDocs(collection(db, 'categories'));
      setCategories(categoriesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      await addDoc(collection(db, 'categories'), { name: newCategory });
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  const handleUpdateCategory = async (id, name) => {
    try {
      await updateDoc(doc(db, 'categories', id), { name });
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category: ', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error deleting category: ', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-primary">Manage Categories</h2>
          <div className="form-control mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
              className="input input-bordered w-full"
            />
            <button onClick={handleAddCategory} className="btn btn-primary mt-2">Add Category</button>
          </div>
          <ul className="list-disc list-inside">
            {categories.map((category) => (
              <li key={category.id} className="flex justify-between items-center">
                {editingCategory === category.id ? (
                  <>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleUpdateCategory(category.id, e.target.value)}
                      className="input input-bordered w-full mr-2"
                    />
                    <button onClick={() => setEditingCategory(null)} className="btn btn-secondary">Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{category.name}</span>
                    <div>
                      <button onClick={() => setEditingCategory(category.id)} className="btn btn-secondary mr-2">Edit</button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-error">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
