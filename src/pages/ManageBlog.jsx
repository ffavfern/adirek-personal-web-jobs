
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ManageBlog = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = await getDocs(collection(db, 'posts'));
      setPosts(postsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAdd = async () => {
    await addDoc(collection(db, 'posts'), form);
    setForm({ title: '', content: '' });
  };

  const handleUpdate = async (id) => {
    const postDoc = doc(db, 'posts', id);
    await updateDoc(postDoc, form);
    setForm({ title: '', content: '' });
  };

  const handleDelete = async (id) => {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
  };

  return (
    <div className="dashboard-container">
      <h1>Manage Blog</h1>
      <div>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content"></textarea>
        <button onClick={handleAdd}>Add Post</button>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleUpdate(post.id)}>Update</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageBlog;
