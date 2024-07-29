import  { useEffect } from 'react';
import { gsap } from 'gsap';

function ProjectsType() {
  const projectTypes = [
    'การประกวดแข่งขัน',
    'งานวิจัยและการตีพิมพ์',
    'วิทยาการและผู้ทรงคุณวุฒิ',
    'รางวัลเชิดชูเกียรติ',
  ];
  useEffect(() => {
    gsap.from('.project-type', { opacity: 0, scale: 0.8, duration: 1, stagger: 0.2 });
  }, []);

  return (
    <>
      <section id="projecttype" className="bg-secondary text-primary py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Project Types</h2>
        <div className="flex flex-wrap justify-center mt-8">
          {projectTypes.map((type) => (
            <div key={type} className="m-4 p-4 bg-primary text-secondary rounded-lg shadow-lg project-type">
              <h3 className="text-2xl font-bold">{type}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

export default ProjectsType;
