import React from 'react';

function Navbar() {
  return (
    <header className="custom-navbar">
      <div className="container d-flex justify-content-between align-items-center">
        <a href="/" className="brand-logo">
          <span>Real</span>Estate
        </a>
        <div className="d-none d-sm-flex align-items-center">
          <span className="brand-tagline">Find Your Dream Home</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
