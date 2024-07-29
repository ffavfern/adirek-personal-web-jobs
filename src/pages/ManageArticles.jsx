import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const articlesCollection = await getDocs(collection(db, 'articles'));
      setArticles(articlesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'articles', id));
      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (error) {
      console.error('Error deleting article: ', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Manage Articles</h1>
          <Link to="/addArticle" className="btn btn-primary">Add New Article</Link>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4">
        <h2 className="text-2xl mb-4">Article List</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.content}</td>
                  <td>
                    <Link to={`/editArticle/${article.id}`} className="btn btn-secondary mr-2">
                      Edit
                    </Link>
                    <button className="btn btn-error" onClick={() => handleDelete(article.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageArticles;
