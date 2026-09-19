import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiTruck, FiMap, FiUsers, FiNavigation, FiMapPin,
  FiCalendar, FiPhone, FiMail, FiStar, FiShield,
  FiClock, FiHeart, FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import { getFAQs } from '../services/faqService'
import './HomePage.css'

const services = [
  { icon: <FiTruck />, title: 'Car Travel', desc: 'Comfortable cars with experienced drivers for outstation and local travel.' },
  { icon: <FiNavigation />, title: 'Bus Travel', desc: 'Spacious buses for group travel, tours, and events.' },
  { icon: <FiMap />, title: 'Bus Tours', desc: 'Organized bus tours to popular destinations and temples.' },
  { icon: <FiHeart />, title: 'Family Trips', desc: 'Customized family travel packages for a memorable experience.' },
  { icon: <FiUsers />, title: 'Group Travel', desc: 'Vehicles and tours designed for large groups and gatherings.' },
  { icon: <FiMapPin />, title: 'Temple Tours', desc: 'Tours to famous temples and pilgrimage sites.' },
  { icon: <FiNavigation />, title: 'Outstation Travel', desc: 'Long-distance travel services across cities and states.' },
  { icon: <FiCalendar />, title: 'Custom Trips', desc: 'Personalized travel plans tailored to your needs.' },
]

const whyChooseUs = [
  { icon: <FiStar />, title: 'Comfortable Travel', desc: 'Well-maintained vehicles for a smooth journey.' },
  { icon: <FiShield />, title: 'Experienced Drivers', desc: 'Professional and knowledgeable drivers for safe travel.' },
  { icon: <FiTruck />, title: 'Cars and Buses', desc: 'Wide range of cars and buses to choose from.' },
  { icon: <FiUsers />, title: 'Group Travel', desc: 'Solutions for groups of all sizes.' },
  { icon: <FiMapPin />, title: 'Temple Tours', desc: 'Specialized tours to famous temples and pilgrimages.' },
  { icon: <FiClock />, title: 'Easy Booking', desc: 'Simple booking process via phone, email, or website.' },
]

export default function HomePage() {
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    getFAQs().then(res => setFaqs(res.data)).catch(() => {})
  }, [])

  return (
    <div className="home-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-pattern"></div>
        <div className="container hero-content">
          <div className="hero-text fade-in-up">
            <span className="hero-badge">🚌 Car & Bus Travel Services</span>
            <h1>Sri Veerabhadra<br />Tours and Travels</h1>
            <p className="hero-subtitle">Travel with comfort. Explore with confidence.</p>
            <p className="hero-desc">
              Your trusted travel partner since 1999 for car rentals, bus tours, family trips, temple tours, 
              and custom travel across destinations. Managed by P.V. Durga Rao.
            </p>
            <div className="hero-buttons">
              <Link to="/vehicles" className="btn btn-primary btn-lg" id="hero-explore-vehicles">
                Explore Vehicles
              </Link>
              <Link to="/booking" className="btn btn-outline-gold btn-lg" id="hero-plan-trip">
                Plan Your Trip
              </Link>
            </div>
            <div className="hero-contact">
              <a href="tel:9542659999" className="hero-contact-item">
                <FiPhone /> 9542659999
              </a>
              <a href="mailto:sriveerabhadratoursandtravels@gmail.com" className="hero-contact-item">
                <FiMail /> Email Us
              </a>
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="hero-card">
              <div className="hero-card-icon">🚌</div>
              <h3>Ready to Travel?</h3>
              <p>Book cars and buses for your next journey</p>
              <Link to="/booking" className="btn btn-primary btn-sm">Book Now</Link>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--color-cream)"/>
          </svg>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="section" id="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Travel Services</h2>
            <div className="gold-line"></div>
            <p>Comprehensive travel solutions for every journey</p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div className="service-card card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="card-body">
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-text">{service.desc}</p>
                  <Link to="/booking" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                    Inquire Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section why-section" id="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Travel With Us</h2>
            <div className="gold-line"></div>
            <p>What makes Sri Veerabhadra Tours and Travels your ideal travel partner</p>
          </div>
          <div className="why-grid">
            {whyChooseUs.map((item, i) => (
              <div className="why-card" key={i}>
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPANY INFO ===== */}
      <section className="section company-section" id="company-info">
        <div className="container">
          <div className="company-card">
            <div className="company-info-left">
              <div className="company-logo-big">SV</div>
              <h2>Sri Veerabhadra Tours and Travels</h2>
              <p className="company-owner">Owner: P.V. Durga Rao</p>
            </div>
            <div className="company-info-right">
              <div className="company-contact-item">
                <FiPhone size={20} />
                <div>
                  <span>Call Us</span>
                  <a href="tel:9542659999">9542659999</a>
                </div>
              </div>
              <div className="company-contact-item">
                <FiMail size={20} />
                <div>
                  <span>Email Us</span>
                  <a href="mailto:sriveerabhadratoursandtravels@gmail.com">
                    sriveerabhadratoursandtravels@gmail.com
                  </a>
                </div>
              </div>
              <div className="company-buttons">
                <a href="tel:9542659999" className="btn btn-primary">Call Now</a>
                <Link to="/booking" className="btn btn-secondary">Book Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      {faqs.length > 0 && (
        <section className="section" id="faq-section">
          <div className="container">
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
              <div className="gold-line"></div>
              <p>Quick answers to common questions</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={faq._id || i}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.question}</span>
                    {openFaq === i ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {openFaq === i && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Book a car or bus today. Contact us for custom travel plans.</p>
            <div className="cta-buttons">
              <Link to="/booking" className="btn btn-primary btn-lg">Book Now</Link>
              <a href="tel:9542659999" className="btn btn-outline-gold btn-lg">
                <FiPhone /> Call 9542659999
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
