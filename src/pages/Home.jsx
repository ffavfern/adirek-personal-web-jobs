
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import ProjectSlide from '../components/ProjectSlide';
import ProjectType from '../components/ProjectType';
import Blog from '../components/Blog';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="container mx-auto justify-center">
        <About />
        <ProjectSlide />
        <ProjectType />
        <Blog />
        <Testimonials />
        <Contact />
      </div>
    </>
  );
};

export default Home;
