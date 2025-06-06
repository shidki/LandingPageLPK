import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: '#1B1B1B',
      padding: '40px 20px',
      opacity: ".9"
    }}>
      {/* Desktop Menu */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '50px',
        fontSize: '1.12rem',
        width: '100%'
      }} className="desktop-menu">
        <Link to="/home" 
            style={{ textDecoration: 'none', color: hoveredItem === 'home' ? '#bababa' : '#fff' , textTransform: "capitalize" }}
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
        >
          Beranda
        </Link>
        <Link to="/program" style={{ textDecoration: 'none', color: hoveredItem === 'program' ? '#bababa' : '#fff' , textTransform: "capitalize" }}
            onMouseEnter={() => setHoveredItem('program')}
            onMouseLeave={() => setHoveredItem(null)}
        >
          program
        </Link>
        <Link to="/galeri" style={{ textDecoration: 'none', color: hoveredItem === 'galeri' ? '#bababa' : '#fff' , textTransform: "capitalize" }}
            onMouseEnter={() => setHoveredItem('galeri')}
            onMouseLeave={() => setHoveredItem(null)}
        >
          galeri
        </Link>
        <Link to="/fasilitas" style={{ textDecoration: 'none', color: hoveredItem === 'fasilitas' ? '#bababa' : '#fff' , textTransform: "capitalize" }}
            onMouseEnter={() => setHoveredItem('fasilitas')}
            onMouseLeave={() => setHoveredItem(null)}
        >
          Fasilitas
        </Link>
        <Link to="/contact" style={{ textDecoration: 'none', color: hoveredItem === 'contact' ? '#bababa' : '#fff' , textTransform: "capitalize" }}
            onMouseEnter={() => setHoveredItem('contact')}
            onMouseLeave={() => setHoveredItem(null)}
        >
          Kontak
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <div style={{
        display: 'none',
        alignItems: 'center'
      }} className="mobile-header">
        <button 
          onClick={toggleMenu}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px'
          }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#1c1c1c',
          display: 'none',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px',
          borderTop: '1px solid #333'
        }} className="mobile-menu">
          <Link 
            to="/home" 
            style={{ textDecoration: 'none', color: '#fff', textTransform: "capitalize", fontSize: '1.1rem' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Beranda
          </Link>
          <Link 
            to="/program" 
            style={{ textDecoration: 'none', color: '#fff', textTransform: "capitalize", fontSize: '1.1rem' }}
            onClick={() => setIsMenuOpen(false)}
          >
            program
          </Link>
          <Link 
            to="/galeri" 
            style={{ textDecoration: 'none', color: '#fff', textTransform: "capitalize", fontSize: '1.1rem' }}
            onClick={() => setIsMenuOpen(false)}
          >
            galeri
          </Link>
          <Link 
            to="/fasilitas" 
            style={{ textDecoration: 'none', color: '#fff', textTransform: "capitalize", fontSize: '1.1rem' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Fasilitas
          </Link>
          <Link 
            to="/contact" 
            style={{ textDecoration: 'none', color: '#fff', textTransform: "capitalize", fontSize: '1.1rem' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Kontak
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 800px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .mobile-menu {
            display: flex !important;
          }
        }
        
        @media (min-width: 801px) {
          .mobile-header {
            display: none !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}