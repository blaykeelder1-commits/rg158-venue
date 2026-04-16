import { Link } from 'react-router-dom';
import './PackageCard.css';

function PackageCard({ pkg, compact }) {
  return (
    <div className={`package-card ${pkg.popular ? 'popular' : ''} ${compact ? 'compact' : ''}`}>
      {pkg.popular && <div className="popular-badge">Most Popular</div>}
      <h3 className="package-name">{pkg.name}</h3>
      <p className="package-subtitle">{pkg.subtitle}</p>
      <div className="package-price">
        <span className="price-amount">{pkg.priceLabel}</span>
        <span className="price-detail">{pkg.duration} &middot; {pkg.capacity}</span>
      </div>
      <ul className="package-includes">
        {pkg.includes.map((item, i) => (
          <li key={i}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
      <p className="package-catering">
        + J Rodgers catering from <strong>${pkg.cateringFrom}/person</strong>
      </p>
      {!compact && (
        <div className="package-ideal">
          <p className="ideal-label">Ideal for:</p>
          <p className="ideal-list">{pkg.idealFor.join(' \u00b7 ')}</p>
        </div>
      )}
      <Link to={`/book?package=${pkg.id}`} className="btn btn-primary package-cta">
        Book This Package
      </Link>
    </div>
  );
}

export default PackageCard;
