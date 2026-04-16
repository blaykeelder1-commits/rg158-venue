import { useState } from 'react';
import { venueInfo } from '../data/venueInfo';
import usePageTitle from '../hooks/usePageTitle';
import './Contact.css';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '9aa7860e-308f-4a26-90c7-21983d2c07e0';

function Contact() {
  usePageTitle('Contact Us');

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `RG 158 Venue Inquiry from ${form.name}`,
          from_name: form.name,
          ...form
        })
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      setError('Unable to send message. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Questions? Want to tour the venue? We'd love to hear from you.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info-panel">
              <div className="info-block">
                <h3>Visit Us</h3>
                <p>{venueInfo.address}</p>
                <p>{venueInfo.city}, {venueInfo.state} {venueInfo.zip}</p>
                <p className="info-note">Located behind J Rodgers BBQ</p>
              </div>

              <div className="info-block">
                <h3>Call Us</h3>
                <a href={`tel:${venueInfo.phone.replace(/\D/g, '')}`} className="info-phone">
                  {venueInfo.phone}
                </a>
                <p className="info-note">RG 158 Entertainment</p>
                <a href={`tel:${venueInfo.jrodgers.phone.replace(/\D/g, '')}`} className="info-phone secondary">
                  {venueInfo.jrodgers.phone}
                </a>
                <p className="info-note">J Rodgers BBQ (catering)</p>
              </div>

              <div className="info-block">
                <h3>Follow Us</h3>
                <div className="contact-social">
                  <a href={venueInfo.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href={venueInfo.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href={venueInfo.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
                </div>
              </div>

              <div className="info-block">
                <h3>Schedule a Tour</h3>
                <p>
                  Want to see the space before booking? Call us to schedule a walkthrough.
                  We love showing off the venue.
                </p>
              </div>
            </div>

            <div className="contact-form-panel">
              {submitted ? (
                <div className="form-success">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} rows="5" required
                      placeholder="Tell us about your event or ask us anything..."
                    />
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} style={{ width: '100%' }}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3439.5!2d-88.07!3d30.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x889a4d5e5e5e5e5e%3A0x5e5e5e5e5e5e5e5e!2s1444%20Industrial%20Pkwy%2C%20Saraland%2C%20AL%2036571!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="RG 158 Entertainment Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
