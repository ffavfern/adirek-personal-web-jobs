function Hero() {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold uppercase">Adirek Nuansri</h1>
            <h3>Chinese Teacher</h3>
            <p className="mb-5">
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
