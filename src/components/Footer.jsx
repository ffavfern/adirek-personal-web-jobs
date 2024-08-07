function Footer() {
  return (
    <>
      <footer className="footer footer-center bg-black text-base-content p-6 sm:p-10">
        <aside className="text-center">
          <p className="text-sm sm:text-lg lg:text-xl text-white">
            Copyright © {new Date().getFullYear()} - All rights reserved by Juthamasntk
          </p>
        </aside>
      </footer>
    </>
  );
}

export default Footer;
