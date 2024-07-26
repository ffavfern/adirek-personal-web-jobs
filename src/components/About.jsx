import Experience from "./Experience";
import Education from "./Education";

function About() {
  return (
    <>
      <section className="flex justify-between  py-80">
        <div className="flex experience flex-col w-1/3">
            <h1 className="uppercase font-bold">Experience</h1>
            <Experience/>
        </div>
        <div className="flex profile items-center flex-col w-1/3">
          <img src="#" alt="profile" />
          <button className="btn uppercase mt-10 w-40">dowload cv</button>
        </div>
        <div className="flex education font-bold flex-col w-1/3">
            <h1 className="uppercase">
                education
            </h1>
            <Education/>
        </div>
      </section>
    </>
  );
}

export default About;
