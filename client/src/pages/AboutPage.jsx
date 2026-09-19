import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiTruck, FiMap, FiUsers, FiHeart, FiMapPin, FiCalendar } from 'react-icons/fi'

export default function AboutPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>Learn about Sri Veerabhadra Tours and Travels</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Company Info */}
            <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 'var(--space-xl)' }}>
                <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-dark-navy)', fontFamily: 'var(--font-heading)' }}>SV</div>
                <div>
                  <h2 style={{ fontSize: '1.5rem' }}>Sri Veerabhadra Tours and Travels</h2>
                  <p style={{ color: 'var(--color-gold-dark)', fontWeight: 500 }}>Owner: P.V. Durga Rao</p>
                </div>
              </div>

              <p style={{ color: 'var(--color-text-medium)', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>
                Sri Veerabhadra Tours and Travels provides comprehensive car and bus travel services.
                We offer a range of travel solutions including car rentals, bus tours, temple tours,
                family trips, group travel, outstation travel, and custom trip planning.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)' }}>
                  <FiPhone size={18} style={{ color: 'var(--color-gold-dark)' }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Phone</span>
                    <a href="tel:9542659999" style={{ fontWeight: 600 }}>9542659999</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)' }}>
                  <FiMail size={18} style={{ color: 'var(--color-gold-dark)' }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Email</span>
                    <a href="mailto:sriveerabhadratoursandtravels@gmail.com" style={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      sriveerabhadratoursandtravels@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Our Travel Services</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { icon: <FiTruck />, name: 'Car Travel' },
                  { icon: <FiTruck />, name: 'Bus Travel' },
                  { icon: <FiMap />, name: 'Bus Tours' },
                  { icon: <FiHeart />, name: 'Family Trips' },
                  { icon: <FiUsers />, name: 'Group Travel' },
                  { icon: <FiMapPin />, name: 'Temple Tours' },
                  { icon: <FiMap />, name: 'Outstation Travel' },
                  { icon: <FiCalendar />, name: 'Custom Trips' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(26, 60, 52, 0.04)' }}>
                    <span style={{ color: 'var(--color-dark-green)', fontSize: '1.1rem' }}>{s.icon}</span>
                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/vehicles" className="btn btn-primary">View Vehicles</Link>
                <Link to="/booking" className="btn btn-secondary">Book Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
