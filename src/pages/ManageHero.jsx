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
    setNewHero({
      title: hero.title,
      subtitle: hero.subtitle,
      description: hero.description,
      imageUrl: hero.imageUrl,
    });
    setEditingId(hero.id);
  };

  const handleDeleteHero = async (id) => {
    await deleteDoc(doc(db, 'hero', id));
    setHeroes(heroes.filter((hero) => hero.id !== id));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Manage Hero</h2>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-6">Back to Dashboard</button>
      </Link>
      <form onSubmit={handleAddHero} className="space-y-4 mb-8">
        <input
          type="text"
          value={newHero.title}
          onChange={(e) => setNewHero({ ...newHero, title: e.target.value })}
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          value={newHero.subtitle}
          onChange={(e) => setNewHero({ ...newHero, subtitle: e.target.value })}
          placeholder="Subtitle"
          className="input input-bordered w-full"
          required
        />
        <textarea
          value={newHero.description}
          onChange={(e) => setNewHero({ ...newHero, description: e.target.value })}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          required
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">
          {editingId ? 'Update Hero' : 'Add Hero'}
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
