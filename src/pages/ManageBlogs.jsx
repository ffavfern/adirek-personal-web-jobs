import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageBlogs = () => {
  const { quill, quillRef } = useQuill();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([
    "Technology",
    "Health",
    "Lifestyle",
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    category: "",
    images: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([""]);
  const [editingBlogId, setEditingBlogId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, "blogs");
        const blogsSnapshot = await getDocs(blogsCollection);
        const blogsList = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsList);
        toast.success("Blogs loaded successfully");
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
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
            if (!file.type.startsWith("image/")) {
              setError("Invalid file type. Only images are allowed.");
              toast.error("Invalid file type. Only images are allowed.");
              return null;
            }

            const imageRef = ref(
              storage,
              `blog-images/${uuidv4()}-${file.name}`
            );
            await uploadBytes(imageRef, file);
            return await getDownloadURL(imageRef);
          })
        );

        uploadedImageUrls = uploadedImageUrls.filter(Boolean);
      }

      const allImages = [
        ...uploadedImageUrls,
        ...imageUrls.filter((url) => url.trim()),
      ];
      const blogData = { ...newBlog, images: allImages };

      if (editingBlogId) {
        const blogRef = doc(db, "blogs", editingBlogId);
        await updateDoc(blogRef, blogData);
        setBlogs(
          blogs.map((blog) =>
            blog.id === editingBlogId ? { id: blog.id, ...blogData } : blog
          )
        );
        toast.success("Blog updated successfully");
      } else {
        const docRef = await addDoc(collection(db, "blogs"), blogData);
        setBlogs([...blogs, { id: docRef.id, ...blogData }]);
        toast.success("Blog created successfully");
      }
      resetForm();
    } catch (err) {
      console.error("Error saving blog:", err);
      setError("Failed to save blog. Please try again later.");
      toast.error("Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setNewBlog({ title: "", content: "", category: "", images: [] });
    setImageFiles([]);
    setImageUrls([""]);
    setEditingBlogId(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "blogs", id));
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast.success("Blog deleted successfully");
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError("Failed to delete blog. Please try again later.");
      toast.error("Failed to delete blog");
    }
  };

  const handleEdit = (blog) => {
    setNewBlog(blog);
    setImageUrls(blog.images || [""]);
    setEditingBlogId(blog.id);
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(blog.content);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleImageUploadInContent = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const imageRef = ref(storage, `blog-images/${uuidv4()}-${file.name}`);
          await uploadBytes(imageRef, file);
          const imageUrl = await getDownloadURL(imageRef);

          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", imageUrl);
        } catch (err) {
          console.error("Error uploading image:", err);
          setError("Failed to upload image. Please try again later.");
          toast.error("Failed to upload image");
        }
      }
    };
  };

  const handleAddImageUrlField = () => {
    if (
      imageUrls.length === 0 ||
      imageUrls[imageUrls.length - 1]?.trim() !== ""
    ) {
      setImageUrls([...imageUrls, ""]);
    } else {
      toast.error(
        "Please fill in the current URL field before adding a new one."
      );
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

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    } else {
      toast.error("Category is empty or already exists.");
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ToastContainer />

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 uppercase text-center sm:text-left">
        Manage Blogs
      </h1>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-6 ">Back to Dashboard</button>
      </Link>

      <form onSubmit={handleSaveBlog} className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingBlogId ? "Edit Blog" : "Create New Blog"}
        </h2>
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
          <label className="block mb-2">Category</label>
          <select
            className="input input-bordered w-full"
            value={newBlog.category}
            onChange={(e) =>
              setNewBlog({ ...newBlog, category: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              className="input input-bordered flex-grow"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary ml-2"
              onClick={handleAddCategory}
            >
              Add
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
              >
                {category}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveCategory(category)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Content:</label>
          <div ref={quillRef} />
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={handleImageUploadInContent}
          >
            Upload Image to Content
          </button>
        </div>
        <div className="flex flex-col space-y-5 p-5 border">
          <h1 className="text-lg sm:text-xl lg:text-2xl mb-5 font-bold">
            Upload Image Thumbnail
          </h1>

          <div className="space-y-4">
            <label className="block text-sm sm:text-base lg:text-lg mb-2">
              Image URLs:
            </label>
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center mb-2 space-y-2 sm:space-y-0 sm:space-x-2"
              >
                <input
                  type="text"
                  className="input input-bordered flex-grow"
                  placeholder="Image URL"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-danger mt-2 sm:mt-0 sm:ml-2"
                  onClick={() => handleRemoveImageUrlField(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddImageUrlField}
            >
              Add Another Image URL
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm sm:text-base lg:text-lg mb-2">
              Upload Images:
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="input input-bordered w-full "
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
            />
          </div>
        </div>

        <div className="flex justify-between my-5">
          <button
            type="submit"
            className={`btn btn-primary ${saving ? "loading" : ""}`}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Blog"}
          </button>
          {editingBlogId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="card p-4 border rounded shadow-xl">
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p className="mb-2 text-gray-500">{blog.category}</p>
            <img
              src={blog.images}
              className="rounded mb-5 w-full h-auto max-w-full object-cover aspect-video" 
              alt=""
            />
            <div className="flex justify-between">
              <button
                className="btn btn-error"
                onClick={() => handleEdit(blog)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBlogs;
