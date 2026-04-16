import { Link } from 'react-router-dom';
import { venueInfo } from '../data/venueInfo';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-rg">RG</span>
              <span className="logo-158">158</span>
            </div>
            <p className="footer-tagline">Saraland's Premier Event Venue</p>
            <div className="footer-social">
              <a href={venueInfo.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href={venueInfo.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={venueInfo.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.23V9.12a8.16 8.16 0 0 0 3.85.96V6.69z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Venue</h4>
            <Link to="/packages">Packages & Pricing</Link>
            <Link to="/gallery">Photo Gallery</Link>
            <Link to="/book">Book Now</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-links">
            <h4>Catering</h4>
            <Link to="/catering">Event Catering</Link>
            <a href={venueInfo.jrodgers.website} target="_blank" rel="noopener noreferrer">J Rodgers BBQ</a>
            <a href={venueInfo.jrodgers.cateringUrl} target="_blank" rel="noopener noreferrer">Full Catering Menu</a>
            <a href={`tel:${venueInfo.jrodgers.phone.replace(/\D/g, '')}`}>{venueInfo.jrodgers.phone}</a>
          </div>

          <div className="footer-contact">
            <h4>Visit Us</h4>
            <p>{venueInfo.address}</p>
            <p>{venueInfo.city}, {venueInfo.state} {venueInfo.zip}</p>
            <a href={`tel:${venueInfo.phone.replace(/\D/g, '')}`} className="footer-phone">{venueInfo.phone}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RG 158 Entertainment LLC. All rights reserved.</p>
          <p className="footer-jrodgers">
            Catering powered by <a href={venueInfo.jrodgers.website} target="_blank" rel="noopener noreferrer">{venueInfo.jrodgers.name}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
