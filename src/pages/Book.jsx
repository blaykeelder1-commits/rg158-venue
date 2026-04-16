import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { packages, addOns, eventTypes } from '../data/packages';
import usePageTitle from '../hooks/usePageTitle';
import './Book.css';

function Calendar({ selectedDate, onSelect }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();

  const prevMonth = () => {
    setViewDate(v => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  };

  const nextMonth = () => {
    setViewDate(v => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  };

  const monthName = new Date(viewDate.year, viewDate.month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const canGoPrev = viewDate.year > today.getFullYear() || viewDate.month > today.getMonth();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="cal-day empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewDate.year, viewDate.month, d);
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = date < today;
    const isSelected = selectedDate === dateStr;

    days.push(
      <button
        key={d}
        className={`cal-day ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
        disabled={isPast}
        onClick={() => !isPast && onSelect(dateStr)}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button onClick={prevMonth} disabled={!canGoPrev} className="cal-nav">&lsaquo;</button>
        <span className="cal-month">{monthName}</span>
        <button onClick={nextMonth} className="cal-nav">&rsaquo;</button>
      </div>
      <div className="cal-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
      </div>
      <div className="cal-grid">{days}</div>
    </div>
  );
}

function Book() {
  usePageTitle('Book Your Event');
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('package') || '';

  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(preselected);
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [eventType, setEventType] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [wantsCatering, setWantsCatering] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const pkg = packages.find(p => p.id === selectedPackage);

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const total = useMemo(() => {
    if (!pkg) return 0;
    let sum = pkg.price;
    for (const id of selectedAddOns) {
      const addon = addOns.find(a => a.id === id);
      if (!addon) continue;
      if (addon.unit === '/person' && guestCount) {
        sum += addon.price * parseInt(guestCount);
      } else if (addon.unit === '/hour') {
        sum += addon.price;
      } else {
        sum += addon.price;
      }
    }
    return sum;
  }, [pkg, selectedAddOns, guestCount]);

  const canProceed = () => {
    if (step === 1) return selectedPackage && eventDate;
    if (step === 2) return guestCount && eventType;
    if (step === 3) return contact.name && contact.phone && contact.email;
    return false;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/create-venue-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          packageName: pkg.name,
          packagePrice: pkg.price,
          eventDate,
          guestCount: parseInt(guestCount),
          eventType,
          addOns: selectedAddOns,
          wantsCatering,
          contact,
          total,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Failed to create checkout. Please call us at (251) 217-2273.');
      }
    } catch {
      setError('Something went wrong. Please try again or call us at (251) 217-2273.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="book-page">
      <div className="page-header">
        <div className="container">
          <h1>Book Your Event</h1>
          <p>Secure your date in just a few steps</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Progress */}
          <div className="booking-progress">
            {['Package & Date', 'Event Details', 'Contact Info', 'Review & Pay'].map((label, i) => (
              <div key={i} className={`progress-step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                <div className="step-number">{step > i + 1 ? '\u2713' : i + 1}</div>
                <span className="step-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="booking-form">
            {/* Step 1: Package & Date */}
            {step === 1 && (
              <div className="step-content">
                <h2>Select Your Package</h2>
                <div className="package-selector">
                  {packages.map(p => (
                    <button
                      key={p.id}
                      className={`package-option ${selectedPackage === p.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPackage(p.id)}
                    >
                      <div className="option-header">
                        <span className="option-name">{p.name}</span>
                        <span className="option-price">{p.priceLabel}</span>
                      </div>
                      <span className="option-detail">{p.duration} &middot; {p.capacity}</span>
                    </button>
                  ))}
                </div>

                <h2 style={{ marginTop: 'var(--spacing-2xl)' }}>Choose Your Date</h2>
                <Calendar selectedDate={eventDate} onSelect={setEventDate} />
                {eventDate && (
                  <p className="selected-date">
                    Selected: <strong>{formatDate(eventDate)}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Event Details */}
            {step === 2 && (
              <div className="step-content">
                <h2>Event Details</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="guestCount">Expected Guests *</label>
                    <input
                      type="number"
                      id="guestCount"
                      value={guestCount}
                      onChange={e => setGuestCount(e.target.value)}
                      min="10"
                      max="200"
                      placeholder="e.g., 75"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventType">Event Type *</label>
                    <select
                      id="eventType"
                      value={eventType}
                      onChange={e => setEventType(e.target.value)}
                      required
                    >
                      <option value="">Select type</option>
                      {eventTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <h3 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)', fontSize: 'var(--text-xl)' }}>
                  Add-Ons (Optional)
                </h3>
                <div className="addon-selector">
                  {addOns.map(addon => (
                    <label key={addon.id} className={`addon-option ${selectedAddOns.includes(addon.id) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(addon.id)}
                        onChange={() => toggleAddOn(addon.id)}
                      />
                      <div className="addon-option-info">
                        <span className="addon-option-name">{addon.name}</span>
                        <span className="addon-option-desc">{addon.description}</span>
                      </div>
                      <span className="addon-option-price">${addon.price}{addon.unit}</span>
                    </label>
                  ))}
                </div>

                <div className="catering-toggle">
                  <label className={`catering-option ${wantsCatering ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={wantsCatering}
                      onChange={e => setWantsCatering(e.target.checked)}
                    />
                    <div>
                      <span className="catering-option-title">Add J Rodgers BBQ Catering</span>
                      <span className="catering-option-desc">
                        We'll reach out to customize your menu. Starting at ${pkg?.cateringFrom}/person.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div className="step-content">
                <h2>Your Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={contact.name}
                      onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={contact.phone}
                      onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={contact.email}
                    onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Special Requests or Notes</label>
                  <textarea
                    id="message"
                    value={contact.message}
                    onChange={e => setContact(c => ({ ...c, message: e.target.value }))}
                    rows="4"
                    placeholder="Anything we should know about your event..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="step-content">
                <h2>Review Your Booking</h2>
                <div className="review-card">
                  <div className="review-section">
                    <h4>Package</h4>
                    <p className="review-value">{pkg?.name} — {pkg?.priceLabel}</p>
                    <p className="review-detail">{pkg?.duration} &middot; {pkg?.capacity}</p>
                  </div>
                  <div className="review-section">
                    <h4>Event</h4>
                    <p className="review-value">{formatDate(eventDate)}</p>
                    <p className="review-detail">{guestCount} guests &middot; {eventType}</p>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <div className="review-section">
                      <h4>Add-Ons</h4>
                      {selectedAddOns.map(id => {
                        const addon = addOns.find(a => a.id === id);
                        return (
                          <p key={id} className="review-addon">
                            {addon.name} — ${addon.price}{addon.unit}
                          </p>
                        );
                      })}
                    </div>
                  )}
                  {wantsCatering && (
                    <div className="review-section">
                      <h4>Catering</h4>
                      <p className="review-value">J Rodgers BBQ (we'll contact you to customize)</p>
                    </div>
                  )}
                  <div className="review-section">
                    <h4>Contact</h4>
                    <p className="review-value">{contact.name}</p>
                    <p className="review-detail">{contact.phone} &middot; {contact.email}</p>
                    {contact.message && <p className="review-detail">"{contact.message}"</p>}
                  </div>
                  <div className="review-total">
                    <span>Deposit Due (50%)</span>
                    <span className="total-amount">${Math.round(total / 2).toLocaleString()}</span>
                  </div>
                  <p className="review-note">
                    You'll be redirected to Square to pay your 50% deposit.
                    Remaining balance is due 7 days before your event.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="booking-nav">
              {step > 1 && (
                <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>
                  Back
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < 4 ? (
                <button
                  className="btn btn-primary"
                  disabled={!canProceed()}
                  onClick={() => setStep(s => s + 1)}
                >
                  Continue
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Pay $${Math.round(total / 2).toLocaleString()} Deposit`}
                </button>
              )}
            </div>
            {error && <p className="booking-error">{error}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Book;
