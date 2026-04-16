import { useState } from 'react';
import { packages, addOns } from '../data/packages';
import PackageCard from '../components/PackageCard';
import usePageTitle from '../hooks/usePageTitle';
import './Packages.css';

const faqs = [
  {
    q: 'What does the venue rental include?',
    a: 'Every package includes full use of the venue space, bar access, sound system, projector, basic lighting, tables and chairs, and dedicated event staff. The bar operates as a cash bar unless you add an open bar package.'
  },
  {
    q: 'Can I bring my own food or caterer?',
    a: 'We strongly recommend our on-site catering partner J Rodgers BBQ & Soul Food for the best experience and pricing. However, outside catering can be arranged for an additional fee — contact us to discuss.'
  },
  {
    q: 'What is the alcohol policy?',
    a: 'All alcohol must be served by our licensed bartenders. The default is a cash bar where guests purchase their own drinks. You can add an open bar package that covers unlimited well drinks, beer, and wine for your guests.'
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 4-6 weeks in advance for most events, and 3-6 months for weddings and large events. Popular dates (holidays, graduation season) book quickly.'
  },
  {
    q: 'Is there a deposit required?',
    a: 'Yes, a 50% deposit is required to secure your date. The remaining balance is due 7 days before your event.'
  },
  {
    q: 'Can I tour the venue before booking?',
    a: 'Absolutely! Call us at (251) 217-2273 to schedule a walkthrough. We love showing off the space.'
  },
  {
    q: 'Is the venue ADA accessible?',
    a: 'The main floor and bar area are accessible. Please contact us to discuss specific accessibility needs so we can make accommodations.'
  },
  {
    q: 'What about parking?',
    a: 'We have a large parking lot with ample space for your guests. For very large events (100+), we can help coordinate overflow parking.'
  },
];

function Packages() {
  usePageTitle('Packages & Pricing');
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="packages-page">
      <div className="page-header">
        <div className="container">
          <h1>Packages & Pricing</h1>
          <p>Simple pricing. No hidden fees. Everything you need for an unforgettable event.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="packages-grid">
            {packages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="section addons-section">
        <div className="container">
          <h2 className="section-title">Enhance Your Event</h2>
          <p className="section-subtitle">Add these extras to any package</p>
          <div className="addons-grid">
            {addOns.map(addon => (
              <div key={addon.id} className="addon-card">
                <div className="addon-info">
                  <h4 className="addon-name">{addon.name}</h4>
                  <p className="addon-desc">{addon.description}</p>
                </div>
                <div className="addon-price">
                  <span className="addon-amount">${addon.price}</span>
                  <span className="addon-unit">{addon.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={openFaq === i ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Packages;
