import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import { v4 as uuidv4 } from 'uuid';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Import Quill styles

const ManageBlogs = () => {
  const { quill, quillRef } = useQuill();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', images: [] });
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, 'blogs');
        const blogsSnapshot = await getDocs(blogsCollection);
        const blogsList = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsList);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setNewBlog((prev) => ({ ...prev, content: quill.root.innerHTML }));
      });
    }
  }, [quill]);

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let uploadedImageUrls = [];

      if (imageFiles.length > 0) {
        uploadedImageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            if (!file.type.startsWith('image/')) {
              setError('Invalid file type. Only images are allowed.');
              return null;
            }

            const imageRef = ref(storage, `blog-images/${uuidv4()}-${file.name}`);
            await uploadBytes(imageRef, file);
            return await getDownloadURL(imageRef);
          })
        );

        // Remove any null entries from the array
        uploadedImageUrls = uploadedImageUrls.filter(Boolean);
      }

      const allImages = [...uploadedImageUrls, ...imageUrls.filter(url => url.trim())];
      const blogData = { ...newBlog, images: allImages };

      if (editingBlogId) {
        const blogRef = doc(db, 'blogs', editingBlogId);
        await updateDoc(blogRef, blogData);
        setBlogs(blogs.map((blog) => (blog.id === editingBlogId ? { id: blog.id, ...blogData } : blog)));
      } else {
        const docRef = await addDoc(collection(db, 'blogs'), blogData);
        setBlogs([...blogs, { id: docRef.id, ...blogData }]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setNewBlog({ title: '', content: '', images: [] });
    setImageFiles([]);
    setImageUrls(['']);
    setEditingBlogId(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog. Please try again later.');
    }
  };

  const handleEdit = (blog) => {
    setNewBlog(blog);
    setImageUrls(blog.images || ['']);
    setEditingBlogId(blog.id);
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(blog.content);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleImageUploadInContent = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const imageRef = ref(storage, `blog-images/${uuidv4()}-${file.name}`);
          await uploadBytes(imageRef, file);
          const imageUrl = await getDownloadURL(imageRef);

          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
        } catch (err) {
          console.error('Error uploading image:', err);
          setError('Failed to upload image. Please try again later.');
        }
      }
    };
  };

  const handleAddImageUrlField = () => {
    if (imageUrls[imageUrls.length - 1].trim() !== '') {
      setImageUrls([...imageUrls, '']);
    }
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleRemoveImageUrlField = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/dashboard">
        <button className="btn btn-primary mb-6">Back to Dashboard</button>
      </Link>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 uppercase text-center sm:text-left">
        Manage Blogs
      </h1>

      <form onSubmit={handleSaveBlog} className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingBlogId ? 'Edit Blog' : 'Create New Blog'}</h2>
        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <div ref={quillRef} />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Upload Cover Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            className="input input-bordered w-full"
          />
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="Image URL"
                className="input input-bordered w-full"
              />
              <button
                type="button"
                onClick={() => handleRemoveImageUrlField(index)}
                className="btn btn-danger"
              >
                Remove
              </button>
              {index === imageUrls.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddImageUrlField}
                  className="btn btn-secondary"
                >
                  Add URL
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <LoadingSpinner size="sm" /> : editingBlogId ? 'Update Blog' : 'Create Blog'}
          </button>
          {editingBlogId && (
            <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">Cancel</button>
          )}
        </div>
      </form>

      {blogs.length > 0 ? (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li key={blog.id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex space-x-2 mt-2">
                {blog.images && blog.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Blog image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
              <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 100) + '...' }} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center mt-10">No blogs found.</p>
      )}
    </div>
  );
};

export default ManageBlogs;
