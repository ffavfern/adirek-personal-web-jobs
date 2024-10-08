import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ManageProjects from "./pages/ManageProjects";
import ManageBlogs from "./pages/ManageBlogs";
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
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
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
              path="/dashboard/manageContact"
              element={
                <ProtectedRoute>
                  <ManageContact />
                </ProtectedRoute>
              }
            />
            <Route path="/:id" element={<ProjectDetail />} />
            <Route path="/projects/other" element={<ProjectOther />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/blogs" element={<BlogAll />} />
            <Route path="/projects/:typeKey" element={<ProjectOther />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
