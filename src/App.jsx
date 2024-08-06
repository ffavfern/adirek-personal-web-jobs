import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient,QueryClientProvider, } from '@tanstack/react-query'
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ManageProjects from "./pages/ManageProjects";
import ManageBlogs from "./pages/ManageBlogs";
import ManageAdmin from "./pages/ManageAdmin";
import ManageHero from "./pages/ManageHero";
import ManageExperience from "./pages/ManageExperience";
import ManageEducation from "./pages/ManageEducation";
import ManageTestimonials from "./pages/ManageTestimonials";
import ManageContact from "./pages/ManageContact";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ProjectDetail from './components/ProjectDetail'; 
import ProjectOther from './pages/ProjectOther';
import BlogDetail from './pages/BlogDetail';
import BlogAll from './pages/BlogAll';

const queryClient = new QueryClient()


function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <AuthProvider>
        
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
              path="/dashboard/projects"
              element={
                <ProtectedRoute>
                  <ManageProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/blogs"
              element={
                <ProtectedRoute>
                  <ManageBlogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <ManageAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/hero"
              element={
                <ProtectedRoute>
                  <ManageHero />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/experience"
              element={
                <ProtectedRoute>
                  <ManageExperience />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/education"
              element={
                <ProtectedRoute>
                  <ManageEducation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/testimonials"
              element={
                <ProtectedRoute>
                  <ManageTestimonials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/contact"
              element={
                <ProtectedRoute>
                  <ManageContact />
                </ProtectedRoute>
              }
            />
            <Route path="/:id" element={<ProjectDetail />} />
            <Route path="/projects/other" element={<ProjectOther />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blogs" element={<BlogAll />} />

          </Routes>
        
      </AuthProvider>
      </QueryClientProvider>

    
  );
}

export default App;
