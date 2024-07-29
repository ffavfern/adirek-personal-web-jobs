import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProject = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
    type: 'การประกวดแข่งขัน',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const projectDoc = await getDoc(doc(db, 'projects', id));
      const projectData = projectDoc.data();
      setFormData({
        title: projectData.title,
        description: projectData.description,
        imageUrl: projectData.imageUrl || '',
        type: projectData.type,
      });
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
    try {
      let imageUrl = formData.imageUrl;
      if (formData.image) {
        const imageRef = ref(storage, `projects/${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'projects', id), {
        title: formData.title,
        description: formData.description,
        imageUrl,
        type: formData.type,
      });

      navigate('/manageProjects');
    } catch (error) {
      console.error('Error updating project: ', error);
    }
  };

  const projectTypes = [
    'การประกวดแข่งขัน',
    'งานวิจัยและการตีพิมพ์',
    'วิทยาการและผู้ทรงคุณวุฒิ',
    'รางวัลเชิดชูเกียรติ',
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-primary">Edit Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['title', 'description'].map((field) => (
              <div className="form-control" key={field}>
                <label className="label" htmlFor={field}>
                  <span className="label-text">Project {field.charAt(0).toUpperCase() + field.slice(1)}</span>
                </label>
                {field === 'description' ? (
                  <textarea
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter project ${field}`}
                    className="textarea textarea-bordered w-full"
                    required
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter project ${field}`}
                    className="input input-bordered w-full"
                    required
                  />
                )}
              </div>
            ))}
            <div className="form-control">
              <label className="label" htmlFor="image">
                <span className="label-text">Project Image</span>
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="type">
                <span className="label-text">Project Type</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">Update Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
