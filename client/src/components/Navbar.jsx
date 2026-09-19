import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'
import './Navbar.css'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/vehicles', label: 'Vehicles' },
  { path: '/bus-tours', label: 'Bus Tours' },
  { path: '/destinations', label: 'Destinations' },
  { path: '/packages', label: 'Packages' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar({ onOpenChat }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), [])

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <div className="navbar-logo-icon">SV</div>
          <div className="navbar-logo-text">
            <span className="logo-name">Sri Veerabhadra</span>
            <span className="logo-sub">Tours &amp; Travels</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-links" id="navbar-links">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Buttons (Desktop) */}
        <div className="navbar-actions">
          <button className="btn btn-outline-gold btn-sm" onClick={onOpenChat} id="navbar-ask-ai">
            <FiMessageCircle /> Ask AI
          </button>
          <Link to="/booking" className="btn btn-primary btn-sm" id="navbar-book-now">
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggle"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          id="navbar-toggle"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`navbar-mobile-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}
        id="navbar-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Drawer Header */}
        <div className="navbar-mobile-header">
          <Link to="/" className="navbar-mobile-brand" onClick={closeMobile}>
            <div className="navbar-logo-icon">SV</div>
            <div className="navbar-logo-text">
              <span className="logo-name">Sri Veerabhadra</span>
              <span className="logo-sub">Tours &amp; Travels</span>
            </div>
          </Link>
          <button
            className="navbar-mobile-close"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <ul className="navbar-mobile-links">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`mobile-link ${location.pathname === path ? 'active' : ''}`}
                onClick={closeMobile}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Action Buttons */}
        <div className="navbar-mobile-actions">
          <button
            className="btn btn-outline-gold btn-sm mobile-btn"
            onClick={() => { onOpenChat(); closeMobile(); }}
          >
            <FiMessageCircle /> Ask AI
          </button>
          <Link
            to="/booking"
            className="btn btn-primary btn-sm mobile-btn"
            onClick={closeMobile}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  )
}
