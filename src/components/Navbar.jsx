function Navbar() {
  return (
    <nav className="navbar flex justify-between w-16 h-1/4 flex-col fixed top-1/3 p-5">
      <a className="w-5 h-5 rounded-full bg-black hover:bg-error active:bg-error scroll-smooth" href="#hero" aria-label="Go to Hero section"></a>
      <a className="w-5 h-5 rounded-full bg-black hover:bg-error active:bg-error scroll-smooth" href="#about" aria-label="Go to About section"></a>
      <a className="w-5 h-5 rounded-full bg-black hover:bg-error active:bg-error scroll-smooth" href="#projectslide" aria-label="Go to Project slide section"></a>
      <a className="w-5 h-5 rounded-full bg-black hover:bg-error active:bg-error scroll-smooth" href="#blog" aria-label="Go to Blog section"></a>
      <a className="w-5 h-5 rounded-full bg-black hover:bg-error active:bg-error scroll-smooth" href="#contact" aria-label="Go to Contact section"></a>
      <a className="w-5 h-5 rounded-full bg-black hover:bg-error active:bg-error scroll-smooth" href="#footer" aria-label="Go to Footer section"></a>
    </nav>
  );
}

export default Navbar;
