import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";




function Contact() {
  return (
    <>
      <section className="contact  text-center pt-40">
        <h1 className="uppercase font-bold text-4xl">get in touch</h1>
        <div className="flex-row justify-between flex py-20 items-center ">
          <div className="flex w-1/2 flex-col text-start leading-10">
            <h3 className="uppercase">email</h3>
            <input type="email" name="email" id="email" />
            <h3 className="uppercase">message</h3>
            <textarea
              type="text"
              name="message"
              id="message"
              className="h-36"
            />
          </div>
          {/*socials*/}
          <div className="flex w-1/2  text-center justify-between px-32">
          <a href="#"><FaFacebook className="text-4xl "/></a>
          <a href="#"><FaLinkedin className="text-4xl"/></a>
          <a href="#"><SiGmail className="text-4xl"/></a>

          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
