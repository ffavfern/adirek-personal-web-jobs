function Navbar() {
  return (
    <nav className="navbar hidden md:flex justify-between w-12 h-1/4 sm:w-14 md:w-16 fixed top-1/3 p-3 sm:p-4 md:p-5 flex-col">
      <a
        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-black hover:bg-error active:bg-error transition-all duration-300"
        href="#hero"
        aria-label="Go to Hero section"
      ></a>
      <a
        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-black hover:bg-error active:bg-error transition-all duration-300"
        href="#about"
        aria-label="Go to About section"
      ></a>
      <a
        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-black hover:bg-error active:bg-error transition-all duration-300"
        href="#projectslide"
        aria-label="Go to Project slide section"
      ></a>
      <a
        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-black hover:bg-error active:bg-error transition-all duration-300"
        href="#blog"
        aria-label="Go to Blog section"
      ></a>
      <a
        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-black hover:bg-error active:bg-error transition-all duration-300"
        href="#contact"
        aria-label="Go to Contact section"
      ></a>
   
    </nav>
  );
}

export default Navbar;
