import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">SV</div>
              <div>
                <h3>Sri Veerabhadra</h3>
                <span>Tours & Travels</span>
              </div>
            </div>
            <p className="footer-description">
              Travel with comfort. Explore with confidence. Car and bus travel services for all your journey needs.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/vehicles">Vehicles</Link></li>
              <li><Link to="/bus-tours">Bus Tours</Link></li>
              <li><Link to="/packages">Packages</Link></li>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/booking">Book Now</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>Car Travel</li>
              <li>Bus Travel</li>
              <li>Temple Tours</li>
              <li>Family Trips</li>
              <li>Custom Trips</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <FiPhone />
                <a href="tel:9542659999">9542659999</a>
              </div>
              <div className="footer-contact-item">
                <FiMail />
                <a href="mailto:sriveerabhadratoursandtravels@gmail.com">
                  sriveerabhadratoursandtravels@gmail.com
                </a>
              </div>
            </div>
            <p className="footer-owner">Owner: P.V. Durga Rao</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sri Veerabhadra Tours and Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
