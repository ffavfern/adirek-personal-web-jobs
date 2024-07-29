
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Admin</span>
            <button className="btn btn-error">Logout</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4">
        <h2 className="text-2xl mb-4">Welcome to the Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/manageProjects" className="card bg-white shadow p-4">
            <h3 className="text-xl font-bold">Manage Projects</h3>
          </Link>
          <Link to="/manageArticles" className="card bg-white shadow p-4">
            <h3 className="text-xl font-bold">Manage Articles</h3>
          </Link>
          <Link to="/manageUsers" className="card bg-white shadow p-4">
            <h3 className="text-xl font-bold">Manage Users</h3>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
