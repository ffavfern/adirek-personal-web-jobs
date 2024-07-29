import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageProjects from './pages/ManageProjects';
import ManageBlog from './pages/ManageBlog';
import ManageTestimonials from './pages/ManageTestimonials';
import ManageHero from './pages/ManageHero';
import ManageAbout from './pages/ManageAbout';
import ManageContact from './pages/ManageContact';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-projects"
              element={
                <ProtectedRoute>
                  <ManageProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-blog"
              element={
                <ProtectedRoute>
                  <ManageBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-testimonials"
              element={
                <ProtectedRoute>
                  <ManageTestimonials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-hero"
              element={
                <ProtectedRoute>
                  <ManageHero />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-about"
              element={
                <ProtectedRoute>
                  <ManageAbout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-contact"
              element={
                <ProtectedRoute>
                  <ManageContact />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
