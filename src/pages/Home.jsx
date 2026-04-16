import { Link } from 'react-router-dom';
import { venueInfo } from '../data/venueInfo';
import { packages } from '../data/packages';
import PackageCard from '../components/PackageCard';
import usePageTitle from '../hooks/usePageTitle';
import './Home.css';

const featureIcons = {
  bar: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l-4 9H4l4-9z"/><path d="M12 11v11"/><path d="M8 22h8"/></svg>,
  sound: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  lights: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  projector: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  vip: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  catering: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
};

function Home() {
  usePageTitle();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1 className="hero-title">
            Your Event.<br />
            <span className="text-gold">Our Stage.</span>
          </h1>
          <p className="hero-subtitle">
            Saraland's premier event venue with full bar, concert-level sound & lighting,
            and on-site BBQ catering by J Rodgers.
          </p>
          <div className="hero-actions">
            <Link to="/book" className="btn btn-primary btn-lg">Book Your Event</Link>
            <Link to="/packages" className="btn btn-outline btn-lg">View Packages</Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">150+</span>
              <span className="stat-label">Guest Capacity</span>
            </div>
            <div className="stat">
              <span className="stat-number">$500</span>
              <span className="stat-label">Starting At</span>
            </div>
            <div className="stat">
              <span className="stat-number">2</span>
              <span className="stat-label">Full Bars</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="container">
          <h2 className="section-title">Everything Under One Roof</h2>
          <p className="section-subtitle">
            A complete event experience — venue, bar, sound, lights, and catering — all in one place.
            No coordinating vendors. No hidden fees. Just your event, done right.
          </p>
          <div className="features-grid">
            {venueInfo.features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  {featureIcons[feature.icon]}
                </div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="section packages-preview">
        <div className="container">
          <h2 className="section-title">Pick Your Package</h2>
          <p className="section-subtitle">
            Simple, transparent pricing. Every package includes the venue, bar access, and full AV setup.
            Add catering from J Rodgers BBQ for the complete experience.
          </p>
          <div className="packages-grid">
            {packages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} compact />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)' }}>
            <Link to="/packages" className="btn btn-outline">See Full Package Details</Link>
          </div>
        </div>
      </section>

      {/* Catering CTA */}
      <section className="section catering-cta">
        <div className="container">
          <div className="catering-banner">
            <div className="catering-text">
              <h2>Catering by J Rodgers BBQ & Soul Food</h2>
              <p>
                Skip the outside caterer. Our award-winning BBQ and soul food kitchen is
                right next door — serving Saraland since 1992. Slow-smoked ribs, pulled pork,
                fried chicken, and all the fixings, prepared fresh for your guests.
              </p>
              <div className="catering-actions">
                <Link to="/catering" className="btn btn-primary">View Catering Menu</Link>
                <a href={venueInfo.jrodgers.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Visit J Rodgers BBQ
                </a>
              </div>
            </div>
            <div className="catering-highlights">
              <div className="highlight">
                <span className="highlight-price">From $12</span>
                <span className="highlight-label">per person</span>
              </div>
              <div className="highlight">
                <span className="highlight-price">30+</span>
                <span className="highlight-label">years serving Saraland</span>
              </div>
              <div className="highlight">
                <span className="highlight-price">4.3</span>
                <span className="highlight-label">stars on TripAdvisor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section final-cta">
        <div className="container text-center">
          <h2>Ready to Book Your Event?</h2>
          <p className="section-subtitle">
            Secure your date today. Browse available dates, pick your package,
            and reserve your spot — all online.
          </p>
          <Link to="/book" className="btn btn-primary btn-lg">Book Now</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
