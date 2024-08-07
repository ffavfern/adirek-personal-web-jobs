import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';

const ManageEducation = () => {
  const [educations, setEducations] = useState([]);
  const [newEducation, setNewEducation] = useState({
    title: '',
    year: '',
    description: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchEducations = async () => {
      const educationsCollection = await getDocs(collection(db, 'education'));
      setEducations(educationsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchEducations();
  }, []);

  const handleAddOrUpdateEducation = async (e) => {
    e.preventDefault();
    let imageUrl = newEducation.imageUrl;

    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    if (editingId) {
      const educationDoc = doc(db, 'education', editingId);
      await updateDoc(educationDoc, { ...newEducation, imageUrl });
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'education'), { ...newEducation, imageUrl });
    }

    setNewEducation({ title: '', year: '', description: '', imageUrl: '' });
    setImageFile(null);
    const educationsCollection = await getDocs(collection(db, 'education'));
    setEducations(educationsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditEducation = (education) => {
    setNewEducation({
      title: education.title,
      year: education.year,
      description: education.description,
      imageUrl: education.imageUrl
    });
    setEditingId(education.id);
  };

  const handleDeleteEducation = async (id) => {
    await deleteDoc(doc(db, 'education', id));
    setEducations(educations.filter((education) => education.id !== id));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Manage Education</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-6">Back to Dashboard</button>
      </Link>
      <form onSubmit={handleAddOrUpdateEducation} className="space-y-4 mb-8">
        <input
          type="text"
          value={newEducation.title}
          onChange={(e) => setNewEducation({ ...newEducation, title: e.target.value })}
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          value={newEducation.year}
          onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
          placeholder="Year"
          className="input input-bordered w-full"
          required
        />
        <textarea
          value={newEducation.description}
          onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          required
        />
        <input
          type="text"
          value={newEducation.imageUrl}
          onChange={(e) => setNewEducation({ ...newEducation, imageUrl: e.target.value })}
          placeholder="Image URL or upload file below"
          className="input input-bordered w-full"
        />
        <input type="file" className="file-input w-full" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit" className="btn btn-primary w-full">
          {editingId ? 'Update Education' : 'Add Education'}
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {educations.map((education) => (
          <ContentCard
            key={education.id}
            {...education}
            onDelete={() => handleDeleteEducation(education.id)}
            onUpdate={() => handleEditEducation(education)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageEducation;
