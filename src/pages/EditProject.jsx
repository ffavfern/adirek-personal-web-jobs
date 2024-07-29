import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProject = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;
      if (typeof formData.image === 'object') {
        const imageRef = ref(storage, `projects/${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }
      await updateDoc(doc(db, 'projects', id), {
        ...formData,
        image: imageUrl,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating project: ', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Type</option>
            <option value="การประกวดแข่งขัน">การประกวดแข่งขัน</option>
            <option value="งานวิจัยและการตีพิมพ์">งานวิจัยและการตีพิมพ์</option>
            <option value="วิทยาการและผู้ทรงคุณวุฒิ">วิทยาการและผู้ทรงคุณวุฒิ</option>
            <option value="รางวัลเชิดชูเกียรติ">รางวัลเชิดชูเกียรติ</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
};

export default EditProject;
