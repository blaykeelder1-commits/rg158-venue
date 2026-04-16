import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-rg">RG</span>
          <span className="logo-158">158</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/packages" onClick={() => setMenuOpen(false)}>Packages</NavLink>
          <NavLink to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</NavLink>
          <NavLink to="/catering" onClick={() => setMenuOpen(false)}>Catering</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <Link to="/book" className="btn btn-primary btn-sm nav-cta" onClick={() => setMenuOpen(false)}>
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
