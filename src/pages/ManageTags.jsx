import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageTags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      const tagsCollection = await getDocs(collection(db, 'tags'));
      setTags(tagsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchTags();
  }, []);

  const handleAddTag = async () => {
    try {
      await addDoc(collection(db, 'tags'), { name: newTag });
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag: ', error);
    }
  };

  const handleUpdateTag = async (id, name) => {
    try {
      await updateDoc(doc(db, 'tags', id), { name });
      setEditingTag(null);
    } catch (error) {
      console.error('Error updating tag: ', error);
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await deleteDoc(doc(db, 'tags', id));
    } catch (error) {
      console.error('Error deleting tag: ', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-primary">Manage Tags</h2>
          <div className="form-control mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
              className="input input-bordered w-full"
            />
            <button onClick={handleAddTag} className="btn btn-primary mt-2">Add Tag</button>
          </div>
          <ul className="list-disc list-inside">
            {tags.map((tag) => (
              <li key={tag.id} className="flex justify-between items-center">
                {editingTag === tag.id ? (
                  <>
                    <input
                      type="text"
                      value={tag.name}
                      onChange={(e) => handleUpdateTag(tag.id, e.target.value)}
                      className="input input-bordered w-full mr-2"
                    />
                    <button onClick={() => setEditingTag(null)} className="btn btn-secondary">Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{tag.name}</span>
                    <div>
                      <button onClick={() => setEditingTag(tag.id)} className="btn btn-secondary mr-2">Edit</button>
                      <button onClick={() => handleDeleteTag(tag.id)} className="btn btn-error">Delete</button>
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

export default ManageTags;
