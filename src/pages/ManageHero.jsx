import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import ContentCard from '../components/ContentCard';

const ManageHero = () => {
  const [heroes, setHeroes] = useState([]);
  const [newHero, setNewHero] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      const heroesCollection = await getDocs(collection(db, 'hero'));
      setHeroes(heroesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchHeroes();
  }, []);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `hero-images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleAddHero = async (e) => {
    e.preventDefault();
    let imageUrl = newHero.imageUrl;
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
    }

    if (editingId) {
      const heroDoc = doc(db, 'hero', editingId);
      await updateDoc(heroDoc, { ...newHero, imageUrl });
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'hero'), { ...newHero, imageUrl });
    }
    setNewHero({ title: '', subtitle: '', description: '', imageUrl: '' });
    setImageFile(null);
    const heroesCollection = await getDocs(collection(db, 'hero'));
    setHeroes(heroesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleEditHero = (hero) => {
    setNewHero({ title: hero.title, subtitle: hero.subtitle, description: hero.description, imageUrl: hero.imageUrl });
    setEditingId(hero.id);
  };

  const handleDeleteHero = async (id) => {
    await deleteDoc(doc(db, 'hero', id));
    setHeroes(heroes.filter((hero) => hero.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8">Manage Hero</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-4">Back to Dashboard</button>
      </Link>
      <form onSubmit={handleAddHero} className="mb-4">
        <input
          type="text"
          value={newHero.title}
          onChange={(e) => setNewHero({ ...newHero, title: e.target.value })}
          placeholder="Title"
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="text"
          value={newHero.subtitle}
          onChange={(e) => setNewHero({ ...newHero, subtitle: e.target.value })}
          placeholder="Subtitle"
          className="input input-bordered w-full mb-2"
          required
        />
        <textarea
          value={newHero.description}
          onChange={(e) => setNewHero({ ...newHero, description: e.target.value })}
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-2"
          required
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input input-bordered w-full mb-2"
        />
        <button type="submit" className="btn btn-primary w-full">
          {editingId ? 'Update Hero' : 'Add Hero'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroes.map((hero) => (
          <ContentCard
            key={hero.id}
            {...hero}
            onDelete={() => handleDeleteHero(hero.id)}
            onUpdate={() => handleEditHero(hero)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageHero;
