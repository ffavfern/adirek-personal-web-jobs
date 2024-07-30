import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    title: '',
    year: '',
    description: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      const experiencesCollection = await getDocs(collection(db, 'experience'));
      setExperiences(experiencesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchExperiences();
  }, []);

  const handleImageUpload = async () => {
    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    }
    return newExperience.imageUrl;
  };

  const handleAddOrUpdateExperience = async (e) => {
    e.preventDefault();
    const imageUrl = await handleImageUpload();
    const experienceData = { ...newExperience, imageUrl };

    if (editingId) {
      const experienceDoc = doc(db, 'experience', editingId);
      await updateDoc(experienceDoc, experienceData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'experience'), experienceData);
    }
    setNewExperience({ title: '', year: '', description: '', imageUrl: '' });
    setImageFile(null);
    const experiencesCollection = await getDocs(collection(db, 'experience'));
    setExperiences(experiencesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditExperience = (experience) => {
    setNewExperience({ title: experience.title, year: experience.year, description: experience.description, imageUrl: experience.imageUrl });
    setEditingId(experience.id);
  };

  const handleDeleteExperience = async (id) => {
    await deleteDoc(doc(db, 'experience', id));
    setExperiences(experiences.filter((experience) => experience.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8">Manage Experience</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-4">Back to Dashboard</button>
      </Link>
      <form onSubmit={handleAddOrUpdateExperience} className="mb-4">
        <input
          type="text"
          value={newExperience.title}
          onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
          placeholder="Title"
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="text"
          value={newExperience.year}
          onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
          placeholder="Year"
          className="input input-bordered w-full mb-2"
          required
        />
        <textarea
          value={newExperience.description}
          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-2"
          required
        />
        <input
          type="text"
          value={newExperience.imageUrl}
          onChange={(e) => setNewExperience({ ...newExperience, imageUrl: e.target.value })}
          placeholder="Image URL"
          className="input input-bordered w-full mb-2"
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input input-bordered w-full mb-2"
        />
        <button type="submit" className="btn btn-primary w-full">
          {editingId ? 'Update Experience' : 'Add Experience'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((experience) => (
          <ContentCard
            key={experience.id}
            {...experience}
            onDelete={() => handleDeleteExperience(experience.id)}
            onUpdate={() => handleEditExperience(experience)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageExperience;
