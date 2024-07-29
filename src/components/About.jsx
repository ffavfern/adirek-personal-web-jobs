import  { useEffect } from 'react';
import { gsap } from 'gsap';
import Experience from "./Experience";
import Education from "./Education";

function About() {

  useEffect(() => {
    gsap.from('.about-text', { opacity: 0, x: -50, duration: 1 });
  }, []);
  return (
    <>
      <section className="about flex justify-between  py-60  items-start  gap-4">
        <div className="flex experience flex-col w-1/3 about-text ">
            <h1 className="uppercase font-bold text-4xl">Experience</h1>
            <Experience/>
        </div>
        <div className="flex profile items-center flex-col w-1/3 about-text ">
          <img src="https://adirek.netlify.app/assets/profile-BgioiZ0C.png" alt="profile" className="w-full h-full bg-white rounded-xl shadow-xl" />
          <a href="https://drive.google.com/file/d/1nOr2V0OqJbMxUmQRy1PU33tPAUHmWTBR/preview"><button className="btn uppercase mt-10 w-40 tracking-widest		">dowload cv</button></a>
        </div>
        <div className="flex education  flex-col w-1/3  p-10 about-text">
            <h1 className="uppercase text-4xl font-bold">
                education
            </h1>
            <Education/>
        </div>
      </section>
    </>
  );
}

export default About;
