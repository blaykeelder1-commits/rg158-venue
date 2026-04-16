import { Link } from 'react-router-dom';
import { venueInfo } from '../data/venueInfo';
import { cateringPackages } from '../data/packages';
import usePageTitle from '../hooks/usePageTitle';
import './Catering.css';

function Catering() {
  usePageTitle('Event Catering');

  return (
    <div className="catering-page">
      <div className="page-header">
        <div className="container">
          <h1>Event Catering</h1>
          <p>Authentic BBQ & soul food by J Rodgers — right next door</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="catering-intro">
            <h2 className="section-title">Feed Your Guests Right</h2>
            <p className="section-subtitle">
              Since 1992, J Rodgers BBQ & Soul Food has been serving Saraland the best slow-smoked
              ribs, pulled pork, fried chicken, and homemade sides. Now you can bring that same
              award-winning food to your event — prepared fresh and served right from our kitchen next door.
            </p>
          </div>

          <div className="catering-packages-grid">
            {cateringPackages.map((pkg, i) => (
              <div key={i} className="catering-card">
                <h3>{pkg.name}</h3>
                <p className="catering-serves">{pkg.serves}</p>
                <ul>
                  {pkg.includes.map((item, j) => (
                    <li key={j}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="catering-price">{pkg.price}</div>
              </div>
            ))}
          </div>

          <div className="catering-note">
            <h3>Custom Menus Available</h3>
            <p>
              Have specific dietary needs or want something special? We'll work with you to create
              a custom menu for your event. Wings, ribs, brisket, seafood boils — if you can dream it,
              we can cook it.
            </p>
            <div className="catering-cta-group">
              <Link to="/book" className="btn btn-primary">Book Venue + Catering</Link>
              <a href={venueInfo.jrodgers.cateringUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Full J Rodgers Menu
              </a>
            </div>
          </div>

          <div className="jrodgers-banner">
            <div className="jrodgers-info">
              <h3>About J Rodgers BBQ & Soul Food</h3>
              <p>
                Family-owned since 1992. Ranked #3 restaurant in Saraland. 4.3 stars on TripAdvisor.
                We've fed Senior Bowl coaches, family reunions, church events, and everything in between.
                Your event is in good hands.
              </p>
              <a href={venueInfo.jrodgers.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Visit jrodgersbbq.net
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Catering;
