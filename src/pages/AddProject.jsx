
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddProject = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      image: null,
      type: 'การประกวดแข่งขัน',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      image: Yup.mixed().required('Required'),
      type: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        let imageUrl = '';
        if (values.image) {
          const imageRef = ref(storage, `projects/${values.image.name}`);
          await uploadBytes(imageRef, values.image);
          imageUrl = await getDownloadURL(imageRef);
        }

        await addDoc(collection(db, 'projects'), { ...values, imageUrl });
        navigate('/manageProjects');
      } catch (error) {
        console.error('Error adding project: ', error);
      }
    },
  });

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
          <h2 className="card-title text-primary">Add New Project</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="title">
                <span className="label-text">Project Title</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className="input input-bordered w-full"
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="text-error">{formik.errors.title}</div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="description">
                <span className="label-text">Project Description</span>
              </label>
              <textarea
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="textarea textarea-bordered w-full"
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <div className="text-error">{formik.errors.description}</div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="image">
                <span className="label-text">Project Image</span>
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
                className="input input-bordered w-full"
              />
              {formik.touched.image && formik.errors.image ? (
                <div className="text-error">{formik.errors.image}</div>
              ) : null}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="type">
                <span className="label-text">Project Type</span>
              </label>
              <select
                id="type"
                name="type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
                className="select select-bordered w-full"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {formik.touched.type && formik.errors.type ? (
                <div className="text-error">{formik.errors.type}</div>
              ) : null}
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">Add Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
