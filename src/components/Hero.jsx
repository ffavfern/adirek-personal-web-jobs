import { useEffect } from 'react';
import { gsap } from 'gsap';

function Hero() {
  
  useEffect(() => {
    gsap.from('.hero-text', { opacity: 0, y: 50, duration: 1 });
  }, []);
  return (
    <>
      <div
        className="hero min-h-screen" 
       // style={{
         // backgroundImage:
           // "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      //  }}
      >
        <div className="hero-overlay bg-opacity-60 bg-black"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md hero-text">
            <h1 className="mb-5 text-5xl font-bold uppercase">Adirek Nuansri</h1>
            <h3 className="text-xl">Chinese Teacher</h3>
            <p className="mb-5 text-xl">
              experience 10 years +
            </p>
          </div>

          {/*mouse scrolling animation */}
          <div className="mouse-scrolling-animation"></div>
        </div>
      </div>
    </>
  );
}

export default Hero;
