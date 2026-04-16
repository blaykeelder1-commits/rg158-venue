import { useState } from 'react';
import { venueInfo } from '../data/venueInfo';
import usePageTitle from '../hooks/usePageTitle';
import './Gallery.css';

const photos = [
  { src: '/gallery/venue-main.jpg', alt: 'RG 158 main bar and stage area', category: 'venue' },
  { src: '/gallery/bar-area.jpg', alt: 'Full bar with craft cocktails', category: 'bar' },
  { src: '/gallery/stage-lights.jpg', alt: 'Stage with concert lighting', category: 'stage' },
  { src: '/gallery/vip-upstairs.jpg', alt: 'Upstairs VIP lounge', category: 'vip' },
  { src: '/gallery/event-setup.jpg', alt: 'Event setup with seating', category: 'events' },
  { src: '/gallery/sound-system.jpg', alt: 'Professional sound system', category: 'stage' },
  { src: '/gallery/crowd-event.jpg', alt: 'Live event at RG 158', category: 'events' },
  { src: '/gallery/bar-drinks.jpg', alt: 'Signature drinks at the bar', category: 'bar' },
  { src: '/gallery/projector-screen.jpg', alt: 'Large projector screen', category: 'venue' },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'venue', label: 'Venue' },
  { id: 'bar', label: 'Bar' },
  { id: 'stage', label: 'Stage & Sound' },
  { id: 'vip', label: 'VIP' },
  { id: 'events', label: 'Events' },
];

function Gallery() {
  usePageTitle('Photo Gallery');
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <div className="gallery-page">
      <div className="page-header">
        <div className="container">
          <h1>Gallery</h1>
          <p>See the space. Imagine your event.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="gallery-filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filtered.map((photo, i) => (
              <div
                key={i}
                className="gallery-item"
                onClick={() => setLightbox(photo)}
              >
                <div className="gallery-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>{photo.alt}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-social-cta">
            <p>See more on our social media</p>
            <div className="social-links">
              <a href={venueInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Instagram
              </a>
              <a href={venueInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Facebook
              </a>
              <a href={venueInfo.social.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" aria-label="Close">&times;</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>{lightbox.alt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
