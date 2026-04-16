import { Link } from 'react-router-dom';
import { venueInfo } from '../data/venueInfo';
import usePageTitle from '../hooks/usePageTitle';

function BookingConfirmation() {
  usePageTitle('Booking Confirmed');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(70px + var(--spacing-3xl)) var(--container-padding) var(--spacing-3xl)',
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-3xl)',
      }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h1 style={{ color: 'var(--color-gold)', fontSize: 'var(--text-4xl)', marginBottom: 'var(--spacing-md)' }}>
          You're Booked!
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-xl)', lineHeight: '1.7' }}>
          Your deposit has been received and your date is secured.
          We'll be in touch within 24 hours to confirm details and discuss your event.
        </p>
        <div style={{
          background: 'var(--color-gold-muted)',
          border: '1px solid rgba(212, 168, 67, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'left',
        }}>
          <p style={{ color: 'var(--color-gold-light)', fontSize: 'var(--text-sm)', margin: '0 0 var(--spacing-sm)' }}>
            <strong>What's next:</strong>
          </p>
          <ul style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0, paddingLeft: 'var(--spacing-lg)', lineHeight: '1.8' }}>
            <li>You'll receive a confirmation email shortly</li>
            <li>Our team will call to discuss event details</li>
            <li>If you added catering, J Rodgers BBQ will help customize your menu</li>
            <li>Remaining balance due 7 days before your event</li>
          </ul>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-xl)' }}>
          Questions? Call us at{' '}
          <a href={`tel:${venueInfo.phone.replace(/\D/g, '')}`} style={{ color: 'var(--color-gold)' }}>
            {venueInfo.phone}
          </a>
        </p>
        <Link to="/" className="btn btn-outline">Back to Home</Link>
      </div>
    </div>
  );
}

export default BookingConfirmation;
