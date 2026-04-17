import { useEffect, useState } from 'react';
import { venueInfo } from '../data/venueInfo';
import usePageTitle from '../hooks/usePageTitle';
import './Gallery.css';

const photos = [
  { src: '/gallery/venue-main',         alt: 'View of the stage and full color lighting from upstairs',    category: 'venue' },
  { src: '/gallery/main-bar-wide',      alt: 'Long main bar with magenta and blue LED accent lighting',    category: 'bar' },
  { src: '/gallery/bar-area',           alt: 'Main bar from another angle with TVs and bar stools',        category: 'bar' },
  { src: '/gallery/stage-lights',       alt: 'Concert lighting rig and PA speakers above the stage',       category: 'stage' },
  { src: '/gallery/sound-system',       alt: 'Professional sound system and stage rig',                    category: 'stage' },
  { src: '/gallery/vip-upstairs',       alt: 'Upstairs VIP balcony lounge with blue LED rail',             category: 'vip' },
  { src: '/gallery/upstairs-lounge',    alt: 'Upstairs lounge with seating and ambient lighting',          category: 'vip' },
  { src: '/gallery/event-setup',        alt: 'Private VIP cabanas with sheer white curtains',              category: 'events' },
  { src: '/gallery/vip-cabanas-close',  alt: 'Cabana seating area set up for an event',                    category: 'events' },
  { src: '/gallery/crowd-event',        alt: 'Dance floor with multicolor disco lighting',                 category: 'events' },
  { src: '/gallery/bar-drinks',         alt: 'Private back bar with full liquor selection',                category: 'bar' },
  { src: '/gallery/bar-tvs',            alt: 'Bar with TVs for game day',                                  category: 'bar' },
  { src: '/gallery/projector-screen',   alt: 'Large projector screen for presentations and game day',      category: 'venue' },
  { src: '/gallery/neon-logo',          alt: 'RG 158 neon brand sign in purple',                           category: 'venue' },
  { src: '/gallery/neon-logo-pink',     alt: 'RG 158 neon brand sign in pink',                             category: 'venue' },
];

const videos = [
  { src: '/videos/sizzle-reel.mp4',         poster: '/sizzle-poster.jpg',          alt: 'Full venue sizzle reel',          label: 'The Full Tour' },
  { src: '/videos/feature-bar.mp4',         poster: '/gallery/main-bar-wide.jpg',  alt: 'Main bar walk-through',           label: 'The Main Bar' },
  { src: '/videos/feature-stage.mp4',       poster: '/gallery/stage-lights.jpg',   alt: 'Stage lighting and sound',        label: 'Stage & Lights' },
  { src: '/videos/feature-vip.mp4',         poster: '/gallery/event-setup.jpg',    alt: 'VIP cabanas and private bar',     label: 'VIP & Cabanas' },
  { src: '/videos/feature-dancefloor.mp4',  poster: '/gallery/crowd-event.jpg',    alt: 'Dance floor with disco lighting', label: 'Dance Floor' },
];

const categories = [
  { id: 'all',    label: 'All' },
  { id: 'video',  label: 'Video' },
  { id: 'venue',  label: 'Venue' },
  { id: 'bar',    label: 'Bar' },
  { id: 'stage',  label: 'Stage & Sound' },
  { id: 'vip',    label: 'VIP' },
  { id: 'events', label: 'Events' },
];

function Gallery() {
  usePageTitle('Photo Gallery');
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const showVideos = filter === 'all' || filter === 'video';
  const filteredPhotos = filter === 'all' || filter === 'video'
    ? (filter === 'video' ? [] : photos)
    : photos.filter(p => p.category === filter);

  // ESC to close lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

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

          {showVideos && (
            <div className="gallery-videos-grid">
              {videos.map((v, i) => (
                <div
                  key={i}
                  className="gallery-video-item"
                  onClick={() => setLightbox({ type: 'video', ...v })}
                >
                  <img src={v.poster} alt={v.alt} loading="lazy" />
                  <div className="play-overlay" aria-hidden="true">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  </div>
                  <span className="video-label">{v.label}</span>
                </div>
              ))}
            </div>
          )}

          {filteredPhotos.length > 0 && (
            <div className="gallery-grid">
              {filteredPhotos.map((photo, i) => (
                <button
                  key={i}
                  className="gallery-item"
                  onClick={() => setLightbox({ type: 'image', ...photo })}
                  aria-label={`Open ${photo.alt}`}
                >
                  <picture>
                    <source srcSet={`${photo.src}.webp`} type="image/webp" />
                    <img src={`${photo.src}.jpg`} alt={photo.alt} loading="lazy" />
                  </picture>
                </button>
              ))}
            </div>
          )}

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
          <button className="lightbox-close" aria-label="Close" onClick={() => setLightbox(null)}>&times;</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'image' ? (
              <picture>
                <source srcSet={`${lightbox.src}.webp`} type="image/webp" />
                <img src={`${lightbox.src}.jpg`} alt={lightbox.alt} />
              </picture>
            ) : (
              <video controls autoPlay poster={lightbox.poster}>
                <source src={lightbox.src} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
