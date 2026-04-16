import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import Gallery from './pages/Gallery';
import Book from './pages/Book';
import BookingConfirmation from './pages/BookingConfirmation';
import Catering from './pages/Catering';
import Contact from './pages/Contact';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/book" element={<Book />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/catering" element={<Catering />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
