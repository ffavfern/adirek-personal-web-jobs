import Hero from './components/Hero';
import About from './components/About';
import ProjectSlide from './components/ProjectSlide';
import ProjectType from './components/ProjectsType';
import Blog from './components/Blog';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  
  return (
    <>
      <Hero/>
      <div className="container mx-20 justify-center">
        <About/>
        <ProjectSlide/>
        <ProjectType/>
        <Blog/>
        <hr />
        <Testimonials/>
        <Contact/>
      </div>
      <Footer/>
    </>
  )
}

export default App
